"use client";
import { useState, useEffect } from "react";
import { fetchProducts, type Product } from "./api";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

type CartEntry = {
  product: Product;
  quantity: number;
};

const ShoppingCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products"))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.product.id === product.id);
      if (existing) {
        return prev.map((e) =>
          e.product.id === product.id
            ? { ...e, quantity: e.quantity + 1 }
            : e
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((e) =>
          e.product.id === productId
            ? { ...e, quantity: e.quantity + delta }
            : e
        )
        .filter((e) => e.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((e) => e.product.id !== productId));
  };

  const subtotal = cart.reduce(
    (sum, e) => sum + e.product.price * e.quantity,
    0
  );
  const itemCount = cart.reduce((sum, e) => sum + e.quantity, 0);

  const handleCheckout = () => {
    setCheckoutMessage(`Order placed! ${itemCount} items for $${subtotal.toFixed(2)}`);
    setCart([]);
  };

  if (loading) return <p className="text-zinc-500">Loading products...</p>;
  if (error) return <p role="alert" className="text-red-600">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      {checkoutMessage && (
        <p role="status" className="bg-green-100 text-green-800 border border-green-300 rounded p-3">
          {checkoutMessage}
        </p>
      )}

      <section aria-label="Available products">
        <h2 className="text-lg font-semibold text-black mb-3">Products</h2>
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <li key={product.id} className="flex items-center justify-between border border-zinc-200 rounded p-3">
              <span className="text-black">{product.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-zinc-600">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-black text-white rounded px-3 py-1 text-sm hover:bg-zinc-800"
                >
                  Add to cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Shopping cart">
        <h2 className="text-lg font-semibold text-black mb-3">Cart</h2>
        {cart.length === 0 ? (
          <p className="text-zinc-500">Your cart is empty</p>
        ) : (
          <div role="list" className="flex flex-col gap-2">
            {cart.map((entry) => (
              <CartItem
                key={entry.product.id}
                name={entry.product.name}
                price={entry.product.price}
                quantity={entry.quantity}
                onIncrease={() => updateQuantity(entry.product.id, 1)}
                onDecrease={() => updateQuantity(entry.product.id, -1)}
                onRemove={() => removeFromCart(entry.product.id)}
              />
            ))}
          </div>
        )}
        <CartSummary
          subtotal={subtotal}
          itemCount={itemCount}
          onCheckout={handleCheckout}
        />
      </section>
    </div>
  );
};

export default ShoppingCart;
