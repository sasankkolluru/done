import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import Faculty from '../models/Faculty.js';
import Exam from '../models/Exam.js';
import Classroom from '../models/Classroom.js';
import InvigilationDuty from '../models/InvigilationDuty.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Generate invigilation schedule
// @route   POST /api/invigilation/generate
// @access  Private/Admin
export const generateSchedule = asyncHandler(async (req, res, next) => {
  const { examId } = req.body;

  // 1. Get the exam details
  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new ErrorResponse(`Exam not found with id of ${examId}`, 404));
  }

  // 2. Get all available classrooms
  const classrooms = await Classroom.find({ isActive: true });
  if (classrooms.length === 0) {
    return next(new ErrorResponse('No active classrooms found', 400));
  }

  // 3. Get all available faculty
  const facultyList = await Faculty.find({ isAvailable: true });
  if (facultyList.length === 0) {
    return next(new ErrorResponse('No available faculty found', 400));
  }

  // 4. Generate schedule using the allocation algorithm
  const schedule = await allocateInvigilators(exam, classrooms, facultyList);

  // 5. Save the generated schedule
  const createdDuties = await InvigilationDuty.insertMany(schedule);

  res.status(200).json({
    success: true,
    count: createdDuties.length,
    data: createdDuties
  });
});

// @desc    Get all invigilation duties
// @route   GET /api/invigilation
// @access  Private
export const getDuties = asyncHandler(async (req, res, next) => {
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
  let query = InvigilationDuty.find(JSON.parse(queryStr))
    .populate('exam', 'examName examType academicYear semester')
    .populate('classroom', 'roomNumber building floor capacity')
    .populate('faculty', 'name email department designation');

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
    query = query.sort('date startTime');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await InvigilationDuty.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const duties = await query;

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
    count: duties.length,
    pagination,
    data: duties
  });
});

