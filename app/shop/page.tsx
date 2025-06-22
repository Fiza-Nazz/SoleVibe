"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch, FaFilter, FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// Sample shoe data (selected 20 attractive products)
const initialShoes = [
  { id: 1, name: "Yeezy Boost 350", price: 220, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg", category: "Men" },
  { id: 2, name: "Nike Air Force 1", price: 110, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593330/kala_yuzdlb.jpg", category: "Men" },
  { id: 3, name: "Adidas Stan Smith", price: 90, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593353/giles_shoes_mbklaq.jpg", category: "Women" },
  { id: 4, name: "Puma RS-X", price: 90, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587212/puma_ehwqrh.jpg", category: "Men" },
  { id: 5, name: "Reebok Nano X", price: 130, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp", category: "Women" },
  { id: 6, name: "Converse Chuck Taylor", price: 70, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587574/image_5_osjh6u.webp", category: "All" },
  { id: 7, name: "Under Armour HOVR", price: 140, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587745/image_3_vpu9sz.webp", category: "Boys" },
  { id: 8, name: "Vans Old Skool", price: 80, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587954/image_4_bysmzs.jpg", category: "Girls" },
  { id: 9, name: "Asics Gel-Kayano", price: 160, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588065/image_5_rmfe3h.webp", category: "Women" },
  { id: 10, name: "Hoka One One Clifton", price: 135, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588635/hoka_znlxmh.jpg", category: "Men" },
  { id: 11, name: "Timberland 6-Inch Boot", price: 180, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588703/timer_ooiggd.avif", category: "Boys" },
  { id: 12, name: "Dr. Martens 1460", price: 140, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749595484/dr_bmupyb.webp", category: "Women" },
  { id: 13, name: "Hoka Carbon X", price: 180, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749595866/hokiiiii_jhgaes.webp", category: "Men" },
  { id: 14, name: "On Cloudflow", price: 165, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg", category: "Men" },
  { id: 15, name: "Salomon Speedcross", price: 130, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg", category: "Men" },
  { id: 16, name: "Brooks Ghost", price: 140, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749591783/men_shoe_iiwhn8.webp", category: "Men" },
  { id: 17, name: "Ecco Soft 7", price: 150, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749596263/coco_syehib.jpg", category: "Women" },
  { id: 18, name: "Columbia Newton Ridge", price: 110, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749591934/women_mrgq8z.webp", category: "Men" },
  { id: 19, name: "Clarks Desert Boot", price: 130, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592024/womennnn_sw933m.jpg", category: "Women" },
  { id: 20, name: "Mizuno Wave Prophecy", price: 170, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593018/white_hkfdiu.webp", category: "Men" },
];

export default function ShopPage() {
  const [shoes, setShoes] = useState(initialShoes);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  // Filter and search shoes
  useEffect(() => {
    let filteredShoes = initialShoes.filter(shoe => 
      shoe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === "All" || shoe.category === categoryFilter) &&
      shoe.price >= priceRange[0] && shoe.price <= priceRange[1]
    );
    setShoes(filteredShoes);
    setCurrentPage(1); // Reset to first page on filter
  }, [searchTerm, categoryFilter, priceRange]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentShoes = shoes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(shoes.length / itemsPerPage);

  // Add to Cart function
  const addToCart = (shoe: { id: number; name: string; price: number; image: string }) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: { id: number }) => item.id === shoe.id);
    if (!existingItem) {
      cart.push({ ...shoe, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      router.push("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="bg-black text-white p-6 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-4xl font-extrabold tracking-wide hover:text-gray-200 transition-transform duration-300 hover:scale-105">
            SOLEVIBE
          </Link>
          <h1 className="text-3xl font-bold animate-pulse">Shop Shoes</h1>
          <Link href="/wishlist" className="flex items-center space-x-2 hover:text-gray-200 transition-all duration-300">
            <FaHeart className="w-6 h-6" />
            <span className="text-lg">Wishlist</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-8 pt-0 relative z-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search shoes..."
                className="w-full p-3 rounded-full bg-white text-black border-2 border-black focus:outline-none focus:ring-2 focus:ring-black shadow-md"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-600" />
            </div>
          </div>
          <div className="w-full md:w-1/3 flex flex-col md:flex-row gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 rounded-full bg-white text-black border-2 border-black focus:outline-none focus:ring-2 focus:ring-black shadow-md"
            >
              <option value="All">All Categories</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
            </select>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="300"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                className="w-full p-2 accent-black"
              />
              <span className="absolute -top-6 left-0 text-black font-medium">${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Shoe Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {currentShoes.map((shoe) => (
            <motion.div
              key={shoe.id}
              className="bg-white border-2 border-black rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05, rotateZ: 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={shoe.image}
                  alt={shoe.name}
                  className="w-full h-56 object-cover rounded-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                />
                <motion.button
                  whileHover={{ scale: 1.2, backgroundColor: "#333" }}
                  className="absolute top-2 right-2 bg-black text-white p-2 rounded-full shadow-md"
                  onClick={() => {/* Add to Wishlist logic here */}}
                >
                  <FaHeart className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="p-3">
                <h3 className="text-xl font-bold text-black truncate">{shoe.name}</h3>
                <p className="text-lg text-gray-800 mt-1">${shoe.price.toFixed(2)}</p>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#333" }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 w-full bg-black text-white py-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg flex items-center justify-center"
                  onClick={() => addToCart(shoe)}
                >
                  <FaShoppingCart className="mr-2" /> Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-full ${currentPage === i + 1 ? "bg-black text-white" : "bg-white text-black border-2 border-black"} font-semibold shadow-md`}
                whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2025 SOLEVIBE. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4 text-sm">
            <Link href="/about" className="hover:underline hover:text-gray-200 transition-colors duration-300">About</Link>
            <Link href="/contact" className="hover:underline hover:text-gray-200 transition-colors duration-300">Contact</Link>
            <Link href="/terms" className="hover:underline hover:text-gray-200 transition-colors duration-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}