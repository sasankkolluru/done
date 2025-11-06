import express from 'express';
import {
  getClassrooms,
  getClassroom,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getClassroomAvailability,
  getClassroomsByBuilding
} from '../controllers/classroomController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Public routes (no authorization required)
router.route('/')
  .get(getClassrooms);

router.route('/:id')
  .get(getClassroom);

router.route('/building/:building')
  .get(getClassroomsByBuilding);

router.route('/:id/availability')
  .get(getClassroomAvailability);

// Admin only routes
router.route('/')
  .post(authorize('admin'), createClassroom);

router.route('/:id')
  .put(authorize('admin'), updateClassroom)
  .delete(authorize('admin'), deleteClassroom);

export default router;
