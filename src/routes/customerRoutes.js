import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerVehicles,
  getCustomerAppointments,
} from '../controllers/customerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllCustomers);
router.post('/', protect, createCustomer);
router.get('/:id', protect, getCustomerById);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, adminOnly, deleteCustomer);

// Customer relationship routes
router.get('/:id/vehicles', protect, getCustomerVehicles);
router.get('/:id/appointments', protect, getCustomerAppointments);

export default router;