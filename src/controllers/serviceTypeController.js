import prisma from '../database/prisma.js';

// @desc    Get all service types
// @route   GET /api/service-types
export const getAllServiceTypes = async (req, res) => {
  try {
    const types = await prisma.serviceType.findMany({
      include: {
        _count: { select: { orderServices: true } },
      },
      orderBy: { service_name: 'asc' },
    });

    res.json({
      status: 'success',
      count: types.length,
      data: { serviceTypes: types },
    });
  } catch (error) {
    console.error('Get service types error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single service type
// @route   GET /api/service-types/:id
export const getServiceTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await prisma.serviceType.findUnique({
      where: { service_type_id: id },
      include: {
        orderServices: {
          select: {
            order_service_id: true,
            price: true,
            serviceOrder: {
              select: {
                order_id: true,
                status: true,
                vehicle: { select: { registration_no: true } },
              },
            },
          },
          orderBy: { order_service_id: 'desc' },
          take: 20,
        },
      },
    });

    if (!type) {
      return res.status(404).json({ status: 'error', message: 'Service type not found' });
    }

    res.json({ status: 'success', data: { serviceType: type } });
  } catch (error) {
    console.error('Get service type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create service type
// @route   POST /api/service-types
export const createServiceType = async (req, res) => {
  try {
    const { service_name, description, base_price } = req.body;

    if (!service_name) {
      return res.status(400).json({
        status: 'error',
        message: 'Service name is required',
      });
    }

    const serviceType = await prisma.serviceType.create({
      data: {
        service_name,
        description: description || null,
        base_price: base_price ? parseFloat(base_price) : null,
      },
    });

    res.status(201).json({ status: 'success', data: { serviceType } });
  } catch (error) {
    console.error('Create service type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update service type
// @route   PUT /api/service-types/:id
export const updateServiceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_name, description, base_price } = req.body;

    const type = await prisma.serviceType.findUnique({ where: { service_type_id: id } });
    if (!type) {
      return res.status(404).json({ status: 'error', message: 'Service type not found' });
    }

    const updated = await prisma.serviceType.update({
      where: { service_type_id: id },
      data: {
        ...(service_name && { service_name }),
        ...(description !== undefined && { description: description || null }),
        ...(base_price !== undefined && { base_price: base_price ? parseFloat(base_price) : null }),
      },
    });

    res.json({ status: 'success', data: { serviceType: updated } });
  } catch (error) {
    console.error('Update service type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete service type
// @route   DELETE /api/service-types/:id
export const deleteServiceType = async (req, res) => {
  try {
    const { id } = req.params;

    const type = await prisma.serviceType.findUnique({
      where: { service_type_id: id },
      include: { orderServices: true },
    });
    if (!type) {
      return res.status(404).json({ status: 'error', message: 'Service type not found' });
    }

    if (type.orderServices.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete service type that is used in service orders',
      });
    }

    await prisma.serviceType.delete({ where: { service_type_id: id } });

    res.json({ status: 'success', message: 'Service type deleted successfully' });
  } catch (error) {
    console.error('Delete service type error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};