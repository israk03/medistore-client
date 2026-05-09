"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { CartItem, Medicine } from "@/types/auth.types";

interface CartContextValue {
  items: CartItem[];

  addToCart: (
    medicine: Medicine,
    quantity?: number
  ) => void;

  removeFromCart: (medicineId: string) => void;

  updateQuantity: (
    medicineId: string,
    quantity: number
  ) => void;

  clearCart: () => void;

  totalItems: number;
  totalPrice: number;
}

const CartContext =
  createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart
  useEffect(() => {
  localStorage.setItem("medistore_cart", JSON.stringify(items));
}, [items]);

  // Persist cart
  const persist = useCallback(
    (newItems: CartItem[]) => {
      localStorage.setItem(
        "medistore_cart",
        JSON.stringify(newItems)
      );

      setItems(newItems);
    },
    []
  );

  // Add to cart
  const addToCart = useCallback(
    (medicine: Medicine, quantity = 1) => {
      const existing = items.find(
        (item) => item.medicine.id === medicine.id
      );

      let updated: CartItem[];

      if (existing) {
        updated = items.map((item) =>
          item.medicine.id === medicine.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      } else {
        updated = [
          ...items,
          {
            medicine,
            quantity,
          },
        ];
      }

      persist(updated);
    },
    [items, persist]
  );

  // Remove from cart
  const removeFromCart = useCallback(
    (medicineId: string) => {
      const updated = items.filter(
        (item) => item.medicine.id !== medicineId
      );

      persist(updated);
    },
    [items, persist]
  );

  // Update quantity
  const updateQuantity = useCallback(
    (medicineId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(medicineId);
        return;
      }

      const updated = items.map((item) =>
        item.medicine.id === medicineId
          ? {
              ...item,
              quantity,
            }
          : item
      );

      persist(updated);
    },
    [items, persist, removeFromCart]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  // Memoized totals
  const totalItems = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + item.medicine.price * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return ctx;
}