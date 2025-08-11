import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  salePrice?: number
  stock: number
  images: string[]
  quantity: number
  category: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id'>) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.productId === item.productId)
        
        if (existingItem) {
          const newQuantity = existingItem.quantity + item.quantity
          if (newQuantity <= item.stock) {
            set({
              items: items.map(i => 
                i.productId === item.productId 
                  ? { ...i, quantity: newQuantity }
                  : i
              )
            })
          }
        } else {
          set({ items: [...items, { ...item, id: Math.random().toString(36).substr(2, 9) }] })
        }
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          set({ items: items.filter(i => i.productId !== productId) })
        } else {
          const item = items.find(i => i.productId === productId)
          if (item && quantity <= item.stock) {
            set({
              items: items.map(i => 
                i.productId === productId 
                  ? { ...i, quantity }
                  : i
              )
            })
          }
        }
      },
      
      removeItem: (productId) => {
        const { items } = get()
        set({ items: items.filter(i => i.productId !== productId) })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const price = item.salePrice || item.price
          return total + (price * item.quantity)
        }, 0)
      },
      
      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
