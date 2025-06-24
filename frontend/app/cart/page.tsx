"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Head from "next/head";

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => {
      const newCart = prev.filter((_, i) => i !== index);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const handleProceedToCheckout = useCallback(() => {
    if (cart.length > 0) {
      localStorage.setItem("checkoutItems", JSON.stringify(cart));
      router.push("/checkout");
    } else {
      alert("Cart is empty!");
    }
  }, [cart, router]);

  return (
    <>
      <Head>
        <title>Shopping Cart - AI Shoe Store</title>
        <meta name="description" content="View and manage your shopping cart at AI Shoe Store." />
        <meta name="keywords" content="cart, shopping, e-commerce, AI Shoe Store" />
        <meta name="robots" content="index, follow" />
        {/* ❌ Removed window.location.href to prevent build error */}
      </Head>

      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6 md:p-12 text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Your Shopping Cart
            </h1>
            <motion.button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Continue Shopping</span>
            </motion.button>
          </div>

          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-xl md:text-2xl text-gray-700 mb-6">
                Your cart is empty.
              </p>
              <motion.button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <div className="space-y-6 max-h-[60vh] md:max-h-[70vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <AnimatePresence>
                  {cart.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200"
                    >
                      <div className="flex items-center gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                          </p>
                          <p className="text-md font-medium text-gray-900 mt-1">
                            ${(item.price * (item.quantity ?? 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => removeFromCart(index)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="flex justify-between text-lg text-gray-700 mb-2">
                  <span>Subtotal</span>
                  <span>
                    ${cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg text-gray-700 mb-2">
                  <span>Shipping</span>
                  <span>{cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0) > 100 ? "Free" : "$10.00"}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    ${cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0).toFixed(2)}
                  </span>
                </div>
                <motion.button
                  onClick={handleProceedToCheckout}
                  className="w-full mt-6 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingCart className="inline mr-2" size={20} />
                  Proceed to Checkout
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="mt-10 text-sm text-gray-600 text-center">
            <p className="mb-1">🚚 Free Shipping on orders over $100</p>
            <p>✅ Secure Payment • 💬 24/7 Support • 🔁 30-Day Returns</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
