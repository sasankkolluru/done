import express from 'express';
import {
  getFaculty,
  getSingleFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  facultyPhotoUpload,
  bulkUploadFaculty
} from '../controllers/facultyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Public routes (no authorization required)
router.route('/')
  .get(getFaculty);

router.route('/:id')
  .get(getSingleFaculty);

// Admin only routes
router.route('/')
  .post(authorize('admin'), createFaculty);

router.route('/:id')
  .put(updateFaculty)
  .delete(authorize('admin'), deleteFaculty);

router.route('/:id/photo')
  .put(protect, facultyPhotoUpload);

router.route('/upload')
  .post(authorize('admin'), bulkUploadFaculty);

export default router;
