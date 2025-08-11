const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Get user's wishlist
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            salePrice: true,
            stock: true,
            images: true,
            category: true,
            tags: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: { wishlist: wishlistItems }
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist'
    });
  }
});

// Add item to wishlist
router.post('/add', [
  body('productId').notEmpty()
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

    const { productId } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existingWishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existingWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId,
        productId
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            salePrice: true,
            images: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: { wishlistItem }
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist'
    });
  }
});

// Remove item from wishlist
router.delete('/remove/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    // Check if wishlist item exists
    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist item not found'
      });
    }

    // Remove from wishlist
    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist'
    });
  }
});

// Check if product is in wishlist
router.get('/check/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    res.json({
      success: true,
      data: { 
        inWishlist: !!wishlistItem,
        wishlistItem: wishlistItem || null
      }
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status'
    });
  }
});

// Clear wishlist
router.delete('/clear', async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.wishlist.deleteMany({
      where: { userId }
    });

    res.json({
      success: true,
      message: 'Wishlist cleared'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    });
  }
});

module.exports = router;
