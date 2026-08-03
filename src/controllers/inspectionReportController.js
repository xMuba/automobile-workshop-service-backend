import prisma from '../database/prisma.js';

// @desc    Get all inspection reports
// @route   GET /api/inspections
export const getAllInspectionReports = async (req, res) => {
  try {
    const { employee_id, condition_rating } = req.query;

    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (condition_rating) where.condition_rating = condition_rating;

    const reports = await prisma.inspectionReport.findMany({
      where,
      include: {
        appointment: {
          include: {
            customer: { select: { customer_id: true, name: true, phone: true } },
            vehicle: {
              select: { vehicle_id: true, registration_no: true, make: true, model: true },
            },
          },
        },
        employee: { select: { employee_id: true, name: true, role: true } },
        serviceOrder: { select: { order_id: true, status: true, start_date: true } },
      },
      orderBy: { inspection_date: 'desc' },
    });

    res.json({
      status: 'success',
      count: reports.length,
      data: { inspections: reports },
    });
  } catch (error) {
    console.error('Get inspection reports error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single inspection report
// @route   GET /api/inspections/:id
export const getInspectionReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.inspectionReport.findUnique({
      where: { inspection_id: id },
      include: {
        appointment: {
          include: {
            customer: true,
            vehicle: true,
          },
        },
        employee: { select: { employee_id: true, name: true, role: true, phone: true } },
        serviceOrder: {
          include: {
            vehicle: { select: { registration_no: true, make: true, model: true } },
            orderServices: { include: { serviceType: true } },
            partsUsed: { include: { partsInventory: true } },
            invoice: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Inspection report not found' });
    }

    res.json({ status: 'success', data: { inspection: report } });
  } catch (error) {
    console.error('Get inspection report error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create inspection report
// @route   POST /api/inspections
export const createInspectionReport = async (req, res) => {
  try {
    const { appointment_id, employee_id, findings, condition_rating } = req.body;

    if (!appointment_id || !employee_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Appointment ID and employee ID are required',
      });
    }

    // Check appointment exists
    const appointment = await prisma.appointment.findUnique({
      where: { appointment_id },
    });
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Appointment not found' });
    }

    // Check appointment doesn't already have an inspection report
    const existing = await prisma.inspectionReport.findUnique({
      where: { appointment_id },
    });
    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'Inspection report already exists for this appointment',
      });
    }

    // Check employee exists
    const employee = await prisma.employee.findUnique({
      where: { employee_id },
    });
    if (!employee) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }

    const report = await prisma.inspectionReport.create({
      data: {
        appointment_id,
        employee_id,
        findings: findings || null,
        condition_rating: condition_rating || null,
      },
      include: {
        appointment: {
          include: {
            customer: { select: { customer_id: true, name: true, phone: true } },
            vehicle: {
              select: { vehicle_id: true, registration_no: true, make: true, model: true },
            },
          },
        },
        employee: { select: { employee_id: true, name: true, role: true } },
      },
    });

    res.status(201).json({ status: 'success', data: { inspection: report } });
  } catch (error) {
    console.error('Create inspection report error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update inspection report
// @route   PUT /api/inspections/:id
export const updateInspectionReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { findings, condition_rating } = req.body;

    const report = await prisma.inspectionReport.findUnique({
      where: { inspection_id: id },
    });
    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Inspection report not found' });
    }

    const updated = await prisma.inspectionReport.update({
      where: { inspection_id: id },
      data: {
        ...(findings !== undefined && { findings: findings || null }),
        ...(condition_rating !== undefined && { condition_rating: condition_rating || null }),
      },
      include: {
        appointment: {
          include: {
            customer: { select: { customer_id: true, name: true, phone: true } },
            vehicle: {
              select: { vehicle_id: true, registration_no: true, make: true, model: true },
            },
          },
        },
        employee: { select: { employee_id: true, name: true, role: true } },
        serviceOrder: { select: { order_id: true, status: true } },
      },
    });

    res.json({ status: 'success', data: { inspection: updated } });
  } catch (error) {
    console.error('Update inspection report error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete inspection report
// @route   DELETE /api/inspections/:id
export const deleteInspectionReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.inspectionReport.findUnique({
      where: { inspection_id: id },
      include: { serviceOrder: true },
    });
    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Inspection report not found' });
    }

    if (report.serviceOrder) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete inspection report that has a linked service order',
      });
    }

    await prisma.inspectionReport.delete({ where: { inspection_id: id } });

    res.json({ status: 'success', message: 'Inspection report deleted successfully' });
  } catch (error) {
    console.error('Delete inspection report error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};