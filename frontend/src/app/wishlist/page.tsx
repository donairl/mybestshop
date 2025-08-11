'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Star } from 'lucide-react';
import Link from 'next/link';

// Sample wishlist data
const sampleWishlistItems = [
  {
    id: 1,
    name: "Smart Fitness Watch",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 2156,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    category: "Electronics",
    inStock: true,
    discount: 25
  },
  {
    id: 2,
    name: "Premium Coffee Maker",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop",
    category: "Home & Kitchen",
    inStock: true,
    discount: 20
  },
  {
    id: 3,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 1247,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "Electronics",
    inStock: true,
    discount: 31
  },
  {
    id: 4,
    name: "Yoga Mat Premium",
    price: 39.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviews: 678,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop",
    category: "Sports",
    inStock: true,
    discount: 33
  }
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(sampleWishlistItems);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  const addToCart = (id: number) => {
    // In a real app, this would add the item to the cart
    console.log(`Added item ${id} to cart`);
    // You could show a toast notification here
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-gray-400 mb-6">
              <Heart className="w-24 h-24 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Start adding products you love to your wishlist!
            </p>
            <Link href="/products" className="btn-primary text-lg px-8 py-4">
              Browse Products
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text">
              MyBestShop
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-700 hover:text-primary transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            You have {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>
        </motion.div>

        {/* Wishlist Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    -{item.discount}%
                  </div>
                )}
                {!item.inStock && (
                  <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    Out of Stock
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{item.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{item.rating}</span>
                    <span className="text-xs text-gray-400">({item.reviews})</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-primary">${item.price}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-lg text-gray-400 line-through">${item.originalPrice}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => addToCart(item.id)}
                    disabled={!item.inStock}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{item.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 border border-gray-200 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to make your wishlist come true?
            </h2>
            <p className="text-gray-600 mb-6">
              Add items to your cart and enjoy fast, secure checkout with our premium service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="btn-outline text-lg px-8 py-4">
                Continue Shopping
              </Link>
              <Link href="/cart" className="btn-primary text-lg px-8 py-4">
                View Cart
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
