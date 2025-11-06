const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Exam = require('../models/Exam');
const DutySchedule = require('../models/DutySchedule');
const ChangeRequest = require('../models/ChangeRequest');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
router.get('/dashboard-stats', protect, authorize('admin'), async (req, res) => {
  try {
    // Get counts from the database
    const [
      totalFaculty,
      totalExams,
      totalSchedules,
      pendingRequests
    ] = await Promise.all([
      User.countDocuments({ role: 'faculty' }),
      Exam.countDocuments(),
      DutySchedule.countDocuments(),
      ChangeRequest.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      data: {
        totalFaculty,
        totalExams,
        totalSchedules,
        pendingRequests
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
