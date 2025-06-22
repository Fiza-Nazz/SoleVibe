'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, XIcon, FilterIcon, Loader2 } from 'lucide-react';

// Sample shoe data with consistent image sources
const initialShoes = [
  { id: 1, name: 'Yeezy Boost 350 V2', price: 220, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg', category: 'Men', brand: 'Adidas', isNew: true, discount: 0, rating: 4.8 },
  { id: 2, name: 'Nike Air Force 1 Low', price: 110, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593330/kala_yuzdlb.jpg', category: 'Men', brand: 'Nike', isNew: false, discount: 10, rating: 4.5 },
  { id: 3, name: 'Adidas Stan Smith', price: 90, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593353/giles_shoes_mbklaq.jpg', category: 'Women', brand: 'Adidas', isNew: false, discount: 0, rating: 4.2 },
  { id: 4, name: 'Puma RS-X', price: 90, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587212/puma_ehwqrh.jpg', category: 'Men', brand: 'Puma', isNew: true, discount: 15, rating: 4.6 },
  { id: 5, name: 'Reebok Nano X', price: 130, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp', category: 'Women', brand: 'Reebok', isNew: false, discount: 0, rating: 4.3 },
  { id: 6, name: 'Converse Chuck Taylor', price: 70, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587574/image_5_osjh6u.webp', category: 'Unisex', brand: 'Converse', isNew: false, discount: 5, rating: 4.7 },
  { id: 7, name: 'New Balance 990', price: 180, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp', category: 'Men', brand: 'New Balance', isNew: true, discount: 0, rating: 4.9 },
  { id: 8, name: 'Vans Old Skool', price: 65, image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg', category: 'Women', brand: 'Vans', isNew: false, discount: 10, rating: 4.4 },
];

// Heart Icon Component
const HeartIcon = ({ isFilled, onClick }: { isFilled: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-2 bg-black/60 rounded-full shadow-md transition-all duration-200"
    aria-label={isFilled ? 'Remove from wishlist' : 'Add to wishlist'}
  >
    <svg className="w-5 h-5" fill={isFilled ? '#ff4d4d' : 'none'} stroke="white" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  </motion.button>
);

// Cart Icon Component
const CartIcon = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.2, rotate: -5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-2 bg-black/60 rounded-full shadow-md transition-all duration-200"
    aria-label="Add to cart"
  >
    <ShoppingCartIcon className="w-5 h-5 text-white" />
  </motion.button>
);

// Quick View Modal Component
const QuickViewModal = ({ shoe, onClose, onAddToCart }: { shoe: typeof initialShoes[0]; onClose: () => void; onAddToCart: (id: number) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white p-6 sm:p-8 rounded-3xl max-w-md w-full relative shadow-2xl"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black text-2xl font-bold hover:text-gray-600 transition-colors duration-200"
        aria-label="Close quick view"
      >
        <XIcon className="w-6 h-6" />
      </button>
      <Image
        src={shoe.image}
        alt={shoe.name}
        width={400}
        height={300}
        className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-6"
        onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
      />
      <h3 className="text-2xl sm:text-3xl font-bold text-black mb-2">{shoe.name}</h3>
      <p className="text-lg sm:text-xl text-gray-700 mb-2">
        ${shoe.discount > 0 ? (shoe.price * (1 - shoe.discount / 100)).toFixed(2) : shoe.price.toFixed(2)}
        {shoe.discount > 0 && <span className="text-sm text-gray-500 line-through ml-2">${shoe.price.toFixed(2)}</span>}
      </p>
      <p className="text-gray-500 mb-4">Category: {shoe.category} | Brand: {shoe.brand} | Rating: {shoe.rating}/5</p>
      <div className="flex gap-4">
        <Link
          href={`/viewdetail/${shoe.id}`}
          className="flex-1 px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300"
        >
          View Details
        </Link>
        <button
          onClick={() => onAddToCart(shoe.id)}
          className="flex-1 px-6 py-3 bg-gray-800 text-white font-semibold rounded-full hover:bg-black transition-all duration-300"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Cart Preview Component
const CartPreview = ({ cart, onClose }: { cart: { id: number; quantity: number }[]; onClose: () => void }) => (
  <motion.div
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl p-6 z-50"
  >
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Your Cart</h2>
      <button onClick={onClose} className="text-black text-2xl hover:text-gray-600 transition-colors duration-200" aria-label="Close cart">
        <XIcon className="w-6 h-6" />
      </button>
    </div>
    {cart.length === 0 ? (
      <p className="text-gray-500">Your cart is empty.</p>
    ) : (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {cart.map((item) => {
          const shoe = initialShoes.find((s) => s.id === item.id);
          return shoe ? (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-4 items-center p-2 bg-gray-50 rounded-xl"
            >
              <Image
                src={shoe.image}
                alt={shoe.name}
                width={80}
                height={60}
                className="h-16 w-20 object-cover rounded-lg"
                onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
              />
              <div>
                <p className="font-semibold">{shoe.name}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
                <p className="text-gray-700">${(shoe.price * item.quantity).toFixed(2)}</p>
              </div>
            </motion.div>
          ) : null;
        })}
      </div>
    )}
    <Link
      href="/cart"
      className="block mt-6 px-6 py-3 bg-black text-white font-semibold rounded-full text-center hover:bg-gray-800 transition-all duration-300"
    >
      View Full Cart
    </Link>
  </motion.div>
);

// Skeleton Loader Component
const ShoeCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse"
  >
    <div className="relative h-64 bg-gray-300" />
    <div className="p-6 space-y-2">
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-6 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-10 bg-gray-300 rounded mt-4" />
    </div>
  </motion.div>
);

export default function CollectionsPage() {
  const [shoes, setShoes] = useState(initialShoes.slice(0, 6));
  const [filter, setFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 250]);
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [quickView, setQuickView] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loadMore, setLoadMore] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize wishlist and cart from localStorage on client-side only after mount
  useEffect(() => {
    const savedWishlist = typeof window !== 'undefined' ? localStorage.getItem('wishlist') : null;
    const savedCart = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save wishlist and cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [wishlist, cart]);

  // Load animations and handle filtering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 300); // Simulate loading delay
    return () => clearTimeout(timer);
  }, [filter, brandFilter, priceRange, sort, search, loadMore]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop - clientHeight < 100 && loadMore < initialShoes.length && !isLoading) {
          setLoadMore((prev) => Math.min(prev + 3, initialShoes.length));
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 300); // Simulate loading
        }
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loadMore, isLoading]);

  // Filter and Sort Logic with debouncing
  const applyFilters = () => {
    let filtered = [...initialShoes].filter(
      (shoe) =>
        (filter === 'All' || shoe.category === filter) &&
        (brandFilter === 'All' || shoe.brand === brandFilter) &&
        shoe.price >= priceRange[0] &&
        shoe.price <= priceRange[1] &&
        (search === '' ||
          shoe.name.toLowerCase().includes(search.toLowerCase()) ||
          shoe.brand.toLowerCase().includes(search.toLowerCase()))
    );
    applySort(filtered);
  };

  const applySort = (data: typeof initialShoes) => {
    let sorted = [...data];
    if (sort === 'lowToHigh') sorted.sort((a, b) => a.price - b.price);
    else if (sort === 'highToLow') sorted.sort((a, b) => b.price - a.price);
    else if (sort === 'popularity') sorted.sort((a, b) => b.rating - a.rating);
    setShoes(sorted.slice(0, loadMore));
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      return newWishlist;
    });
  };

  const addToCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
    setShowCart(true);
  };

  const openQuickView = (id: number) => setQuickView(id);
  const closeQuickView = () => setQuickView(null);
  const toggleFilters = () => setShowFilters(!showFilters);
  const closeCart = () => setShowCart(false);

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 transition-all duration-500 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center animate-fade-in-down">
          <motion.h1
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-wide hover:text-black transition-colors duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.span
              className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <strong>SoleVibe</strong>
            </motion.span>
          </motion.h1>

          <div className="flex gap-4 items-center">
            {/* Filter Button for Mobile */}
            <button
              onClick={toggleFilters}
              className="lg:hidden p-2 bg-gray-100 rounded-full hover:bg-gray-300 transition-transform duration-300 hover:scale-110 shadow-md"
              aria-label="Toggle filters"
            >
              <FilterIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Cart Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowCart(true)}
              className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-300 transition-transform duration-300 shadow-md"
              aria-label="View cart"
            >
              <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg"
                >
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-down {
            animation: fadeInDown 0.6s ease-out forwards;
          }
        `}</style>
      </header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mt-20 mb-12 max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      >
        <Image
          src="https://res.cloudinary.com/dood2c2ca/image/upload/v1749545934/nike-she_ebitgt.webp"
          alt="Collections Hero"
          width={1200}
          height={400}
          className="w-full h-[300px] sm:h-[400px] object-cover transition-transform duration-1000 hover:scale-105"
          onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-center px-4"
          >
            Discover the Ultimate <strong>SoleVibe</strong> Collection
          </motion.h1>
        </motion.div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl mx-auto mb-8 px-4"
      >
        <input
          type="text"
          placeholder="Search shoes or brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-gray-50 placeholder-gray-400"
          aria-label="Search shoes or brands"
        />
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (Desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden lg:block w-full lg:w-1/4 bg-gray-100 p-6 rounded-3xl shadow-lg sticky top-24 h-fit"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Filters</h2>
            <div className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-white text-gray-900"
                  aria-label="Filter by category"
                >
                  <option value="All">All Categories</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </motion.select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">Brand</label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-white text-gray-900"
                  aria-label="Filter by brand"
                >
                  <option value="All">All Brands</option>
                  {[...new Set(initialShoes.map((shoe) => shoe.brand))].map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </motion.select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="w-1/2 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    aria-label="Minimum price"
                  />
                  <input
                    type="number"
                    min={priceRange[0]}
                    max="250"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 250])}
                    className="w-1/2 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                    aria-label="Maximum price"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-gray-900"
                />
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-gray-900 mt-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Sort By</label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-white text-gray-900"
                  aria-label="Sort products"
                >
                  <option value="default">Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                </motion.select>
              </div>
            </div>
          </motion.aside>

          {/* Mobile Filter Menu */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="lg:hidden fixed top-0 left-0 h-full w-4/5 max-w-sm bg-gray-100 p-6 z-50 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                  <button onClick={toggleFilters} className="text-black text-2xl hover:text-gray-600 transition-colors duration-200" aria-label="Close filters">
                    <XIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-white text-gray-900"
                      aria-label="Filter by category"
                    >
                      <option value="All">All Categories</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Unisex">Unisex</option>
                    </motion.select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Brand</label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={brandFilter}
                      onChange={(e) => setBrandFilter(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-white text-gray-900"
                      aria-label="Filter by brand"
                    >
                      <option value="All">All Brands</option>
                      {[...new Set(initialShoes.map((shoe) => shoe.brand))].map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        min="0"
                        max={priceRange[1]}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-1/2 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                        aria-label="Minimum price"
                      />
                      <input
                        type="number"
                        min={priceRange[0]}
                        max="250"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 250])}
                        className="w-1/2 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-900"
                        aria-label="Maximum price"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="250"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-gray-900"
                    />
                    <input
                      type="range"
                      min="0"
                      max="250"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-gray-900 mt-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Sort By</label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all duration-300 bg-white text-gray-900"
                      aria-label="Sort products"
                    >
                      <option value="default">Default</option>
                      <option value="lowToHigh">Price: Low to High</option>
                      <option value="highToLow">Price: High to Low</option>
                      <option value="popularity">Popularity</option>
                    </motion.select>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleFilters}
                    className="mt-6 w-full px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300"
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shoe Grid */}
          <div ref={containerRef} className="w-full lg:w-3/4">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <ShoeCardSkeleton key={index} />
                ))}
              </div>
            )}
            {!isLoading && shoes.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center text-lg text-gray-500 py-12"
              >
                No shoes found matching your criteria.
              </motion.p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {shoes.map((shoe, index) => (
                    <motion.div
                      key={shoe.id}
                      id={`shoe-card-${index}`}
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 50, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                      className="relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1"
                    >
                      <div className="relative">
                        <Image
                          src={shoe.image}
                          alt={shoe.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                          onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
                        />
                        {shoe.isNew && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                          >
                            New
                          </motion.span>
                        )}
                        {shoe.discount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 left-4 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                          >
                            {shoe.discount}% Off
                          </motion.span>
                        )}
                        <div className="absolute top-4 right-4 flex gap-2">
                          <HeartIcon isFilled={wishlist.includes(shoe.id)} onClick={() => toggleWishlist(shoe.id)} />
                          <CartIcon onClick={() => addToCart(shoe.id)} />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: '#333' }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openQuickView(shoe.id)}
                          className="absolute bottom-4 left-4 px-4 py-2 bg-black text-white rounded-full text-sm font-semibold transition-all duration-300"
                          aria-label={`Quick view for ${shoe.name}`}
                        >
                          Quick View
                        </motion.button>
                      </div>
                      <div className="p-6">
                        <p className="text-sm text-gray-500">{shoe.brand}</p>
                        <h3 className="text-xl font-bold mb-2 transition-colors duration-300 hover:text-gray-700">
                          {shoe.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <p className="text-lg font-semibold">
                            ${shoe.discount > 0 ? (shoe.price * (1 - shoe.discount / 100)).toFixed(2) : shoe.price.toFixed(2)}
                          </p>
                          {shoe.discount > 0 && (
                            <p className="text-sm text-gray-500 line-through ml-2">${shoe.price.toFixed(2)}</p>
                          )}
                        </div>
                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(shoe.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.375 2.45a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.375-2.45a1 1 0 00-1.175 0l-3.375 2.45c-.784.57-1.838-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.24 9.397c-.784-.57-.382-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                            </svg>
                          ))}
                        </div>
                        <Link
                          href={`/viewdetail/${shoe.id}`}
                          className="block px-6 py-3 bg-black text-white font-semibold rounded-full text-center transition-all duration-300 hover:bg-gray-800 hover:-translate-y-1"
                        >
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            {loadMore < initialShoes.length && !isLoading && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLoadMore((prev) => Math.min(prev + 3, initialShoes.length))}
                className="mt-6 mx-auto block px-6 py-3 bg-black text-white font-semibold rounded-full transition-all duration-300 hover:bg-gray-800"
              >
                Load More
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickView && (
          <QuickViewModal
            shoe={initialShoes.find((s) => s.id === quickView)!}
            onClose={closeQuickView}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      {/* Cart Preview */}
      <AnimatePresence>
        {showCart && <CartPreview cart={cart} onClose={closeCart} />}
      </AnimatePresence>

      {/* Overlay for Mobile Filters and Cart */}
      <AnimatePresence>
        {(showFilters || showCart) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 bg-black z-40"
            onClick={() => {
              setShowFilters(false);
              setShowCart(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white flex items-center justify-center z-50"
        >
          <Loader2 className="w-12 h-12 text-gray-700 animate-spin" />
        </motion.div>
      )}
    </div>
  );
}