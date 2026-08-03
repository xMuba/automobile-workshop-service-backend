import prisma from '../database/prisma.js';

// @desc    Get all service orders
// @route   GET /api/orders
export const getAllServiceOrders = async (req, res) => {
  try {
    const { status, vehicle_id, employee_id } = req.query;

    const where = {};
    if (status) where.status = status;
    if (vehicle_id) where.vehicle_id = vehicle_id;
    if (employee_id) where.employee_id = employee_id;

    const orders = await prisma.serviceOrder.findMany({
      where,
      include: {
        vehicle: {
          select: { vehicle_id: true, registration_no: true, make: true, model: true },
        },
        employee: { select: { employee_id: true, name: true, role: true } },
        inspection: { select: { inspection_id: true, findings: true, condition_rating: true } },
        _count: { select: { orderServices: true, partsUsed: true } },
      },
      orderBy: { start_date: 'desc' },
    });

    res.json({
      status: 'success',
      count: orders.length,
      data: { orders },
    });
  } catch (error) {
    console.error('Get service orders error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single service order
// @route   GET /api/orders/:id
export const getServiceOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.serviceOrder.findUnique({
      where: { order_id: id },
      include: {
        vehicle: {
          include: {
            customer: { select: { customer_id: true, name: true, phone: true } },
          },
        },
        employee: { select: { employee_id: true, name: true, role: true, phone: true } },
        inspection: {
          include: {
            appointment: {
              select: { appointment_id: true, appointment_date: true, notes: true },
            },
          },
        },
        orderServices: { include: { serviceType: true } },
        partsUsed: { include: { partsInventory: true } },
        invoice: true,
      },
    });

    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Service order not found' });
    }

    res.json({ status: 'success', data: { order } });
  } catch (error) {
    console.error('Get service order error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create service order
// @route   POST /api/orders
export const createServiceOrder = async (req, res) => {
  try {
    const { vehicle_id, employee_id, inspection_id, start_date } = req.body;

    if (!vehicle_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle ID is required',
      });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { vehicle_id } });
    if (!vehicle) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    if (employee_id) {
      const employee = await prisma.employee.findUnique({ where: { employee_id } });
      if (!employee) {
        return res.status(404).json({ status: 'error', message: 'Employee not found' });
      }
    }

    if (inspection_id) {
      const inspection = await prisma.inspectionReport.findUnique({ where: { inspection_id } });
      if (!inspection) {
        return res.status(404).json({ status: 'error', message: 'Inspection report not found' });
      }

      const existingOrder = await prisma.serviceOrder.findUnique({ where: { inspection_id } });
      if (existingOrder) {
        return res.status(400).json({
          status: 'error',
          message: 'Inspection report is already linked to another service order',
        });
      }
    }

    const order = await prisma.serviceOrder.create({
      data: {
        vehicle_id,
        employee_id: employee_id || null,
        inspection_id: inspection_id || null,
        start_date: start_date ? new Date(start_date) : null,
      },
      include: {
        vehicle: {
          select: { vehicle_id: true, registration_no: true, make: true, model: true },
        },
        employee: { select: { employee_id: true, name: true } },
        inspection: { select: { inspection_id: true, findings: true } },
      },
    });

    res.status(201).json({ status: 'success', data: { order } });
  } catch (error) {
    console.error('Create service order error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update service order
// @route   PUT /api/orders/:id
export const updateServiceOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, end_date, employee_id } = req.body;

    const order = await prisma.serviceOrder.findUnique({ where: { order_id: id } });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Service order not found' });
    }

    if (employee_id) {
      const employee = await prisma.employee.findUnique({ where: { employee_id } });
      if (!employee) {
        return res.status(404).json({ status: 'error', message: 'Employee not found' });
      }
    }

    const updated = await prisma.serviceOrder.update({
      where: { order_id: id },
      data: {
        ...(status !== undefined && { status }),
        ...(end_date !== undefined && { end_date: end_date ? new Date(end_date) : null }),
        ...(employee_id !== undefined && { employee_id: employee_id || null }),
      },
      include: {
        vehicle: {
          select: { vehicle_id: true, registration_no: true, make: true, model: true },
        },
        employee: { select: { employee_id: true, name: true, role: true } },
        inspection: { select: { inspection_id: true, findings: true } },
      },
    });

    res.json({ status: 'success', data: { order: updated } });
  } catch (error) {
    console.error('Update service order error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete service order
// @route   DELETE /api/orders/:id
export const deleteServiceOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.serviceOrder.findUnique({
      where: { order_id: id },
      include: { invoice: true },
    });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Service order not found' });
    }

    if (order.invoice) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete service order that has an invoice',
      });
    }

    await prisma.serviceOrder.delete({ where: { order_id: id } });

    res.json({ status: 'success', message: 'Service order deleted successfully' });
  } catch (error) {
    console.error('Delete service order error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Add a service to an order
// @route   POST /api/orders/:id/services
export const addServiceToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_type_id, price } = req.body;

    if (!service_type_id || price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Service type ID and price are required',
      });
    }

    const order = await prisma.serviceOrder.findUnique({ where: { order_id: id } });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Service order not found' });
    }

    const serviceType = await prisma.serviceType.findUnique({ where: { service_type_id } });
    if (!serviceType) {
      return res.status(404).json({ status: 'error', message: 'Service type not found' });
    }

    const orderService = await prisma.orderService.create({
      data: {
        order_id: id,
        service_type_id,
        price: parseFloat(price),
      },
      include: { serviceType: true },
    });

    res.status(201).json({ status: 'success', data: { orderService } });
  } catch (error) {
    console.error('Add service to order error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Add a part to an order
// @route   POST /api/orders/:id/parts
export const addPartToOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { part_id, quantity_used, unit_price } = req.body;

    if (!part_id || !quantity_used || unit_price === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Part ID, quantity used and unit price are required',
      });
    }

    const qty = parseInt(quantity_used);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity used must be a positive integer',
      });
    }

    const order = await prisma.serviceOrder.findUnique({ where: { order_id: id } });
    if (!order) {
      return res.status(404).json({ status: 'error', message: 'Service order not found' });
    }

    // Atomic transaction: verify stock, create record, decrement inventory
    const partsUsed = await prisma.$transaction(async (tx) => {
      const part = await tx.partsInventory.findUnique({ where: { part_id } });
      if (!part) {
        throw new Error('Part not found in inventory');
      }
      if (part.quantity < qty) {
        throw new Error(`Insufficient stock. Available: ${part.quantity}, Requested: ${qty}`);
      }

      const record = await tx.partsUsed.create({
        data: {
          order_id: id,
          part_id,
          quantity_used: qty,
          unit_price: parseFloat(unit_price),
        },
        include: { partsInventory: true },
      });

      await tx.partsInventory.update({
        where: { part_id },
        data: { quantity: { decrement: qty } },
      });

      return record;
    });

    res.status(201).json({ status: 'success', data: { partsUsed } });
  } catch (error) {
    console.error('Add part to order error:', error);
    if (error.message?.includes('Insufficient stock') || error.message?.includes('Part not found')) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};