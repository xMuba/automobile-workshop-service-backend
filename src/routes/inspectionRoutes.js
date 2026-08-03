import express from 'express';
import {
  getAllInspectionReports,
  getInspectionReportById,
  createInspectionReport,
  updateInspectionReport,
  deleteInspectionReport,
} from '../controllers/inspectionReportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllInspectionReports);
router.post('/', protect, createInspectionReport);
router.get('/:id', protect, getInspectionReportById);
router.put('/:id', protect, updateInspectionReport);
router.delete('/:id', protect, deleteInspectionReport);

export default router;