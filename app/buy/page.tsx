"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle, ArrowLeft } from "lucide-react";
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

export default function BuyPage() {
  const [buyItems, setBuyItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load buy items from localStorage (or checkoutItems for consistency)
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem("checkoutItems") || localStorage.getItem("buyItems");
      if (savedItems) {
        setBuyItems(JSON.parse(savedItems));
      }
    } catch (err) {
      setError("Failed to load items.");
      console.error("LocalStorage error:", err);
    }
  }, []);

  // Handle checkout (placeholder)
  const handleCheckout = () => {
    try {
      alert("Order placed successfully!");
      localStorage.removeItem("checkoutItems");
      localStorage.removeItem("buyItems");
      localStorage.removeItem("cart");
      router.push("/");
    } catch (err) {
      setError("Failed to complete purchase.");
      console.error("LocalStorage error:", err);
    }
  };

  // Calculate totals
  const subtotal = buyItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <>
      <Head>
        <title>Checkout - AI Shoe Store</title>
        <meta name="description" content="Complete your purchase at AI Shoe Store." />
        <meta name="keywords" content="checkout, buy, e-commerce, AI Shoe Store" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Head>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 md:p-12 text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Finalize Your Purchase
            </h1>
            <motion.button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Continue Shopping</span>
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl shadow-md"
            >
              {error}
            </motion.div>
          )}

          {buyItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <ShoppingCart size={80} className="mx-auto text-gray-400 mb-4" />
              <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
                No items to checkout.
              </p>
              <motion.button
                onClick={() => router.push("/")}
                className="px-10 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)" }}
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
              <div className="space-y-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-lg">
                <AnimatePresence>
                  {buyItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex items-center gap-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                          loading="lazy"
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="mt-6 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="flex justify-between text-lg text-gray-700 mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg text-gray-700 mb-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <motion.button
                  onClick={handleCheckout}
                  className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-semibold text-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CheckCircle className="inline mr-2" size={20} />
                  Complete Purchase
                </motion.button>
              </div>
            </motion.div>
          )}
          <div className="mt-10 text-sm text-gray-600 text-center">
            <p className="mb-2">🚚 Free Shipping on orders over $100</p>
            <p>✅ Secure Payment • 💬 24/7 Support • 🔁 30-Day Returns</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}