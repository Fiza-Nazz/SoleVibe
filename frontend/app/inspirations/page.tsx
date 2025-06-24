'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, FilterIcon, XIcon, HeartIcon, ShoppingCartIcon, Loader2 } from 'lucide-react';

// Enhanced inspirational content with new shoe data and additional entries
const initialInspirations = [
  {
    id: 1,
    title: 'Summer 2025 Sneaker Trends',
    description: 'Dive into vibrant colors and lightweight designs dominating this season.',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749588065/image_5_rmfe3h.webp',
    category: 'Trends',
    date: 'June 15, 2025',
    shoes: [
      { name: 'Vans Slip-On', price: 70.00, description: 'Easy-on shoes for girls', sizes: ['3', '4', '5'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593787/pink_vf6zxc.webp' },
      { name: 'On Cloudflow', price: 165.00, description: 'Lightweight running shoes with CloudTec technology', sizes: ['8', '9', '10', '11'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg' },
    ],
  },
  {
    id: 2,
    title: 'Behind the Design: Adidas Ultra Boost',
    description: 'Unveil the innovation and craftsmanship of Adidas\' legendary Ultra Boost.',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg',
    category: 'Stories',
    date: 'June 10, 2025',
    shoes: [
      { name: 'Asics Gel-Nimbus', price: 160.00, description: 'Soft cushioning for women', sizes: ['7', '8', '9'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593839/light_b2lw5b.jpg' },
      { name: 'Hoka Carbon X', price: 180.00, description: 'Carbon-plated racing shoes for men', sizes: ['9', '10', '11'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749595866/hokiiiii_jhgaes.webp' },
    ],
  },
  {
    id: 3,
    title: 'Fall Collection Preview',
    description: 'Discover earthy tones and rugged styles in our upcoming fall lineup.',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749591783/men_shoe_iiwhn8.webp',
    category: 'Collections',
    date: 'June 8, 2025',
    shoes: [
      { name: 'Skechers D’Lites', price: 90.00, description: 'Lightweight shoes for children', sizes: ['C5', 'C6', 'C7'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593936/children_nsnbi8.jpg' },
      { name: 'Salomon Speedcross', price: 130.00, description: 'Aggressive trail running shoes for men', sizes: ['9', '10', '11', '12'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg' },
    ],
  },
  {
    id: 4,
    title: 'Nike Air Max Evolution',
    description: 'Journey through the iconic evolution of Nike\'s Air Max series.',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587212/puma_ehwqrh.jpg',
    category: 'Stories',
    date: 'June 5, 2025',
    shoes: [
      { name: 'Vans Slip-On', price: 70.00, description: 'Easy-on shoes for girls', sizes: ['3', '4', '5'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593787/pink_vf6zxc.webp' },
      { name: 'Asics Gel-Nimbus', price: 160.00, description: 'Soft cushioning for women', sizes: ['7', '8', '9'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749593839/light_b2lw5b.jpg' },
    ],
  },
  {
    id: 5,
    title: 'Winter 2025 Bold Styles',
    description: 'Embrace the cold with bold designs and premium materials.',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp',
    category: 'Trends',
    date: 'June 3, 2025',
    shoes: [
      { name: 'On Cloudflow', price: 165.00, description: 'Lightweight running shoes with CloudTec technology', sizes: ['8', '9', '10', '11'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg' },
      { name: 'Salomon Speedcross', price: 130.00, description: 'Aggressive trail running shoes for men', sizes: ['9', '10', '11', '12'], image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg' },
    ],
  },
];

// Inspiration Card Component
const InspirationCard = ({ item, onClick, onAddToWishlist, onAddToCart }: { item: typeof initialInspirations[0]; onClick: () => void; onAddToWishlist: (id: number) => void; onAddToCart: (id: number, shoe: typeof item.shoes[0]) => void }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -10 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer border border-gray-100"
    onClick={onClick}
  >
    <div className="relative w-full h-72">
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover object-center transition-transform duration-700 hover:scale-110"
        onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onAddToWishlist(item.id); }}
          className="p-2 bg-black/60 rounded-full shadow-md"
          aria-label="Add to wishlist"
        >
          <HeartIcon className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.2, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onAddToCart(item.id, item.shoes[0]); }}
          className="p-2 bg-black/60 rounded-full shadow-md"
          aria-label="Add to cart"
        >
          <ShoppingCartIcon className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
    <div className="p-6">
      <span className="inline-block text-sm font-medium text-gray-500 mb-2">{item.date}</span>
      <h3 className="text-2xl font-bold text-black mb-3 hover:text-gray-900 transition-colors duration-300 line-clamp-1">{item.title}</h3>
      <p className="text-gray-600 mb-4 text-base line-clamp-2">{item.description}</p>
      <div className="flex flex-wrap gap-2">
        {item.shoes.map((shoe, idx) => (
          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full hover:bg-gray-200 transition-colors duration-200">
            {shoe.name}
          </span>
        ))}
      </div>
      <span className="mt-2 inline-block px-4 py-1 bg-black text-white text-sm font-semibold rounded-full">{item.category}</span>
    </div>
  </motion.div>
);

// Inspiration Modal Component
const InspirationModal = ({ item, onClose, onAddToCart }: { item: typeof initialInspirations[0]; onClose: () => void; onAddToCart: (id: number, shoe: typeof item.shoes[0]) => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="bg-white p-8 rounded-3xl max-w-4xl w-full relative shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black text-3xl hover:text-gray-600 transition-all duration-200"
        aria-label="Close modal"
      >
        <XIcon className="w-7 h-7" />
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative w-full h-[400px]">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center rounded-2xl transition-opacity duration-500"
            onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
          />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-black mb-4">{item.title}</h2>
          <p className="text-gray-700 mb-6 text-lg">{item.description}</p>
          <p className="text-sm text-gray-500 mb-6">Published: {item.date}</p>
          <div className="space-y-6">
            {item.shoes.map((shoe, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <div className="relative w-24 h-20">
                  <Image
                    src={shoe.image}
                    alt={shoe.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 15vw"
                    className="object-cover object-center rounded-lg"
                    onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-black">{shoe.name}</h4>
                  <p className="text-sm text-gray-600">{shoe.description}</p>
                  <p className="text-sm text-gray-800">${shoe.price.toFixed(2)}</p>
                  <div className="flex gap-2 mt-1">
                    {shoe.sizes.map((size, sIdx) => (
                      <span key={sIdx} className="text-xs bg-gray-200 px-2 py-1 rounded-full">{size}</span>
                    ))}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onAddToCart(item.id, shoe); }}
                  className="ml-auto px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300"
                >
                  Add to Cart
                </motion.button>
              </motion.div>
            ))}
          </div>
          <Link
            href={`/inspirations/${item.id}`}
            className="mt-8 inline-block px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300"
          >
            Explore Full Story <ArrowRight className="inline ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// Inspiration Page Component
export default function InspirationPage() {
  const [inspirations, setInspirations] = useState(initialInspirations.slice(0, 3));
  const [filter, setFilter] = useState('All');
  const [loadMore, setLoadMore] = useState(3);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<{ id: number; shoe: typeof initialInspirations[0]['shoes'][0]; quantity: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load animations and handle filtering
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      applyFilters();
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [filter, loadMore]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop - clientHeight < 150 && loadMore < initialInspirations.length && !isLoading) {
          setLoadMore((prev) => Math.min(prev + 2, initialInspirations.length));
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 400);
        }
      }
    };
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [loadMore, isLoading]);

  // Filter Logic
  const applyFilters = () => {
    let filtered = [...initialInspirations].filter(
      (item) => filter === 'All' || item.category === filter
    );
    setInspirations(filtered.slice(0, loadMore));
  };

  // Wishlist and Cart Management
  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addToCart = (id: number, shoe: typeof initialInspirations[0]['shoes'][0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id && item.shoe.name === shoe.name);
      return existing
        ? prev.map((item) => (item.id === id && item.shoe.name === shoe.name ? { ...item, quantity: (item.quantity || 1) + 1 } : item))
        : [...prev, { id, shoe, quantity: 1 }];
    });
  };

  const openModal = (id: number) => setSelectedItem(id);
  const closeModal = () => setSelectedItem(null);

  return (
    <div className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl font-extrabold text-black tracking-wide"
          >
            <span className="bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
              <strong>SoleVibe Inspiration</strong>
            </span>
          </motion.h1>
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(filter === 'All' ? 'Trends' : 'All')}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-md"
              aria-label="Toggle filter"
            >
              <FilterIcon className="w-6 h-6 text-gray-700" />
            </motion.button>
            <Link href="/cart" className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-md"
                aria-label="View cart"
              >
                <ShoppingCartIcon className="w-6 h-6 text-gray-700" />
              </motion.button>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                </motion.span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mt-28 mb-16 max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
      >
        <Image
          src="https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg"
          alt="Inspiration Hero"
          width={1400}
          height={500}
          className="w-full h-[350px] sm:h-[450px] lg:h-[550px] object-cover transition-transform duration-1000 hover:scale-105"
          onError={(e) => { e.currentTarget.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg'; }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-start p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              Unleash Your <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">Style</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 mt-4">Discover the latest trends and stories from SoleVibe.</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-1/4 bg-gray-50 p-6 rounded-2xl shadow-lg sticky top-28 h-fit"
          >
            <h2 className="text-2xl font-bold text-black mb-6">Explore By</h2>
            <motion.select
              whileFocus={{ scale: 1.03 }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-300 bg-white text-black text-lg"
              aria-label="Filter inspirations"
            >
              <option value="All">All Categories</option>
              <option value="Trends">Trends</option>
              <option value="Stories">Stories</option>
              <option value="Collections">Collections</option>
            </motion.select>
          </motion.aside>

          {/* Inspiration Grid */}
          <div ref={containerRef} className="w-full lg:w-3/4">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-200 rounded-2xl h-96 animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ))}
              </div>
            )}
            {!isLoading && inspirations.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center text-xl text-gray-500 py-16"
              >
                No inspirations available for this filter.
              </motion.p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {inspirations.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 60, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 60, scale: 0.9 }}
                      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                    >
                      <InspirationCard
                        item={item}
                        onClick={() => openModal(item.id)}
                        onAddToWishlist={toggleWishlist}
                        onAddToCart={addToCart}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            {loadMore < initialInspirations.length && !isLoading && (
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#1a202c' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLoadMore((prev) => Math.min(prev + 2, initialInspirations.length))}
                className="mt-10 mx-auto block px-8 py-4 bg-black text-white font-semibold rounded-xl transition-all duration-300 hover:bg-gray-800 text-lg"
              >
                Discover More
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Inspiration Modal */}
      <AnimatePresence>
        {selectedItem && (
          <InspirationModal
            item={initialInspirations.find((i) => i.id === selectedItem)!}
            onClose={closeModal}
            onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>

      {/* Overlay for Mobile Filters */}
      <AnimatePresence>
        {filter !== 'All' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="lg:hidden fixed inset-0 bg-black z-40"
            onClick={() => setFilter('All')}
          />
        )}
      </AnimatePresence>

      {/* Loading Spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/90 flex items-center justify-center z-50"
        >
          <Loader2 className="w-16 h-16 text-gray-700 animate-spin" />
        </motion.div>
      )}
    </div>
  );
}