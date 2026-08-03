import prisma from '../database/prisma.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: { select: { parts: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({
      status: 'success',
      count: suppliers.length,
      data: { suppliers },
    });
  } catch (error) {
    console.error('Get suppliers error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single supplier
// @route   GET /api/suppliers/:id
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { supplier_id: id },
      include: {
        parts: {
          select: {
            part_id: true,
            part_name: true,
            part_number: true,
            quantity: true,
            unit_price: true,
            reorder_level: true,
          },
          orderBy: { part_name: 'asc' },
        },
      },
    });

    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }

    res.json({ status: 'success', data: { supplier } });
  } catch (error) {
    console.error('Get supplier error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create supplier
// @route   POST /api/suppliers
export const createSupplier = async (req, res) => {
  try {
    const { name, contact_person, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and phone are required',
      });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contact_person: contact_person || null,
        phone,
        address: address || null,
      },
    });

    res.status(201).json({ status: 'success', data: { supplier } });
  } catch (error) {
    console.error('Create supplier error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact_person, phone, address } = req.body;

    const supplier = await prisma.supplier.findUnique({ where: { supplier_id: id } });
    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }

    const updated = await prisma.supplier.update({
      where: { supplier_id: id },
      data: {
        ...(name && { name }),
        ...(contact_person !== undefined && { contact_person: contact_person || null }),
        ...(phone && { phone }),
        ...(address !== undefined && { address: address || null }),
      },
    });

    res.json({ status: 'success', data: { supplier: updated } });
  } catch (error) {
    console.error('Update supplier error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { supplier_id: id },
      include: { parts: true },
    });
    if (!supplier) {
      return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    }

    if (supplier.parts.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete supplier that has parts in inventory. Reassign or delete parts first.',
      });
    }

    await prisma.supplier.delete({ where: { supplier_id: id } });

    res.json({ status: 'success', message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Delete supplier error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};