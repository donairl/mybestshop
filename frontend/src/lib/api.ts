import { apiRequest } from './utils'
import type {
  DashboardResponse,
  ProductsResponse,
  OrdersResponse,
  Product,
  Order,
  ApiResponse
} from '@/types'

// Admin Dashboard API
export const adminApi = {
  // Get dashboard stats
  getDashboard: (): Promise<ApiResponse<DashboardResponse>> =>
    apiRequest('/admin/dashboard'),

  // Products management
  getProducts: (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    status?: 'active' | 'inactive'
  }): Promise<ApiResponse<ProductsResponse>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)

    const query = queryParams.toString()
    return apiRequest(`/admin/products${query ? `?${query}` : ''}`)
  },

  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{ product: Product }>> =>
    apiRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: Partial<Product>): Promise<ApiResponse<{ product: Product }>> =>
    apiRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: string): Promise<ApiResponse> =>
    apiRequest(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  // Orders management
  getOrders: (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }): Promise<ApiResponse<OrdersResponse>> => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)

    const query = queryParams.toString()
    return apiRequest(`/admin/orders${query ? `?${query}` : ''}`)
  },

  updateOrderStatus: (id: string, status: Order['status']): Promise<ApiResponse<{ order: Order }>> =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
}

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<ApiResponse<{ user: any; token: string }>> =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<ApiResponse<{ user: any; token: string }>> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
}
