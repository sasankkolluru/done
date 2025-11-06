import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import Classroom from '../models/Classroom.js';
import InvigilationDuty from '../models/InvigilationDuty.js';

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Private
export const getClassrooms = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Classroom.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('building roomNumber');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Classroom.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const classrooms = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: classrooms.length,
    pagination,
    data: classrooms
  });
});

// @desc    Get single classroom
// @route   GET /api/classrooms/:id
// @access  Private
export const getClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(
      new ErrorResponse(`Classroom not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: classroom
  });
});

// @desc    Create new classroom
// @route   POST /api/classrooms
// @access  Private/Admin
export const createClassroom = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const classroom = await Classroom.create(req.body);

  res.status(201).json({
    success: true,
    data: classroom
  });
});

// @desc    Update classroom
// @route   PUT /api/classrooms/:id
// @access  Private/Admin
export const updateClassroom = asyncHandler(async (req, res, next) => {
  let classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(
      new ErrorResponse(`Classroom not found with id of ${req.params.id}`, 404)
    );
  }

  // Add updatedBy
  req.body.updatedBy = req.user.id;

  classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: classroom
  });
});

// @desc    Delete classroom
// @route   DELETE /api/classrooms/:id
// @access  Private/Admin
export const deleteClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(
      new ErrorResponse(`Classroom not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if there are any invigilation duties for this classroom
  const duties = await InvigilationDuty.find({ classroom: classroom._id });
  
  if (duties.length > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete classroom with id ${classroom._id} as it has associated invigilation duties`,
        400
      )
    );
  }

  await classroom.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get classroom availability
// @route   GET /api/classrooms/:id/availability
// @access  Private
export const getClassroomAvailability = asyncHandler(async (req, res, next) => {
  const { date } = req.query;
  
  if (!date) {
    return next(
      new ErrorResponse('Please provide a date parameter (YYYY-MM-DD)', 400)
    );
  }

  const classroom = await Classroom.findById(req.params.id);
  
  if (!classroom) {
    return next(
      new ErrorResponse(`Classroom not found with id of ${req.params.id}`, 404)
    );
  }

  // Get all invigilation duties for this classroom on the specified date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const duties = await InvigilationDuty.find({
    classroom: classroom._id,
    date: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $ne: 'CANCELLED' }
  }).select('startTime endTime');

  // Generate available time slots (assuming 30-minute slots from 8 AM to 8 PM)
  const timeSlots = [];
  const startHour = 8; // 8 AM
  const endHour = 20;  // 8 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endTime = minute === 30 
        ? `${(hour + 1).toString().padStart(2, '0')}:00`
        : `${hour.toString().padStart(2, '0')}:30`;
      
      // Check if this time slot is available
      const isBooked = duties.some(duty => {
        return (
          (time >= duty.startTime && time < duty.endTime) ||
          (endTime > duty.startTime && endTime <= duty.endTime) ||
          (time <= duty.startTime && endTime >= duty.endTime)
        );
      });

      timeSlots.push({
        startTime: time,
        endTime: endTime,
        available: !isBooked
      });
    }
  }

  res.status(200).json({
    success: true,
    data: {
      classroom: {
        _id: classroom._id,
        roomNumber: classroom.roomNumber,
        building: classroom.building,
        floor: classroom.floor,
        capacity: classroom.capacity
      },
      date: new Date(date).toISOString().split('T')[0],
      availability: timeSlots,
      bookedSlots: duties
    }
  });
});

// @desc    Get classrooms by building
// @route   GET /api/classrooms/building/:building
// @access  Private
export const getClassroomsByBuilding = asyncHandler(async (req, res, next) => {
  const { building } = req.params;
  const { floor } = req.query;

  const query = { 
    building: new RegExp(`^${building}$`, 'i'),
    isActive: true
  };

  if (floor) {
    query.floor = floor;
  }

  const classrooms = await Classroom.find(query).sort('roomNumber');

  res.status(200).json({
    success: true,
    count: classrooms.length,
    data: classrooms
  });
});

export default {
  getClassrooms,
  getClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getClassroomAvailability,
  getClassroomsByBuilding
};
