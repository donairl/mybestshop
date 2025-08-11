const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Create payment for order
router.post('/create', [
  body('orderId').notEmpty(),
  body('method').isIn(['COD', 'BANK_TRANSFER', 'CREDIT_CARD']),
  body('amount').isFloat({ min: 0.01 }),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { orderId, method, amount, notes } = req.body;
    const userId = req.user.id;

    // Check if order exists and belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if payment already exists
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this order'
      });
    }

    // Validate amount
    if (parseFloat(amount) !== parseFloat(order.total)) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must match order total'
      });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        userId,
        orderId,
        amount: parseFloat(amount),
        method,
        notes,
        status: method === 'COD' ? 'PENDING' : 'PENDING'
      }
    });

    // Update order status based on payment method
    let orderStatus = 'PENDING';
    if (method === 'COD') {
      orderStatus = 'CONFIRMED';
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: orderStatus }
    });

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: { payment }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment'
    });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const payment = await prisma.payment.findFirst({
      where: { id, userId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: { payment }
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment'
    });
  }
});

// Get payments for order
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Check if order belongs to user
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const payments = await prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { payments }
    });
  } catch (error) {
    console.error('Get order payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order payments'
    });
  }
});

// Update payment status (for admin use)
router.put('/:id/status', [
  body('status').isIn(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
  body('transactionId').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, transactionId, notes } = req.body;
    const userId = req.user.id;

    // Check if payment exists and belongs to user
    const payment = await prisma.payment.findFirst({
      where: { id, userId },
      include: { order: true }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        transactionId,
        notes
      }
    });

    // Update order status based on payment status
    let orderStatus = payment.order.status;
    if (status === 'COMPLETED') {
      orderStatus = 'CONFIRMED';
    } else if (status === 'FAILED') {
      orderStatus = 'PENDING';
    }

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: orderStatus }
    });

    res.json({
      success: true,
      message: 'Payment status updated',
      data: { payment: updatedPayment }
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
});

// Get user's payment history
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { userId };
    if (status) {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments'
    });
  }
});

module.exports = router;
