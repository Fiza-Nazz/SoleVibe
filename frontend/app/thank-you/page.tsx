"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";
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

export default function ThankYouPage() {
  const [checkoutItems, setCheckoutItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load checkout items from localStorage and clear cart
  useEffect(() => {
    try {
      const savedCheckoutItems = localStorage.getItem("checkoutItems");
      if (savedCheckoutItems) {
        setCheckoutItems(JSON.parse(savedCheckoutItems));
        // Clear cart and checkout items after displaying
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("cart");
      }
    } catch (err) {
      setError("Failed to load order details.");
      console.error("LocalStorage error:", err);
    }
  }, []);

  // Navigate back to home for continued shopping
  const handleContinueShopping = () => {
    router.push("/");
  };

  // Calculate totals
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <>
      <Head>
        <title>Thank You - AI Shoe Store</title>
        <meta name="description" content="Thank you for your purchase at AI Shoe Store! View your order details." />
        <meta name="keywords" content="thank you, order confirmation, e-commerce, AI Shoe Store" />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : ""} />
      </Head>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 md:p-12 text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Confirmation Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <CheckCircle size={80} className="mx-auto text-green-600 mb-4" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Thank You for Your Order!
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Your order has been successfully placed. You'll receive a confirmation email with all the details soon.
            </p>
            <motion.button
              onClick={handleContinueShopping}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-semibold text-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              Continue Shopping
            </motion.button>
          </motion.div>

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

          {/* Order Summary */}
          {checkoutItems.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 rounded-lg">
                <AnimatePresence>
                  {checkoutItems.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm border border-gray-200"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                          loading="lazy"
                        />
                        <div>
                          <h3 className="text-md font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity ?? 1}
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
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg text-gray-700 mt-2">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Footer Info */}
          <div className="mt-10 text-sm text-gray-600 text-center">
            <p className="mb-2">🚚 Free Shipping on orders over $100</p>
            <p>✅ Secure Payment • 💬 24/7 Support • 🔁 30-Day Returns</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}