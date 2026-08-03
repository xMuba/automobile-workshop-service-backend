import express from 'express';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleServiceHistory,
} from '../controllers/vehicleController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllVehicles);
router.post('/', protect, createVehicle);
router.get('/:id', protect, getVehicleById);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, adminOnly, deleteVehicle);

// Vehicle service history timeline
router.get('/:id/service-history', protect, getVehicleServiceHistory);

export default router;