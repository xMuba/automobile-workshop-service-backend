import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeServiceOrders,
  getEmployeeInspections,
} from '../controllers/employeeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllEmployees);
router.post('/', protect, adminOnly, createEmployee);
router.get('/:id', protect, getEmployeeById);
router.put('/:id', protect, adminOnly, updateEmployee);
router.delete('/:id', protect, adminOnly, deleteEmployee);
router.get('/:id/service-orders', protect, getEmployeeServiceOrders);
router.get('/:id/inspections', protect, getEmployeeInspections);

export default router;