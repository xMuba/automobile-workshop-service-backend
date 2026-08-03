import express from 'express';
import {
  getAllVehicleTypes,
  getVehicleTypeById,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
} from '../controllers/vehicleTypeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllVehicleTypes);
router.post('/', protect, createVehicleType);
router.get('/:id', protect, getVehicleTypeById);
router.put('/:id', protect, updateVehicleType);
router.delete('/:id', protect, deleteVehicleType);

export default router;