import express from 'express';
import {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  restockPart,
} from '../controllers/partsInventoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllParts);
router.post('/', protect, createPart);
router.get('/:id', protect, getPartById);
router.put('/:id', protect, updatePart);
router.delete('/:id', protect, deletePart);
router.post('/:id/restock', protect, restockPart);

export default router;