import prisma from '../database/prisma.js';

// @desc    Get all parts inventory
// @route   GET /api/parts
export const getAllParts = async (req, res) => {
  try {
    const { supplier_id, low_stock } = req.query;

    const where = {};
    if (supplier_id) where.supplier_id = supplier_id;
    if (low_stock === 'true') {
      where.quantity = { lte: prisma.partsInventory.fields.reorder_level };
    }

    const parts = await prisma.partsInventory.findMany({
      where,
      include: {
        supplier: { select: { supplier_id: true, name: true, phone: true } },
        _count: { select: { partsUsed: true } },
      },
      orderBy: { part_name: 'asc' },
    });

    res.json({
      status: 'success',
      count: parts.length,
      data: { parts },
    });
  } catch (error) {
    console.error('Get parts error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single part
// @route   GET /api/parts/:id
export const getPartById = async (req, res) => {
  try {
    const { id } = req.params;

    const part = await prisma.partsInventory.findUnique({
      where: { part_id: id },
      include: {
        supplier: true,
        partsUsed: {
          include: {
            serviceOrder: {
              select: {
                order_id: true,
                status: true,
                vehicle: { select: { registration_no: true } },
              },
            },
          },
          orderBy: { parts_used_id: 'desc' },
          take: 20,
        },
      },
    });

    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    res.json({ status: 'success', data: { part } });
  } catch (error) {
    console.error('Get part error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create part
// @route   POST /api/parts
export const createPart = async (req, res) => {
  try {
    const {
      supplier_id,
      part_name,
      part_number,
      quantity,
      unit_price,
      reorder_level,
    } = req.body;

    if (!supplier_id || !part_name) {
      return res.status(400).json({
        status: 'error',
        message: 'Supplier ID and part name are required',
      });
    }

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { supplier_id },
    });
    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }

    const part = await prisma.partsInventory.create({
      data: {
        supplier_id,
        part_name,
        part_number: part_number || null,
        quantity: quantity !== undefined ? parseInt(quantity) : 0,
        unit_price: unit_price ? parseFloat(unit_price) : null,
        reorder_level: reorder_level !== undefined ? parseInt(reorder_level) : 10,
      },
      include: {
        supplier: { select: { supplier_id: true, name: true } },
      },
    });

    res.status(201).json({ status: 'success', data: { part } });
  } catch (error) {
    console.error('Create part error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update part
// @route   PUT /api/parts/:id
export const updatePart = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      supplier_id,
      part_name,
      part_number,
      quantity,
      unit_price,
      reorder_level,
    } = req.body;

    const part = await prisma.partsInventory.findUnique({ where: { part_id: id } });
    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    // Verify new supplier if provided
    if (supplier_id) {
      const supplier = await prisma.supplier.findUnique({ where: { supplier_id } });
      if (!supplier) {
        return res.status(404).json({ status: 'error', message: 'Supplier not found' });
      }
    }

    const updated = await prisma.partsInventory.update({
      where: { part_id: id },
      data: {
        ...(supplier_id && { supplier_id }),
        ...(part_name && { part_name }),
        ...(part_number !== undefined && { part_number: part_number || null }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(unit_price !== undefined && { unit_price: unit_price ? parseFloat(unit_price) : null }),
        ...(reorder_level !== undefined && { reorder_level: parseInt(reorder_level) }),
      },
      include: {
        supplier: { select: { supplier_id: true, name: true } },
      },
    });

    res.json({ status: 'success', data: { part: updated } });
  } catch (error) {
    console.error('Update part error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete part
// @route   DELETE /api/parts/:id
export const deletePart = async (req, res) => {
  try {
    const { id } = req.params;

    const part = await prisma.partsInventory.findUnique({
      where: { part_id: id },
      include: { partsUsed: true },
    });
    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    if (part.partsUsed.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete part that has been used in service orders',
      });
    }

    await prisma.partsInventory.delete({ where: { part_id: id } });

    res.json({ status: 'success', message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Delete part error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Restock part quantity
// @route   POST /api/parts/:id/restock
export const restockPart = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || parseInt(amount) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid restock amount is required',
      });
    }

    const part = await prisma.partsInventory.findUnique({ where: { part_id: id } });
    if (!part) {
      return res.status(404).json({ status: 'error', message: 'Part not found' });
    }

    const updated = await prisma.partsInventory.update({
      where: { part_id: id },
      data: { quantity: { increment: parseInt(amount) } },
      include: { supplier: { select: { name: true } } },
    });

    res.json({
      status: 'success',
      message: `Restocked ${amount} units. New quantity: ${updated.quantity}`,
      data: { part: updated },
    });
  } catch (error) {
    console.error('Restock part error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};