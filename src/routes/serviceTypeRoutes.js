import express from 'express';
import {
  getAllServiceTypes,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType,
} from '../controllers/serviceTypeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllServiceTypes);
router.post('/', protect, createServiceType);
router.get('/:id', protect, getServiceTypeById);
router.put('/:id', protect, updateServiceType);
router.delete('/:id', protect, deleteServiceType);

export default router;