// @desc    Get single invigilation duty
// @route   GET /api/invigilation/:id
// @access  Private
export const getDuty = asyncHandler(async (req, res, next) => {
  const duty = await InvigilationDuty.findById(req.params.id)
    .populate('exam', 'examName examType academicYear semester')
    .populate('classroom', 'roomNumber building floor capacity')
    .populate('faculty', 'name email department designation');

  if (!duty) {
    return next(
      new ErrorResponse(`Duty not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: duty
  });
});

// @desc    Create new invigilation duty
// @route   POST /api/invigilation
// @access  Private/Admin
export const createDuty = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const duty = await InvigilationDuty.create(req.body);

  res.status(201).json({
    success: true,
    data: duty
  });
});

// @desc    Update invigilation duty
// @route   PUT /api/invigilation/:id
// @access  Private/Admin
export const updateDuty = asyncHandler(async (req, res, next) => {
  let duty = await InvigilationDuty.findById(req.params.id);

  if (!duty) {
    return next(
      new ErrorResponse(`Duty not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or the duty creator
  if (duty.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this duty`,
        401
      )
    );
  }

  // Add updatedBy
  req.body.updatedBy = req.user.id;

  duty = await InvigilationDuty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: duty
  });
});

// @desc    Delete invigilation duty
// @route   DELETE /api/invigilation/:id
// @access  Private/Admin
export const deleteDuty = asyncHandler(async (req, res, next) => {
  const duty = await InvigilationDuty.findById(req.params.id);

  if (!duty) {
    return next(
      new ErrorResponse(`Duty not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or the duty creator
  if (duty.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this duty`,
        401
      )
    );
  }

  await duty.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Request duty replacement
// @route   PUT /api/invigilation/:id/replace
// @access  Private
export const requestReplacement = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new ErrorResponse('Please provide a reason for replacement', 400));
  }

  let duty = await InvigilationDuty.findById(req.params.id);

  if (!duty) {
    return next(
      new ErrorResponse(`Duty not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if the request is from the assigned faculty
  if (duty.faculty.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to request replacement for this duty`,
        401
      )
    );
  }

  // Update duty with replacement request
  duty.replacement = {
    faculty: req.user.id,
    reason,
    status: 'PENDING',
    requestedAt: Date.now()
  };

  await duty.save();

  res.status(200).json({
    success: true,
    data: duty
  });
});

// @desc    Approve/Reject duty replacement
// @route   PUT /api/invigilation/:id/replace/:action
// @access  Private/Admin
export const processReplacement = asyncHandler(async (req, res, next) => {
  const { action } = req.params;
  const { replacementFacultyId, reason } = req.body;

  if (!['approve', 'reject'].includes(action)) {
    return next(new ErrorResponse('Invalid action', 400));
  }

  let duty = await InvigilationDuty.findById(req.params.id);

  if (!duty) {
    return next(
      new ErrorResponse(`Duty not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if there's a pending replacement request
  if (!duty.replacement || duty.replacement.status !== 'PENDING') {
    return next(new ErrorResponse('No pending replacement request found', 400));
  }

  if (action === 'approve') {
    if (!replacementFacultyId) {
      return next(new ErrorResponse('Please provide a replacement faculty ID', 400));
    }

    // Check if replacement faculty exists
    const replacementFaculty = await Faculty.findById(replacementFacultyId);
    if (!replacementFaculty || !replacementFaculty.isAvailable) {
      return next(new ErrorResponse('Replacement faculty not available', 400));
    }

    // Update duty with new faculty
    duty.faculty = replacementFacultyId;
    duty.replacement.status = 'APPROVED';
    duty.replacement.processedBy = req.user.id;
    duty.replacement.processedAt = Date.now();
    duty.status = 'REPLACED';
  } else {
    // Reject the replacement request
    duty.replacement.status = 'REJECTED';
    duty.replacement.processedBy = req.user.id;
    duty.replacement.processedAt = Date.now();
    duty.replacement.reason = reason || 'Replacement request rejected';
  }

  await duty.save();

  res.status(200).json({
    success: true,
    data: duty
  });
});

// @desc    Generate PDF for duty letter
// @route   GET /api/invigilation/:id/letter
// @access  Private
export const generateDutyLetter = asyncHandler(async (req, res, next) => {
  const duty = await InvigilationDuty.findById(req.params.id)
    .populate('exam', 'examName examType academicYear semester')
    .populate('classroom', 'roomNumber building floor')
    .populate('faculty', 'name email department designation');

  if (!duty) {
    return next(
      new ErrorResponse(`Duty not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is authorized to view this duty letter
  if (
    duty.faculty._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this duty letter`,
        401
      )
    );
  }

  // Generate PDF (simplified example)
  const doc = {
    content: [
      { text: 'INVIGILATION DUTY LETTER', style: 'header' },
      { text: '\n\n' },
      {
        text: [
          { text: 'Faculty Name: ', bold: true },
          `${duty.faculty.name}\n`
        ]
      },
      {
        text: [
          { text: 'Department: ', bold: true },
          `${duty.faculty.department}\n\n`
        ]
      },
      {
        text: 'You have been assigned the following invigilation duty:',
        style: 'subheader'
      },
      { text: '\n' },
      {
        style: 'tableExample',
        table: {
          widths: ['*', '*'],
          body: [
            ['Exam', duty.exam.examName],
            ['Date', new Date(duty.date).toLocaleDateString()],
            ['Time', `${duty.startTime} - ${duty.endTime}`],
            ['Room', `${duty.classroom.roomNumber}, ${duty.classroom.building}`],
            ['Floor', duty.classroom.floor]
          ]
        }
      },
      { text: '\n\n' },
      {
        text: 'Please be present at the venue 30 minutes before the scheduled time.',
        style: 'footer'
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      footer: {
        fontSize: 10,
        italics: true
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      }
    },
    defaultStyle: {
      font: 'Helvetica'
    }
  };

  // In a real implementation, use a PDF library like pdfmake or jspdf
  // For now, we'll return the document structure
  res.status(200).json({
    success: true,
    data: doc
  });
});

// Helper function: Allocate invigilators to exams
const allocateInvigilators = async (exam, classrooms, facultyList) => {
  const duties = [];
  const facultyWorkload = new Map();
  const facultyUnavailable = new Map();

  // Initialize faculty workload and unavailable dates
  facultyList.forEach(faculty => {
    facultyWorkload.set(faculty._id.toString(), {
      totalHours: 0,
      duties: 0,
      faculty
    });
    
    if (faculty.unavailableDates && faculty.unavailableDates.length > 0) {
      facultyUnavailable.set(
        faculty._id.toString(),
        faculty.unavailableDates.map(d => new Date(d).toDateString())
      );
    }
  });

  // Sort exams by date and time
  const sortedExams = [...exam.subjects].sort((a, b) => {
    const dateCompare = new Date(a.examDate) - new Date(b.examDate);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  // Assign invigilators to each exam session
  for (const subject of sortedExams) {
    const examDate = new Date(subject.examDate);
    const dateKey = examDate.toDateString();
    
    // Get available classrooms for this exam
    const availableClassrooms = classrooms.filter(
      room => room.capacity >= subject.studentsCount
    );

    if (availableClassrooms.length === 0) {
      console.warn(`No suitable classroom found for ${subject.subjectName}`);
      continue;
    }

    // For each classroom, assign invigilators
    for (const classroom of availableClassrooms) {
      // Find available faculty for this timeslot
      const availableFaculty = Array.from(facultyWorkload.values())
        .filter(({ faculty, totalHours }) => {
          // Check faculty availability
          const isAvailable = faculty.isAvailable && 
            totalHours < faculty.maxHoursPerWeek &&
            faculty.duties < 3; // Max duties per week
          
          if (!isAvailable) return false;
          
          // Check if faculty is unavailable on this date
          const unavailableDates = facultyUnavailable.get(faculty._id.toString()) || [];
          return !unavailableDates.includes(dateKey);
        })
        .sort((a, b) => a.totalHours - b.totalHours || a.duties - b.duties);

      if (availableFaculty.length === 0) {
        console.warn(`No available faculty for ${classroom.roomNumber}`);
        continue;
      }

      // Select faculty with the least workload
      const selectedFaculty = availableFaculty[0];
      const facultyId = selectedFaculty.faculty._id.toString();
      
      // Calculate duty duration in hours
      const start = parseTime(subject.startTime);
      const end = parseTime(subject.endTime);
      const duration = (end - start) / (60 * 60 * 1000); // Convert to hours
      
      // Create duty
      const duty = {
        _id: uuidv4(),
        exam: exam._id,
        subject: {
          subjectCode: subject.subjectCode,
          subjectName: subject.subjectName,
          department: subject.department
        },
        date: examDate,
        startTime: subject.startTime,
        endTime: subject.endTime,
        duration,
        classroom: classroom._id,
        faculty: facultyId,
        status: 'SCHEDULED',
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      duties.push(duty);
      
      // Update faculty workload
      const facultyData = facultyWorkload.get(facultyId);
      facultyData.totalHours += duration;
      facultyData.duties += 1;
    }
  }

  return duties;
};

// Helper function to parse time string to Date object
const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default {
  generateSchedule,
  getDuties,
  getDuty,
  createDuty,
  updateDuty,
  deleteDuty,
  requestReplacement,
  processReplacement,
  generateDutyLetter
};
