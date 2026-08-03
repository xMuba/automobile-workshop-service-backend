import prisma from '../database/prisma.js';

// @desc    Get all invoices
// @route   GET /api/invoices
export const getAllInvoices = async (req, res) => {
  try {
    const { payment_status } = req.query;

    const invoices = await prisma.invoice.findMany({
      where: payment_status ? { payments: { some: { status: payment_status } } } : undefined,
      include: {
        serviceOrder: {
          include: {
            vehicle: {
              select: { registration_no: true, make: true, model: true },
            },
          },
        },
        payments: true,
        _count: { select: { payments: true } },
      },
      orderBy: { invoice_date: 'desc' },
    });

    res.json({
      status: 'success',
      count: invoices.length,
      data: { invoices },
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: id },
      include: {
        serviceOrder: {
          include: {
            vehicle: {
              include: {
                customer: { select: { customer_id: true, name: true, phone: true } },
              },
            },
            orderServices: { include: { serviceType: true } },
            partsUsed: { include: { partsInventory: true } },
            employee: { select: { name: true, role: true } },
          },
        },
        payments: { orderBy: { payment_date: 'desc' } },
      },
    });

    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }

    res.json({ status: 'success', data: { invoice } });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create invoice for a service order
// @route   POST /api/invoices
export const createInvoice = async (req, res) => {
  try {
    const { order_id, tax_rate = 0 } = req.body;

    if (!order_id) {
      return res.status(400).json({
        status: 'error',
        message: 'Service order ID is required',
      });
    }

    // Verify service order exists
    const serviceOrder = await prisma.serviceOrder.findUnique({
      where: { order_id },
      include: {
        orderServices: true,
        partsUsed: true,
        invoice: true,
      },
    });

    if (!serviceOrder) {
      return res.status(404).json({ status: 'error', message: 'Service order not found' });
    }

    if (serviceOrder.invoice) {
      return res.status(400).json({
        status: 'error',
        message: 'Invoice already exists for this service order',
      });
    }

    // Calculate totals
    const service_total = serviceOrder.orderServices.reduce(
      (sum, s) => sum + parseFloat(s.price),
      0
    );

    const parts_total = serviceOrder.partsUsed.reduce(
      (sum, p) => sum + parseFloat(p.unit_price) * p.quantity_used,
      0
    );

    const tax = (service_total + parts_total) * (parseFloat(tax_rate) / 100);
    const grand_total = service_total + parts_total + tax;

    const invoice = await prisma.invoice.create({
      data: {
        order_id,
        service_total,
        parts_total,
        tax,
        grand_total,
      },
      include: {
        serviceOrder: {
          include: {
            vehicle: {
              select: { registration_no: true, make: true, model: true },
            },
          },
        },
      },
    });

    res.status(201).json({ status: 'success', data: { invoice } });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update invoice (manual adjustment)
// @route   PUT /api/invoices/:id
export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { service_total, parts_total, tax } = req.body;

    const invoice = await prisma.invoice.findUnique({ where: { invoice_id: id } });
    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }

    const newServiceTotal = service_total !== undefined ? parseFloat(service_total) : invoice.service_total;
    const newPartsTotal = parts_total !== undefined ? parseFloat(parts_total) : invoice.parts_total;
    const newTax = tax !== undefined ? parseFloat(tax) : invoice.tax;
    const grand_total = newServiceTotal + newPartsTotal + newTax;

    const updated = await prisma.invoice.update({
      where: { invoice_id: id },
      data: {
        ...(service_total !== undefined && { service_total: newServiceTotal }),
        ...(parts_total !== undefined && { parts_total: newPartsTotal }),
        ...(tax !== undefined && { tax: newTax }),
        grand_total,
      },
      include: {
        serviceOrder: {
          include: {
            vehicle: { select: { registration_no: true, make: true, model: true } },
          },
        },
        payments: true,
      },
    });

    res.json({ status: 'success', data: { invoice: updated } });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: id },
      include: { payments: true },
    });
    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }

    if (invoice.payments.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete invoice that has recorded payments',
      });
    }

    await prisma.invoice.delete({ where: { invoice_id: id } });

    res.json({ status: 'success', message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get invoice payments
// @route   GET /api/invoices/:id/payments
export const getInvoicePayments = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: id },
      include: { payments: { orderBy: { payment_date: 'desc' } } },
    });

    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }

    res.json({
      status: 'success',
      count: invoice.payments.length,
      data: { payments: invoice.payments },
    });
  } catch (error) {
    console.error('Get invoice payments error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};