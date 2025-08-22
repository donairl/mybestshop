export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  createdAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  salePrice?: number
  stock: number
  images: string[]
  category: string
  tags: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  salePrice?: number
  images: string[]
  quantity: number
  stock: number
  category: string
}

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  tags: string[]
}

export interface Address {
  id: string
  userId: string
  type: 'SHIPPING' | 'BILLING'
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
  }
}

export interface Order {
  id: string
  userId: string
  addressId: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  subtotal: number
  tax: number
  shipping: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
  orderItems: OrderItem[]
  address: Address
  user?: User
}

export interface Payment {
  id: string
  userId: string
  orderId: string
  amount: number
  method: 'COD' | 'BANK_TRANSFER' | 'CREDIT_CARD'
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  transactionId?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: any[]
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ProductsResponse {
  products: Product[]
  pagination: PaginationInfo
}

export interface OrdersResponse {
  orders: Order[]
  pagination: PaginationInfo
}

export interface CartResponse {
  items: CartItem[]
  summary: {
    subtotal: number
    tax: number
    shipping: number
    total: number
  }
}

export interface WishlistResponse {
  wishlist: WishlistItem[]
}

export interface AuthResponse {
  user: User
  token: string
}

// Admin Dashboard Types
export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
}

export interface LowStockProduct {
  id: string
  name: string
  stock: number
  images: string[]
}

export interface DashboardResponse {
  stats: DashboardStats
  recentOrders: Order[]
  lowStockProducts: LowStockProduct[]
}
