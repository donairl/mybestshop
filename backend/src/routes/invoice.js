const express = require('express');
const PDFDocument = require('pdfkit');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Generate invoice PDF
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Get order with all details
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
                images: true
              }
            }
          }
        },
        address: true,
        payments: {
          select: {
            method: true,
            status: true,
            amount: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${order.orderNumber}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add company header
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('MyBestShop', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica')
      .text('123 E-commerce Street', { align: 'center' })
      .text('Digital City, DC 12345', { align: 'center' })
      .text('Phone: +1 (555) 123-4567', { align: 'center' })
      .text('Email: info@mybestshop.com', { align: 'center' })
      .moveDown(1);

    // Add invoice title
    doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('INVOICE', { align: 'center' })
      .moveDown(1);

    // Add invoice details
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Invoice Number: ${order.orderNumber}`)
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`)
      .text(`Status: ${order.status}`)
      .moveDown(1);

    // Add customer information
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Bill To:')
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${order.user.firstName} ${order.user.lastName}`)
      .text(order.address.address)
      .text(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`)
      .text(order.address.country)
      .text(`Phone: ${order.address.phone}`)
      .moveDown(1);

    // Add shipping information
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Ship To:')
      .moveDown(0.5);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${order.address.firstName} ${order.address.lastName}`)
      .text(order.address.address)
      .text(`${order.address.city}, ${order.address.state} ${order.address.postalCode}`)
      .text(order.address.country)
      .text(`Phone: ${order.address.phone}`)
      .moveDown(1);

    // Add items table
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Items:', { underline: true })
      .moveDown(0.5);

    // Table headers
    const tableTop = doc.y;
    const itemCol = 50;
    const qtyCol = 300;
    const priceCol = 400;
    const totalCol = 500;

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Item', itemCol, tableTop)
      .text('Qty', qtyCol, tableTop)
      .text('Price', priceCol, tableTop)
      .text('Total', totalCol, tableTop)
      .moveDown(0.5);

    // Table rows
    let currentY = doc.y;
    order.orderItems.forEach((item, index) => {
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(item.product.name, itemCol, currentY)
        .text(item.quantity.toString(), qtyCol, currentY)
        .text(`$${item.price.toFixed(2)}`, priceCol, currentY)
        .text(`$${(item.price * item.quantity).toFixed(2)}`, totalCol, currentY);

      currentY += 20;
    });

    doc.moveDown(1);

    // Add totals
    const totalsY = doc.y;
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Subtotal:', 400, totalsY)
      .text(`$${order.subtotal.toFixed(2)}`, 500, totalsY)
      .moveDown(0.5);

    doc
      .text('Tax (10%):', 400)
      .text(`$${order.tax.toFixed(2)}`, 500)
      .moveDown(0.5);

    doc
      .text('Shipping:', 400)
      .text(`$${order.shipping.toFixed(2)}`, 500)
      .moveDown(0.5);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Total:', 400)
      .text(`$${order.total.toFixed(2)}`, 500)
      .moveDown(1);

    // Add payment information
    if (order.payments.length > 0) {
      const payment = order.payments[0];
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(`Payment Method: ${payment.method}`)
        .text(`Payment Status: ${payment.status}`)
        .moveDown(1);
    }

    // Add notes if any
    if (order.notes) {
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Notes:')
        .moveDown(0.5);

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(order.notes)
        .moveDown(1);
    }

    // Add footer
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('Thank you for your purchase!', { align: 'center' })
      .moveDown(0.5);

    doc
      .text('For any questions, please contact our customer support', { align: 'center' })
      .text('support@mybestshop.com', { align: 'center' });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate invoice'
    });
  }
});

// Download invoice as file
router.get('/:orderId/download', async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Get order with all details
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                description: true,
                images: true
              }
            }
          }
        },
        address: true,
        payments: {
          select: {
            method: true,
            status: true,
            amount: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.orderNumber}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Same PDF generation logic as above
    // ... (copy the PDF generation code from above)

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Download invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download invoice'
    });
  }
});

module.exports = router;
