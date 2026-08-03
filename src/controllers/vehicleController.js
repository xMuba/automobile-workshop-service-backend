import prisma from '../database/prisma.js';

// @desc    Get all vehicles
// @route   GET /api/vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        customer: { select: { customer_id: true, name: true, phone: true } },
        vehicleType: { select: { vehicle_type_id: true, type_name: true } },
        _count: { select: { appointments: true, serviceOrders: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({ status: 'success', count: vehicles.length, data: { vehicles } });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id: id },
      include: {
        customer: { select: { customer_id: true, name: true, phone: true, email: true } },
        vehicleType: true,
        appointments: { orderBy: { appointment_date: 'desc' } },
        serviceOrders: { orderBy: { start_date: 'desc' } },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    res.json({ status: 'success', data: { vehicle } });
  } catch (error) {
    console.error('Get vehicle error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create vehicle
// @route   POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    const {
      customer_id,
      vehicle_type_id,
      registration_no,
      make,
      model,
      year,
      fuel_type,
      color,
      mileage,
    } = req.body;

    if (!customer_id || !registration_no) {
      return res.status(400).json({
        status: 'error',
        message: 'Customer ID and registration number are required',
      });
    }

    // Check customer exists
    const customer = await prisma.customer.findUnique({
      where: { customer_id },
    });
    if (!customer) {
      return res.status(404).json({ status: 'error', message: 'Customer not found' });
    }

    // Check registration number is unique
    const existing = await prisma.vehicle.findUnique({
      where: { registration_no },
    });
    if (existing) {
      return res.status(400).json({
        status: 'error',
        message: 'Vehicle with this registration number already exists',
      });
    }

    // Optional: validate vehicle type if provided
    if (vehicle_type_id) {
      const type = await prisma.vehicleType.findUnique({
        where: { vehicle_type_id },
      });
      if (!type) {
        return res.status(404).json({ status: 'error', message: 'Vehicle type not found' });
      }
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        customer_id,
        registration_no,
        vehicle_type_id: vehicle_type_id || null,
        make: make || null,
        model: model || null,
        year: year ? parseInt(year) : null,
        fuel_type: fuel_type || null,
        color: color || null,
        mileage: mileage ? parseInt(mileage) : null,
      },
      include: {
        customer: { select: { customer_id: true, name: true, phone: true } },
        vehicleType: true,
      },
    });

    res.status(201).json({ status: 'success', data: { vehicle } });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehicle_type_id,
      registration_no,
      make,
      model,
      year,
      fuel_type,
      color,
      mileage,
    } = req.body;

    const vehicle = await prisma.vehicle.findUnique({ where: { vehicle_id: id } });
    if (!vehicle) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    // Check registration_no uniqueness if changing
    if (registration_no && registration_no !== vehicle.registration_no) {
      const existing = await prisma.vehicle.findUnique({
        where: { registration_no },
      });
      if (existing) {
        return res.status(400).json({
          status: 'error',
          message: 'Another vehicle with this registration number already exists',
        });
      }
    }

    // Validate vehicle type if provided
    if (vehicle_type_id) {
      const type = await prisma.vehicleType.findUnique({
        where: { vehicle_type_id },
      });
      if (!type) {
        return res.status(404).json({ status: 'error', message: 'Vehicle type not found' });
      }
    }

    const updated = await prisma.vehicle.update({
      where: { vehicle_id: id },
      data: {
        ...(vehicle_type_id !== undefined && { vehicle_type_id: vehicle_type_id || null }),
        ...(registration_no && { registration_no }),
        ...(make !== undefined && { make }),
        ...(model !== undefined && { model }),
        ...(year !== undefined && { year: year ? parseInt(year) : null }),
        ...(fuel_type !== undefined && { fuel_type }),
        ...(color !== undefined && { color }),
        ...(mileage !== undefined && { mileage: mileage ? parseInt(mileage) : null }),
      },
      include: {
        customer: { select: { customer_id: true, name: true, phone: true } },
        vehicleType: true,
      },
    });

    res.json({ status: 'success', data: { vehicle: updated } });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({ where: { vehicle_id: id } });
    if (!vehicle) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    await prisma.vehicle.delete({ where: { vehicle_id: id } });

    res.json({ status: 'success', message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get vehicle service history
// @route   GET /api/vehicles/:id/service-history
export const getVehicleServiceHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { vehicle_id: id },
      include: {
        serviceOrders: {
          include: {
            employee: { select: { employee_id: true, name: true, role: true } },
            inspection: true,
            orderServices: { include: { serviceType: true } },
            partsUsed: { include: { partsInventory: true } },
            invoice: true,
          },
          orderBy: { start_date: 'desc' },
        },
      },
    });

    if (!vehicle) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    res.json({
      status: 'success',
      count: vehicle.serviceOrders.length,
      data: { serviceHistory: vehicle.serviceOrders },
    });
  } catch (error) {
    console.error('Get service history error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};