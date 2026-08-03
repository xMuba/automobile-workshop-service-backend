import prisma from '../database/prisma.js';

// @desc    Get all vehicle types
// @route   GET /api/vehicle-types
export const getAllVehicleTypes = async (req, res) => {
  try {
    const types = await prisma.vehicleType.findMany({
      include: {
        _count: { select: { vehicles: true } },
      },
      orderBy: { type_name: 'asc' },
    });

    res.json({
      status: 'success',
      count: types.length,
      data: { vehicleTypes: types },
    });
  } catch (error) {
    console.error('Get vehicle types error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single vehicle type
// @route   GET /api/vehicle-types/:id
export const getVehicleTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await prisma.vehicleType.findUnique({
      where: { vehicle_type_id: id },
      include: {
        vehicles: {
          select: {
            vehicle_id: true,
            registration_no: true,
            make: true,
            model: true,
            year: true,
          },
        },
      },
    });

    if (!type) {
      return res.status(404).json({ status: 'error', message: 'Vehicle type not found' });
    }

    res.json({ status: 'success', data: { vehicleType: type } });
  } catch (error) {
    console.error('Get vehicle type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create vehicle type
// @route   POST /api/vehicle-types
export const createVehicleType = async (req, res) => {
  try {
    const { type_name, description } = req.body;

    if (!type_name) {
      return res.status(400).json({
        status: 'error',
        message: 'Type name is required',
      });
    }

    const vehicleType = await prisma.vehicleType.create({
      data: {
        type_name,
        description: description || null,
      },
    });

    res.status(201).json({ status: 'success', data: { vehicleType } });
  } catch (error) {
    console.error('Create vehicle type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update vehicle type
// @route   PUT /api/vehicle-types/:id
export const updateVehicleType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type_name, description } = req.body;

    const type = await prisma.vehicleType.findUnique({ where: { vehicle_type_id: id } });
    if (!type) {
      return res.status(404).json({ status: 'error', message: 'Vehicle type not found' });
    }

    const updated = await prisma.vehicleType.update({
      where: { vehicle_type_id: id },
      data: {
        ...(type_name && { type_name }),
        ...(description !== undefined && { description: description || null }),
      },
    });

    res.json({ status: 'success', data: { vehicleType: updated } });
  } catch (error) {
    console.error('Update vehicle type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete vehicle type
// @route   DELETE /api/vehicle-types/:id
export const deleteVehicleType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await prisma.vehicleType.findUnique({
      where: { vehicle_type_id: id },
      include: { vehicles: true },
    });
    if (!type) {
      return res.status(404).json({ status: 'error', message: 'Vehicle type not found' });
    }

    if (type.vehicles.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete vehicle type that has vehicles assigned to it',
      });
    }

    await prisma.vehicleType.delete({ where: { vehicle_type_id: id } });

    res.json({ status: 'success', message: 'Vehicle type deleted successfully' });
  } catch (error) {
    console.error('Delete vehicle type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};