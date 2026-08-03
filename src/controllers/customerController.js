import prisma from '../database/prisma.js';

// @desc    Get all customers
// @route   GET /api/customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        user: { select: { user_id: true, phone: true, email: true, role: true, is_active: true } },
        _count: { select: { vehicles: true, appointments: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({ status: 'success', count: customers.length, data: { customers } });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { customer_id: id },
      include: {
        user: { select: { user_id: true, phone: true, email: true, role: true, is_active: true } },
        vehicles: true,
        appointments: { orderBy: { appointment_date: 'desc' } },
      },
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    res.json({ status: 'success', data: { customer } });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create customer (admin/employee only)
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ status: 'error', message: 'Name and phone are required' });
    }

    const existing = await prisma.customer.findFirst({
      where: { OR: [{ phone }, ...(email ? [{ email }] : [])] },
    });

    if (existing) {
      return res.status(400).json({ status: 'error', message: 'Customer with this phone or email already exists' });
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        email: email || null,
        address: address || null,
      },
    });

    res.status(201).json({ status: 'success', data: { customer } });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, address } = req.body;

    const customer = await prisma.customer.findUnique({ where: { customer_id: id } });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    const updated = await prisma.customer.update({
      where: { customer_id: id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email !== undefined && { email }),
        ...(address !== undefined && { address }),
      },
    });

    res.json({ status: 'success', data: { customer: updated } });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({ where: { customer_id: id } });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    await prisma.customer.delete({ where: { customer_id: id } });

    res.json({ status: 'success', message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get customer vehicles
// @route   GET /api/customers/:id/vehicles
export const getCustomerVehicles = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { customer_id: id },
      include: { vehicles: { include: { vehicleType: true } } },
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    res.json({ status: 'success', count: customer.vehicles.length, data: { vehicles: customer.vehicles } });
  } catch (error) {
    console.error('Get customer vehicles error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get customer appointments
// @route   GET /api/customers/:id/appointments
export const getCustomerAppointments = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { customer_id: id },
      include: { appointments: { include: { vehicle: true }, orderBy: { appointment_date: 'desc' } } },
    });

    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    res.json({ status: 'success', count: customer.appointments.length, data: { appointments: customer.appointments } });
  } catch (error) {
    console.error('Get customer appointments error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};