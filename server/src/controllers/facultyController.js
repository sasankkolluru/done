import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import Faculty from '../models/Faculty.js';
import User from '../models/User.js';

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private
export const getFaculty = asyncHandler(async (req, res, next) => {
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
  let query = Faculty.find(JSON.parse(queryStr));

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
    query = query.sort('name');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Faculty.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const faculty = await query;

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
    count: faculty.length,
    pagination,
    data: faculty
  });
});

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Private
export const getSingleFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(
      new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc    Create new faculty
// @route   POST /api/faculty
// @access  Private/Admin
export const createFaculty = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  // Create user account if not exists
  if (req.body.email) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: 'defaultPassword123', // Should be changed on first login
        role: 'faculty',
        faculty: null // Will be set after faculty is created
      });
    }
  }

  const faculty = await Faculty.create(req.body);

  // Update user's faculty reference if user was created
  if (req.body.email) {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { faculty: faculty._id }
    );
  }

  res.status(201).json({
    success: true,
    data: faculty
  });
});

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Private/Admin
export const updateFaculty = asyncHandler(async (req, res, next) => {
  let faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(
      new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or the faculty member
  if (faculty._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this faculty`,
        401
      )
    );
  }

  // Add updatedBy
  req.body.updatedBy = req.user.id;

  faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: faculty
  });
});

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
export const deleteFaculty = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(
      new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete associated user account if exists
  if (faculty.email) {
    await User.findOneAndDelete({ email: faculty.email });
  }

  await faculty.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload faculty photo
// @route   PUT /api/faculty/:id/photo
// @access  Private
export const facultyPhotoUpload = asyncHandler(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(
      new ErrorResponse(`Faculty not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is faculty owner or admin
  if (faculty._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this faculty`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${faculty._id}${path.parse(file.name).ext}`;

  file.mv(
    `${process.env.FILE_UPLOAD_PATH}/faculty/${file.name}`,
    async err => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }

      await Faculty.findByIdAndUpdate(req.params.id, { photo: file.name });

      res.status(200).json({
        success: true,
        data: file.name
      });
    }
  );
});

// @desc    Bulk upload faculty
// @route   POST /api/faculty/upload
// @access  Private/Admin
export const bulkUploadFaculty = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Check if file is CSV or Excel
  if (
    !file.mimetype.includes('csv') &&
    !file.mimetype.includes('spreadsheetml') &&
    !file.mimetype.includes('excel')
  ) {
    return next(new ErrorResponse(`Please upload a CSV or Excel file`, 400));
  }

  // Process the file
  try {
    const results = [];
    const errors = [];

    // In a real implementation, you would parse the CSV/Excel file here
    // and create/update faculty records
    // This is a simplified example

    // Example:
    // const facultyData = parseCSV(file.data.toString());
    // for (const data of facultyData) {
    //   try {
    //     const faculty = await Faculty.create(data);
    //     results.push(faculty);
    //   } catch (err) {
    //     errors.push({ row: data, error: err.message });
    //   }
    // }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    return next(new ErrorResponse(`Error processing file: ${err.message}`, 500));
  }
});

export default {
  getFaculty,
  getSingleFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  facultyPhotoUpload,
  bulkUploadFaculty
};
