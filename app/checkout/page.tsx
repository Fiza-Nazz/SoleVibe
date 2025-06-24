"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import Head from "next/head";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
}

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItems] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    paymentMethod: "card",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Load checkout items from localStorage
  useEffect(() => {
    try {
      const savedCheckoutItems = localStorage.getItem("checkoutItems");
      if (savedCheckoutItems) {
        setCheckoutItems(JSON.parse(savedCheckoutItems));
      }
    } catch (err) {
      setError("Failed to load checkout items.");
      console.error("LocalStorage error:", err);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
      setError("Please fill in all required fields.");
      return;
    }

    if (checkoutItems.length === 0) {
      setError("No items in checkout.");
      return;
    }

    if (formData.paymentMethod === "cod") {
      try {
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("cart");
        router.push("/thank-you");
      } catch (err) {
        setError("Failed to process Cash on Delivery order.");
        console.error("LocalStorage error:", err);
      }
    } else {
      // Stripe checkout
      fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: checkoutItems.map((item) => ({
            name: item.name,
            price: item.price * 100, // Stripe expects price in cents
            quantity: item.quantity ?? 1,
          })),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.sessionId) {
            stripePromise.then((stripe) => {
              stripe?.redirectToCheckout({ sessionId: data.sessionId });
            });
          } else {
            setError("Failed to create checkout session.");
          }
        })
        .catch((err) => {
          setError("Something went wrong with Stripe checkout.");
          console.error("Checkout error:", err);
        });
    }
  };

  // Calculate totals
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <>
      <Head>
        <title>Checkout - AI Shoe Store</title>
        <meta name="description" content="Complete your purchase at AI Shoe Store." />
        <meta name="keywords" content="checkout, purchase, e-commerce, AI Shoe Store" />
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-10">
            Checkout
          </h1>

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

          {checkoutItems.length === 0 ? (
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Summary */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                  <AnimatePresence>
                    {checkoutItems.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
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
                <div className="mt-4 pt-4 border-t border-gray-200">
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

              {/* Checkout Form */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping & Payment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Shipping Address"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-all h-24 resize-none"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                    <input
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Postal Code"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                    <input
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-lg font-semibold text-gray-900">Payment Method</label>
                    <div className="flex gap-6 items-center mt-2">
                      <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === "card"}
                          onChange={handleChange}
                          className="accent-gray-900"
                        />
                        Credit/Debit Card
                      </label>
                      <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleChange}
                          className="accent-gray-900"
                        />
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full font-semibold text-lg hover:from-gray-800 hover:to-gray-600 transition-all duration-300 shadow-lg flex items-center justify-center"
                    whileHover={{ scale: 1.05, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle className="inline mr-2" size={20} />
                    Place Order
                  </motion.button>
                </form>
              </motion.div>
            </div>
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