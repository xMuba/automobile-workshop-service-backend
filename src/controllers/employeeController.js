import prisma from '../database/prisma.js';
import bcrypt from 'bcryptjs';

// @desc    Get all employees
// @route   GET /api/employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: { user_id: true, phone: true, email: true, is_active: true },
        },
        _count: {
          select: { serviceOrders: true, inspectionReports: true },
        },
      },
      orderBy: { hire_date: 'desc' },
    });

    res.json({
      status: 'success',
      count: employees.length,
      data: { employees },
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { employee_id: id },
      include: {
        user: {
          select: { user_id: true, phone: true, email: true, role: true, is_active: true },
        },
        serviceOrders: { orderBy: { start_date: 'desc' } },
        inspectionReports: { orderBy: { inspection_date: 'desc' } },
      },
    });

    if (!employee) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }

    res.json({ status: 'success', data: { employee } });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create employee (optionally with login account)
// @route   POST /api/employees
export const createEmployee = async (req, res) => {
  try {
    const { name, phone, role, salary, hire_date, password } = req.body;

    if (!name || !phone || !role) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, phone and role are required',
      });
    }

    const validRoles = ['MANAGER', 'MECHANIC', 'TECHNICIAN', 'RECEPTIONIST'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        status: 'error',
        message: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }

    let employee;

    if (password) {
      // Create employee + user login account in one transaction
      const existingUser = await prisma.user.findUnique({ where: { phone } });
      if (existingUser) {
        return res.status(400).json({
          status: 'error',
          message: 'User with this phone already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await prisma.$transaction(async (tx) => {
        const emp = await tx.employee.create({
          data: {
            name,
            phone,
            role,
            salary: salary ? parseFloat(salary) : null,
            hire_date: hire_date ? new Date(hire_date) : null,
          },
        });

        await tx.user.create({
          data: {
            phone,
            password: hashedPassword,
            role: 'EMPLOYEE',
            employee_id: emp.employee_id,
          },
        });

        return emp;
      });

      employee = result;
    } else {
      // Create employee profile only (no login)
      employee = await prisma.employee.create({
        data: {
          name,
          phone,
          role,
          salary: salary ? parseFloat(salary) : null,
          hire_date: hire_date ? new Date(hire_date) : null,
        },
      });
    }

    const fullEmployee = await prisma.employee.findUnique({
      where: { employee_id: employee.employee_id },
      include: {
        user: { select: { user_id: true, phone: true, is_active: true } },
      },
    });

    res.status(201).json({ status: 'success', data: { employee: fullEmployee } });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, role, salary, hire_date } = req.body;

    const employee = await prisma.employee.findUnique({
      where: { employee_id: id },
      include: { user: true },
    });
    if (!employee) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }

    const updated = await prisma.employee.update({
      where: { employee_id: id },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(role && { role }),
        ...(salary !== undefined && { salary: salary ? parseFloat(salary) : null }),
        ...(hire_date !== undefined && { hire_date: hire_date ? new Date(hire_date) : null }),
      },
      include: {
        user: { select: { user_id: true, phone: true, is_active: true } },
      },
    });

    res.json({ status: 'success', data: { employee: updated } });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({ where: { employee_id: id } });
    if (!employee) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }

    await prisma.employee.delete({ where: { employee_id: id } });

    res.json({ status: 'success', message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get employee service orders
// @route   GET /api/employees/:id/service-orders
export const getEmployeeServiceOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { employee_id: id },
      include: {
        serviceOrders: {
          include: {
            vehicle: { select: { registration_no: true, make: true, model: true } },
            inspection: true,
          },
          orderBy: { start_date: 'desc' },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }

    res.json({
      status: 'success',
      count: employee.serviceOrders.length,
      data: { serviceOrders: employee.serviceOrders },
    });
  } catch (error) {
    console.error('Get employee service orders error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get employee inspection reports
// @route   GET /api/employees/:id/inspections
export const getEmployeeInspections = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { employee_id: id },
      include: {
        inspectionReports: {
          include: {
            appointment: {
              include: {
                vehicle: { select: { registration_no: true, make: true, model: true } },
                customer: { select: { name: true, phone: true } },
              },
            },
          },
          orderBy: { inspection_date: 'desc' },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ status: 'error', message: 'Employee not found' });
    }

    res.json({
      status: 'success',
      count: employee.inspectionReports.length,
      data: { inspections: employee.inspectionReports },
    });
  } catch (error) {
    console.error('Get employee inspections error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};