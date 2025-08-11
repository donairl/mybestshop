const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get user's addresses
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: { addresses }
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get addresses'
    });
  }
});

// Get address by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.json({
      success: true,
      data: { address }
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get address'
    });
  }
});

// Create new address
router.post('/', [
  body('type').isIn(['SHIPPING', 'BILLING']),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('postalCode').trim().notEmpty(),
  body('country').trim().notEmpty(),
  body('isDefault').optional().isBoolean()
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

    const {
      type,
      firstName,
      lastName,
      phone,
      address: addressLine,
      city,
      state,
      postalCode,
      country,
      isDefault = false
    } = req.body;

    const userId = req.user.id;

    // If setting as default, unset other defaults of same type
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          type,
          isDefault: true
        },
        data: { isDefault: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        type,
        firstName,
        lastName,
        phone,
        address: addressLine,
        city,
        state,
        postalCode,
        country,
        isDefault
      }
    });

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: { address: newAddress }
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create address'
    });
  }
});

// Update address
router.put('/:id', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim().notEmpty(),
  body('address').optional().trim().notEmpty(),
  body('city').optional().trim().notEmpty(),
  body('state').optional().trim().notEmpty(),
  body('postalCode').optional().trim().notEmpty(),
  body('country').optional().trim().notEmpty(),
  body('isDefault').optional().isBoolean()
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
    const userId = req.user.id;
    const updateData = req.body;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If setting as default, unset other defaults of same type
    if (updateData.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          type: existingAddress.type,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Address updated successfully',
      data: { address: updatedAddress }
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address'
    });
  }
});

// Delete address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Check if address is being used in orders
    const orderCount = await prisma.order.count({
      where: { addressId: id }
    });

    if (orderCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete address that is associated with orders'
      });
    }

    await prisma.address.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address'
    });
  }
});

// Set address as default
router.put('/:id/default', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Unset other defaults of same type
    await prisma.address.updateMany({
      where: {
        userId,
        type: address.type,
        isDefault: true,
        id: { not: id }
      },
      data: { isDefault: false }
    });

    // Set this address as default
    const updatedAddress = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });

    res.json({
      success: true,
      message: 'Address set as default',
      data: { address: updatedAddress }
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address'
    });
  }
});

module.exports = router;
