'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ShoppingBag, Star, Truck, Shield, Zap, Heart, Search, Menu, X } from 'lucide-react'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 }
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  const heroImages = [
    '/api/placeholder/1200/600',
    '/api/placeholder/1200/600',
    '/api/placeholder/1200/600'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center"
            >
              <Link href="/" className="text-2xl font-bold gradient-text">
                MyBestShop
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-primary transition-colors">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/login" className="btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                <Link href="/products" className="text-gray-700 hover:text-primary transition-colors">
                  Products
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-primary transition-colors">
                  Contact
                </Link>
                <Link href="/login" className="btn-outline">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Discover{' '}
                <span className="gradient-text">Amazing</span>
                <br />
                Products
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the future of shopping with our cutting-edge e-commerce platform. 
                Find unique products, enjoy seamless checkout, and discover your next favorite item.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products" className="btn-primary text-lg px-8 py-4">
                  <ShoppingBag className="mr-2" size={20} />
                  Shop Now
                </Link>
                <Link href="/register" className="btn-outline text-lg px-8 py-4">
                  <Zap className="mr-2" size={20} />
                  Join Free
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                <div className="absolute inset-0 bg-hero-pattern opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ShoppingBag size={120} className="mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold">Modern Shopping</h3>
                    <p className="text-lg opacity-90">Experience the future</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">MyBestShop</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re committed to providing the best shopping experience with cutting-edge technology and exceptional service.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Shield,
                title: "Secure Shopping",
                description: "Bank-level security to protect your data and transactions"
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Quick and reliable shipping to your doorstep"
              },
              {
                icon: Star,
                title: "Quality Products",
                description: "Curated selection of premium products"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance for seamless experience"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-300 hover-lift"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of satisfied customers and discover amazing products today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                Create Account
              </Link>
              <Link href="/products" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-primary transition-colors">
                Browse Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold gradient-text mb-4">MyBestShop</h3>
              <p className="text-gray-400">
                The future of e-commerce is here. Discover amazing products with our modern platform.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/twitter" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="/facebook" className="hover:text-white transition-colors">Facebook</Link></li>
                <li><Link href="/instagram" className="hover:text-white transition-colors">Instagram</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MyBestShop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
