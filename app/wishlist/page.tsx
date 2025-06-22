"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaHeart, FaShoppingCart, FaTrash, FaPlus, FaMinus, FaShareAlt, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const initialWishlist = [
  { id: 1, name: "Air Max 90", price: 120, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp", quantity: 1 },
  { id: 2, name: "Dunk Low", price: 110, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592416/rows_ezfwck.webp", quantity: 1 },
  { id: 3, name: "Yeezy Boost 350", price: 220, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg", quantity: 1 },
];

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    const total = wishlist.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    setIsDragging(true);
    setDragIndex(index);
    dragItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newWishlist = [...wishlist];
      const draggedItem = newWishlist[dragItem.current];
      newWishlist.splice(dragItem.current, 1);
      newWishlist.splice(dragOverItem.current, 0, draggedItem);
      setWishlist(newWishlist);
    }
    dragItem.current = null;
    dragOverItem.current = null;
    setIsDragging(false);
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragIndex(null);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const removeItem = (id: number) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, change: number) => {
    setWishlist(wishlist.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  const moveToCart = (id: number) => {
    const item = wishlist.find(item => item.id === id);
    if (item) {
      console.log(`Added ${item.name} to cart!`);
      removeItem(id);
      triggerParticleEffect(item.id);
    }
  };

  const shareWishlist = () => {
    const wishlistData = wishlist.map(item => `${item.name} - $${item.price}`).join("\n");
    navigator.clipboard.writeText(`My SOLEVIBE Wishlist:\n${wishlistData}`);
    alert("Wishlist link copied to clipboard!");
  };

  const triggerParticleEffect = (id: number) => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number }[] = [];
    const itemElement = document.querySelector(`[data-id="${id}"]`);
    if (itemElement) {
      const rect = itemElement.getBoundingClientRect();
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          size: Math.random() * 4 + 1,
          color: ["#000000", "#FFFFFF"][Math.floor(Math.random() * 2)],
          life: 80,
        });
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(idx, 1);
      });
      if (particles.length > 0) requestAnimationFrame(animate);
      else document.body.removeChild(canvas);
    };
    animate();
  };

  return (
    <div className="min-h-screen bg-white relative">
      <header className="bg-black text-white py-4 sm:py-6 shadow-xl">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <Link href="/" className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide hover:text-gray-300 transition-transform duration-300 hover:scale-105">
            SOLEVIBE
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold animate-pulse">My Wishlist</h1>
          <div className="flex space-x-4 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareWishlist}
              className="flex items-center space-x-2 hover:text-gray-300 transition-all duration-300 text-sm sm:text-base"
            >
              <FaShareAlt className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Share</span>
            </motion.button>
            <Link href="/cart" className="flex items-center space-x-2 hover:text-gray-300 transition-all duration-300 text-sm sm:text-base">
              <FaShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>View Cart</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <AnimatePresence>
          {wishlist.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center py-16 sm:py-24"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto bg-black rounded-full flex items-center justify-center shadow-2xl"
              >
                <FaHeart className="w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 text-white animate-bounce" />
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black mt-4 sm:mt-6"
              >
                Your Wishlist is Empty!
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-base sm:text-lg text-gray-700 mt-2"
              >
                Discover your next favorite pair of shoes.
              </motion.p>
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(0,0,0,0.2)" }}
                className="mt-6 sm:mt-8"
              >
                <Link href="/shop" className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-black text-white rounded-full text-sm sm:text-base font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg">
                  Explore Shoes
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {wishlist.map((item, index) => (
                  <motion.div
                    key={item.id}
                    data-id={item.id}
                    className={`bg-white border border-black rounded-lg p-3 sm:p-4 relative overflow-hidden ${isDragging && dragIndex === index ? "opacity-40" : ""}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      draggable
                      onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, index)}
                      onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e)}
                      onDragEnter={(e: React.DragEvent<HTMLDivElement>) => handleDragEnter(e, index)}
                      onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e)}
                      onDragEnd={handleDragEnd}
                      style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, zIndex: 2, cursor: "grab" }}
                    />
                    <div className="relative">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-40 sm:h-56 object-cover rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.1, rotate: 2, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        loading="lazy"
                      />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="absolute top-2 right-2 bg-black text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        <FaTrash className="w-3 sm:w-4 h-3 sm:h-4" />
                      </button>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black truncate">{item.name}</h3>
                      <p className="text-sm sm:text-base text-gray-800 mt-1">${item.price.toFixed(2)}</p>
                      <div className="flex items-center justify-between mt-3 sm:mt-4 flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-black text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <FaMinus className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                          </button>
                          <span className="text-base sm:text-lg font-medium text-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-black text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <FaPlus className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                          </button>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => moveToCart(item.id)}
                          className="flex items-center space-x-2 bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm"
                        >
                          <FaShoppingCart className="w-3 sm:w-4 h-3 sm:h-4" />
                          <span>Add to Cart</span>
                        </motion.button>
                      </div>
                    </div>
                    {showTooltip === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 sm:top-14 left-4 bg-black text-white p-2 rounded-md text-xs sm:text-sm shadow-lg max-w-[80%]"
                      >
                        Click to add this shoe to your cart or remove it!
                      </motion.div>
                    )}
                    <button
                      onClick={() => setShowTooltip(showTooltip === item.id ? null : item.id)}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-black"
                      aria-label="Show tooltip"
                    >
                      <FaInfoCircle className="w-4 sm:w-5 h-4 sm:h-5 hover:text-gray-800 transition-colors duration-300" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border border-black rounded-lg p-3 sm:p-4 mt-4 sm:mt-6 shadow-md sticky bottom-4 z-20"
              >
                <h2 className="text-base sm:text-lg md:text-xl font-semibold text-black">Wishlist Total</h2>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-black mt-2">${totalPrice.toFixed(2)}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 w-full bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
                >
                  Proceed to Checkout
                </motion.button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-black text-white py-4 sm:py-6 mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm">© 2025 SOLEVIBE. All rights reserved.</p>
          <div className="mt-2 sm:mt-3 flex justify-center space-x-4 text-xs sm:text-sm">
            <Link href="/about" className="hover:underline hover:text-gray-300 transition-colors duration-300">About</Link>
            <Link href="/contact" className="hover:underline hover:text-gray-300 transition-colors duration-300">Contact</Link>
            <Link href="/terms" className="hover:underline hover:text-gray-300 transition-colors duration-300">Terms</Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
        .animate-bounce { animation: bounce 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}