import prisma from '../database/prisma.js';

// @desc    Get all payments
// @route   GET /api/payments
export const getAllPayments = async (req, res) => {
  try {
    const { invoice_id, status } = req.query;

    const where = {};
    if (invoice_id) where.invoice_id = invoice_id;
    if (status) where.status = status;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          select: {
            invoice_id: true,
            grand_total: true,
            serviceOrder: {
              select: {
                order_id: true,
                vehicle: { select: { registration_no: true } },
              },
            },
          },
        },
      },
      orderBy: { payment_date: 'desc' },
    });

    res.json({
      status: 'success',
      count: payments.length,
      data: { payments },
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { payment_id: id },
      include: {
        invoice: {
          include: {
            serviceOrder: {
              include: {
                vehicle: { select: { registration_no: true, make: true, model: true } },
              },
            },
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ status: 'error', message: 'Payment not found' });
    }

    res.json({ status: 'success', data: { payment } });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Create payment for an invoice
// @route   POST /api/payments
export const createPayment = async (req, res) => {
  try {
    const { invoice_id, amount, method } = req.body;

    if (!invoice_id || amount === undefined || !method) {
      return res.status(400).json({
        status: 'error',
        message: 'Invoice ID, amount and payment method are required',
      });
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount must be a positive number',
      });
    }

    // Verify invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id },
      include: {
        payments: true,
        serviceOrder: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ status: 'error', message: 'Invoice not found' });
    }

    // Calculate total already paid (excluding failed payments)
    const totalPaid = invoice.payments
      .filter((p) => p.status !== 'Failed' && p.status !== 'Cancelled')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const remaining = parseFloat(invoice.grand_total) - totalPaid;

    if (paymentAmount > remaining + 0.001) {
      return res.status(400).json({
        status: 'error',
        message: `Payment exceeds remaining balance. Remaining: ${remaining.toFixed(2)}`,
      });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        invoice_id,
        amount: paymentAmount,
        method,
        status: 'Pending',
      },
      include: {
        invoice: {
          select: { invoice_id: true, grand_total: true },
        },
      },
    });

    // If fully paid, update service order payment status
    const newTotalPaid = totalPaid + paymentAmount;
    if (newTotalPaid >= parseFloat(invoice.grand_total) - 0.001) {
      await prisma.serviceOrder.update({
        where: { order_id: invoice.serviceOrder.order_id },
        data: { paymentStatus: 'PAID' },
      });
    }

    res.status(201).json({ status: 'success', data: { payment } });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, method } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { payment_id: id },
      include: { invoice: { include: { payments: true, serviceOrder: true } } },
    });

    if (!payment) {
      return res.status(404).json({ status: 'error', message: 'Payment not found' });
    }

    const updated = await prisma.payment.update({
      where: { payment_id: id },
      data: {
        ...(status !== undefined && { status }),
        ...(method !== undefined && { method }),
      },
      include: {
        invoice: {
          select: { invoice_id: true, grand_total: true },
        },
      },
    });

    // Recalculate and update order payment status if needed
    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: payment.invoice.invoice_id },
      include: { payments: true, serviceOrder: true },
    });

    const totalPaid = invoice.payments
      .filter((p) => p.status !== 'Failed' && p.status !== 'Cancelled')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const isFullyPaid = totalPaid >= parseFloat(invoice.grand_total) - 0.001;
    await prisma.serviceOrder.update({
      where: { order_id: invoice.serviceOrder.order_id },
      data: { paymentStatus: isFullyPaid ? 'PAID' : 'PENDING' },
    });

    res.json({ status: 'success', data: { payment: updated } });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { payment_id: id },
      include: { invoice: { include: { serviceOrder: true } } },
    });

    if (!payment) {
      return res.status(404).json({ status: 'error', message: 'Payment not found' });
    }

    await prisma.payment.delete({ where: { payment_id: id } });

    // Recalculate order payment status after deletion
    const invoice = await prisma.invoice.findUnique({
      where: { invoice_id: payment.invoice.invoice_id },
      include: { payments: true, serviceOrder: true },
    });

    const totalPaid = invoice.payments
      .filter((p) => p.status !== 'Failed' && p.status !== 'Cancelled')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const isFullyPaid = totalPaid >= parseFloat(invoice.grand_total) - 0.001;
    await prisma.serviceOrder.update({
      where: { order_id: invoice.serviceOrder.order_id },
      data: { paymentStatus: isFullyPaid ? 'PAID' : 'PENDING' },
    });

    res.json({ status: 'success', message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ status: 'error', message: error.message || 'Server error' });
  }
};