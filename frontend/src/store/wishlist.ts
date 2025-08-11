import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: Omit<WishlistItem, 'id'>) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  getItemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find(i => i.productId === item.productId)
        
        if (!existingItem) {
          set({ 
            items: [...items, { ...item, id: Math.random().toString(36).substr(2, 9) }] 
          })
        }
      },
      
      removeItem: (productId) => {
        const { items } = get()
        set({ items: items.filter(i => i.productId !== productId) })
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (productId) => {
        const { items } = get()
        return items.some(i => i.productId === productId)
      },
      
      getItemCount: () => {
        const { items } = get()
        return items.length
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
