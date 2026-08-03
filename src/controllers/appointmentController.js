import prisma from '../database/prisma.js';

// @desc    Get all appointments
// @route   GET /api/appointments
export const getAllAppointments = async (req, res) => {
  try {
    const { status, dateFrom, dateTo } = req.query;

    const where = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.appointment_date = {};
      if (dateFrom) where.appointment_date.gte = new Date(dateFrom);
      if (dateTo) where.appointment_date.lte = new Date(dateTo);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: { select: { customer_id: true, name: true, phone: true } },
        vehicle: {
          select: {
            vehicle_id: true,
            registration_no: true,
            make: true,
            model: true,
          },
        },
        inspectionReport: {
          select: { inspection_id: true, inspection_date: true, condition_rating: true },
        },
      },
      orderBy: { appointment_date: 'asc' },
    });

    res.json({
      status: 'success',
      count: appointments.length,
      data: { appointments },
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { appointment_id: id },
      include: {
        customer: true,
        vehicle: true,
        inspectionReport: {
          include: {
            employee: { select: { employee_id: true, name: true, role: true } },
            serviceOrder: true,
          },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    res.json({ status: 'success', data: { appointment } });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create appointment
// @route   POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { customer_id, vehicle_id, appointment_date, notes } = req.body;

    if (!customer_id || !vehicle_id || !appointment_date) {
      return res.status(400).json({
        status: 'error',
        message: 'Customer ID, vehicle ID and appointment date are required',
      });
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { customer_id },
    });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id },
    });
    if (!vehicle) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    // Verify vehicle belongs to customer
    if (vehicle.customer_id !== customer_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle does not belong to this customer',
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        customer_id,
        vehicle_id,
        appointment_date: new Date(appointment_date),
        notes: notes || null,
      },
      include: {
        customer: { select: { customer_id: true, name: true, phone: true } },
        vehicle: {
          select: { vehicle_id: true, registration_no: true, make: true, model: true },
        },
      },
    });

    res.status(201).json({ status: 'success', data: { appointment } });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointment_date, status, notes } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { appointment_id: id },
    });
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    const updated = await prisma.appointment.update({
      where: { appointment_id: id },
      data: {
        ...(appointment_date !== undefined && { appointment_date: new Date(appointment_date) }),
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes: notes || null }),
      },
      include: {
        customer: { select: { customer_id: true, name: true, phone: true } },
        vehicle: {
          select: { vehicle_id: true, registration_no: true, make: true, model: true },
        },
      },
    });

    res.json({ status: 'success', data: { appointment: updated } });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { appointment_id: id },
      include: { inspectionReport: true },
    });
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    if (appointment.inspectionReport) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete appointment with an existing inspection report',
      });
    }

    await prisma.appointment.delete({ where: { appointment_id: id } });

    res.json({ status: 'success', message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};