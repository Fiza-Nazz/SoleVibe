"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaKey, FaCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setSuccess(false);

    // Simulate password reset email (replace with API call)
    setTimeout(() => {
      if (email === "chikki@example.com") {
        setSuccess(true);
        setMessage("Password reset link sent! Check your email.");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setMessage("Email not found!");
        setTimeout(() => setMessage(""), 3000);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-white/90 opacity-50 -z-10" />
      <main className="container mx-auto p-8 pt-0 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md bg-white border-2 border-black rounded-2xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <Link href="/" className="text-4xl font-extrabold text-black tracking-wide hover:text-gray-800 transition-transform duration-300 hover:scale-105">
              SOLEVIBE
            </Link>
            <h1 className="text-2xl font-bold text-black mt-2 animate-pulse">Forgot Password</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 shadow-inner"
                  required
                />
                <FaEnvelope className="absolute right-3 top-2.5 text-gray-600" />
              </div>
            </div>
            <AnimatePresence>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-sm text-center ${success ? "text-green-600" : "text-red-600"} flex items-center justify-center`}
                >
                  {success && <FaCheck className="mr-2" />} {message}
                </motion.p>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#333" }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
              type="submit"
              className="w-full bg-black text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-t-transparent border-white rounded-full"
                />
              ) : (
                <>
                  <FaKey className="w-5 h-5" />
                  <span>Reset Password</span>
                </>
              )}
            </motion.button>
            <p className="text-center text-sm text-black">
              Remember your password?{" "}
              <Link href="/login" className="font-medium hover:underline hover:text-gray-800 transition-colors duration-300">
                Login here
              </Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}