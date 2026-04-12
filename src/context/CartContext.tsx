import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isPopular?: boolean;
  isNew?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };
    case 'UPDATE_QUANTITY':
      return {
        items: state.items
          .map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.max(1, action.payload.quantity) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

const CartContext = createContext<{
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: MenuItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
} | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item: MenuItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateQuantity = (id: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        totalPrice,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

import { useState } from 'react';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  const [isOpen, setIsOpenLocal] = useState(false);
  return {
    ...context!,
    isOpen,
    setIsOpen: setIsOpenLocal,
  };
};


