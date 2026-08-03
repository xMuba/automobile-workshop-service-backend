import express from 'express';
import {
  getAllServiceOrders,
  getServiceOrderById,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder,
  addServiceToOrder,
  addPartToOrder,
} from '../controllers/serviceOrderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllServiceOrders);
router.post('/', protect, createServiceOrder);
router.get('/:id', protect, getServiceOrderById);
router.put('/:id', protect, updateServiceOrder);
router.delete('/:id', protect, deleteServiceOrder);
router.post('/:id/services', protect, addServiceToOrder);
router.post('/:id/parts', protect, addPartToOrder);

export default router;