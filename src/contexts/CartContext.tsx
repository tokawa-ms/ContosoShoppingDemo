'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, CartItemWithProduct, Product } from '@/types';
import { getProductById } from '@/lib/products';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'UPDATE_ITEM'; payload: { productId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (productId: string, quantity: number) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getCartItems: () => CartItemWithProduct[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'nextshopdemo_cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { productId, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.productId === productId);
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { productId, quantity }];
      }
      
      return calculateCartTotals(newItems);
    }
    
    case 'UPDATE_ITEM': {
      const { productId, quantity } = action.payload;
      let newItems: CartItem[];
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        newItems = state.items.filter(item => item.productId !== productId);
      } else {
        // Update quantity
        newItems = state.items.map(item =>
          item.productId === productId ? { ...item, quantity } : item
        );
      }
      
      return calculateCartTotals(newItems);
    }
    
    case 'REMOVE_ITEM': {
      const { productId } = action.payload;
      const newItems = state.items.filter(item => item.productId !== productId);
      return calculateCartTotals(newItems);
    }
    
    case 'CLEAR_CART': {
      return { items: [], total: 0, itemCount: 0 };
    }
    
    case 'LOAD_CART': {
      return calculateCartTotals(action.payload);
    }
    
    default:
      return state;
  }
}

function calculateCartTotals(items: CartItem[]): CartState {
  const total = items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  return { items, total, itemCount };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const cartItems = JSON.parse(savedCart) as CartItem[];
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state.items]);

  const addItem = (productId: string, quantity: number) => {
    dispatch({ type: 'ADD_ITEM', payload: { productId, quantity } });
  };

  const updateItem = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_ITEM', payload: { productId, quantity } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItems = (): CartItemWithProduct[] => {
    return state.items.map(item => {
      const product = getProductById(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    }).filter(item => item.product); // Filter out any items where product wasn't found
  };

  const contextValue: CartContextType = {
    ...state,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getCartItems,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}