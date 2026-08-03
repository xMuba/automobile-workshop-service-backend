import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllPayments);
router.post('/', protect, createPayment);
router.get('/:id', protect, getPaymentById);
router.put('/:id', protect, updatePayment);
router.delete('/:id', protect, deletePayment);

export default router;