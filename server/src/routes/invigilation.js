import express from 'express';
import {
  generateSchedule,
  getDuties,
  getDuty,
  createDuty,
  updateDuty,
  deleteDuty,
  requestReplacement,
  processReplacement,
  generateDutyLetter
} from '../controllers/invigilationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Admin only routes
router.route('/generate')
  .post(authorize('admin'), generateSchedule);

router.route('/')
  .get(getDuties)
  .post(authorize('admin'), createDuty);

router.route('/:id')
  .get(getDuty)
  .put(updateDuty)
  .delete(authorize('admin'), deleteDuty);

router.route('/:id/replace')
  .put(requestReplacement);

router.route('/:id/replace/:action')
  .put(authorize('admin'), processReplacement);

router.route('/:id/letter')
  .get(generateDutyLetter);

export default router;
