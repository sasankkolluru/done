import express from 'express';
import {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  getExamStats
} from '../controllers/examController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Public routes (no authorization required)
router.route('/')
  .get(getExams);

router.route('/:id')
  .get(getExam);

router.route('/:id/stats')
  .get(getExamStats);

// Admin only routes
router.route('/')
  .post(authorize('admin'), createExam);

router.route('/:id')
  .put(authorize('admin'), updateExam)
  .delete(authorize('admin'), deleteExam);

export default router;
