import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import Exam from '../models/Exam.js';
import InvigilationDuty from '../models/InvigilationDuty.js';

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = asyncHandler(async (req, res, next) => {
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
  let query = Exam.find(JSON.parse(queryStr));

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
    query = query.sort('-startDate');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Exam.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const exams = await query;

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
    count: exams.length,
    pagination,
    data: exams
  });
});

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
export const getExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(
      new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: exam
  });
});

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const exam = await Exam.create(req.body);

  res.status(201).json({
    success: true,
    data: exam
  });
});

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin
export const updateExam = asyncHandler(async (req, res, next) => {
  let exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(
      new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404)
    );
  }

  // Add updatedBy
  req.body.updatedBy = req.user.id;

  exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: exam
  });
});

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin
export const deleteExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(
      new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if there are any invigilation duties for this exam
  const duties = await InvigilationDuty.find({ exam: exam._id });
  
  if (duties.length > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete exam with id ${exam._id} as it has associated invigilation duties`,
        400
      )
    );
  }

  await exam.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get exam statistics
// @route   GET /api/exams/:id/stats
// @access  Private
export const getExamStats = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(
      new ErrorResponse(`Exam not found with id of ${req.params.id}`, 404)
    );
  }

  // Get all invigilation duties for this exam
  const duties = await InvigilationDuty.find({ exam: exam._id })
    .populate('faculty', 'name department')
    .populate('classroom', 'roomNumber building');

  // Calculate statistics
  const totalDuties = duties.length;
  const facultyCount = new Set(duties.map(d => d.faculty._id.toString())).size;
  const classroomCount = new Set(duties.map(d => d.classroom._id.toString())).size;

  // Group by faculty
  const facultyStats = duties.reduce((acc, duty) => {
    const facultyId = duty.faculty._id.toString();
    if (!acc[facultyId]) {
      acc[facultyId] = {
        faculty: duty.faculty,
        count: 0,
        hours: 0,
        duties: []
      };
    }
    acc[facultyId].count += 1;
    acc[facultyId].hours += duty.duration;
    acc[facultyId].duties.push({
      date: duty.date,
      startTime: duty.startTime,
      endTime: duty.endTime,
      classroom: duty.classroom,
      status: duty.status
    });
    return acc;
  }, {});

  // Group by classroom
  const classroomStats = duties.reduce((acc, duty) => {
    const classroomId = duty.classroom._id.toString();
    if (!acc[classroomId]) {
      acc[classroomId] = {
        classroom: duty.classroom,
        count: 0,
        duties: []
      };
    }
    acc[classroomId].count += 1;
    acc[classroomId].duties.push({
      date: duty.date,
      startTime: duty.startTime,
      endTime: duty.endTime,
      faculty: duty.faculty,
      status: duty.status
    });
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      exam: {
        _id: exam._id,
        examName: exam.examName,
        examType: exam.examType,
        academicYear: exam.academicYear,
        semester: exam.semester,
        startDate: exam.startDate,
        endDate: exam.endDate,
        status: exam.status
      },
      statistics: {
        totalDuties,
        facultyCount,
        classroomCount,
        facultyStats: Object.values(facultyStats),
        classroomStats: Object.values(classroomStats)
      }
    }
  });
});

export default {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  getExamStats
};
