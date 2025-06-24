"use client";

import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaRegEdit, FaHistory, FaSignOutAlt, FaHome, FaTrash } from "react-icons/fa";
import { IoCartOutline, IoHeartOutline, IoClose } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [time, setTime] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"orders" | "saved" | "settings">("orders");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [savedItems, setSavedItems] = useState([
    { id: 1, name: "Running Shoes", price: "$79.99" },
    { id: 2, name: "Casual Sneakers", price: "$49.99" },
  ]);

  // Mock data for recent orders in USD
  const mockOrders = [
    { id: "ORD123", date: "2025-06-15", total: "$79.99", status: "Delivered", items: ["Running Shoes", "Socks"] },
    { id: "ORD124", date: "2025-06-10", total: "$49.99", status: "Shipped", items: ["Casual Sneakers"] },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load notification settings from localStorage
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  useEffect(() => {
    // Save notification settings to localStorage
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleTabChange = (tab: "orders" | "saved" | "settings") => {
    setActiveTab(tab);
    setSelectedOrder(null); // Close modal when switching tabs
  };

  const handleRemoveSavedItem = (id: number) => {
    setSavedItems(savedItems.filter((item) => item.id !== id));
  };

  const handleNotificationChange = (type: "email" | "sms") => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black transition-colors duration-300">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold animate-pulse"
        >
          Please sign in to view your profile.
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-black"
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="bg-black text-white flex flex-col items-center justify-between p-8 space-y-6">
            <div className="flex flex-col items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold">{user.fullName ?? "User"}</h2>
                <p className="text-sm text-gray-300">{user.primaryEmailAddress?.emailAddress}</p>
                <p className="text-xs text-gray-400 mt-1">User ID: {user.id.slice(0, 8)}...</p>
              </motion.div>
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
              className="text-xs text-gray-400"
            >
              ⏰ {time}
            </motion.div>

            <div className="space-y-3 w-full">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all"
              >
                <FaHome /> Go to Home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange("orders")}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === "orders" ? "bg-white text-black" : "bg-white/10 border border-white/20 hover:bg-white/20"}`}
              >
                <FaHistory /> View History
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange("settings")}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all ${activeTab === "settings" ? "bg-white text-black" : "bg-white/10 border border-white/20 hover:bg-white/20"}`}
              >
                <FaRegEdit /> Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-600/70 border border-white/20 rounded-full transition-all"
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            </div>
          </div>

          {/* Profile Info Panel */}
          <div className="col-span-2 p-8 md:p-12 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-black">Your Profile</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTabChange("orders")}
                  className={`px-4 py-2 rounded-full ${activeTab === "orders" ? "bg-black text-white" : "bg-white text-black border border-black hover:bg-black/10"}`}
                >
                  Orders
                </button>
                <button
                  onClick={() => handleTabChange("saved")}
                  className={`px-4 py-2 rounded-full ${activeTab === "saved" ? "bg-black text-white" : "bg-white text-black border border-black hover:bg-black/10"}`}
                >
                  Saved Items
                </button>
                <button
                  onClick={() => handleTabChange("settings")}
                  className={`px-4 py-2 rounded-full ${activeTab === "settings" ? "bg-black text-white" : "bg-white text-black border border-black hover:bg-black/10"}`}
                >
                  Settings
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-black"
                >
                  <h4 className="text-lg font-semibold text-black">Recent Orders</h4>
                  {mockOrders.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {mockOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedOrder(order)}
                          className="flex justify-between items-center p-4 bg-white rounded-lg border border-black cursor-pointer"
                        >
                          <div>
                            <p className="font-medium text-black">Order #{order.id}</p>
                            <p className="text-sm text-black/60">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-black">{order.total}</p>
                            <p className="text-sm text-black/60">{order.status}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-black/60 mt-2">You haven’t placed any orders yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "saved" && (
                <motion.div
                  key="saved"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-black"
                >
                  <h4 className="text-lg font-semibold text-black">Saved Items</h4>
                  {savedItems.length > 0 ? (
                    <div className="mt-4 space-y-4">
                      {savedItems.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex justify-between items-center p-4 bg-white rounded-lg border border-black"
                        >
                          <div className="flex items-center gap-4">
                            <IoHeartOutline className="text-xl text-black/60" />
                            <p className="font-medium text-black">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-medium text-black">{item.price}</p>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemoveSavedItem(item.id)}
                              className="text-black/60 hover:text-red-600"
                            >
                              <FaTrash />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-black/60 mt-2">No items saved yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-black"
                >
                  <h4 className="text-lg font-semibold text-black">Notification Settings</h4>
                  <p className="text-sm text-black/60 mt-2">Manage your notification preferences.</p>
                  <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-black"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange("email")}
                      />
                      <span className="text-sm text-black">Enable Email Alerts</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-black"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange("sms")}
                      />
                      <span className="text-sm text-black">Enable SMS Alerts</span>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Details Modal */}
            <AnimatePresence>
              {selectedOrder && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                >
                  <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, y: 20 }}
                    className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-black"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-black">Order #{selectedOrder.id}</h4>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOrder(null)}
                        className="text-black/60"
                      >
                        <IoClose className="text-xl" />
                      </motion.button>
                    </div>
                    <p className="text-sm text-black/60">Date: {selectedOrder.date}</p>
                    <p className="text-sm text-black/60">Total: {selectedOrder.total}</p>
                    <p className="text-sm text-black/60">Status: {selectedOrder.status}</p>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-black">Items:</p>
                      <ul className="list-disc list-inside text-sm text-black/60">
                        {selectedOrder.items.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10">
              <h4 className="text-xl font-semibold mb-3 text-black">Account Insights</h4>
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-black text-white rounded-lg p-4 text-center"
                >
                  <p className="text-sm">Member Since</p>
                  <p className="text-lg font-bold">{user.createdAt ? new Date(user.createdAt).getFullYear() : "2024"}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-black text-white rounded-lg p-4 text-center"
                >
                  <p className="text-sm">Total Spent</p>
                  <p className="text-lg font-bold">
                    ${mockOrders.reduce((sum, order) => sum + parseFloat(order.total.replace("$", "")), 0).toFixed(2)}
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-xs text-black/60 text-center">SoleVibe © 2025 | All Rights Reserved</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}