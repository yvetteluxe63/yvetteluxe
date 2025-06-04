
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: 'ADD_ITEM'; payload: WishlistItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_WISHLIST' }
  | { type: 'LOAD_WISHLIST'; payload: WishlistItem[] };

const WishlistContext = createContext<{
  state: WishlistState;
  dispatch: React.Dispatch<WishlistAction>;
  isInWishlist: (id: string) => boolean;
  addToWishlist: (item: any) => void;
  removeFromWishlist: (id: string) => void;
} | null>(null);

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Check if item already exists
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state; // Item already in wishlist
      }
      return {
        items: [...state.items, action.payload]
      };
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_WISHLIST':
      return { items: [] };
    case 'LOAD_WISHLIST':
      return { items: action.payload };
    default:
      return state;
  }
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, { items: [] });

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      dispatch({ type: 'LOAD_WISHLIST', payload: JSON.parse(savedWishlist) });
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(state.items));
  }, [state.items]);

  const isInWishlist = (id: string) => {
    return state.items.some(item => item.id === id);
  };

  const addToWishlist = (product: any) => {
    const wishlistItem: WishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '',
      category: product.category || 'general'
    };
    dispatch({ type: 'ADD_ITEM', payload: wishlistItem });
  };

  const removeFromWishlist = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <WishlistContext.Provider value={{ 
      state, 
      dispatch, 
      isInWishlist, 
      addToWishlist, 
      removeFromWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
