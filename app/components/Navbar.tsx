'use client';

import Link from 'next/link';
import {
  FaShoppingCart,
  FaUser,
  FaHeart,
  FaSearch,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  type Product = { id: number | string; name: string; [key: string]: any };
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch((err) => console.error('Failed to load products:', err));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setShowDropdown(false);
      setFilteredProducts([]);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(lowerTerm)
    );

    setFilteredProducts(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelectProduct = (id: number | string) => {
    setSearchTerm('');
    setShowDropdown(false);
    router.push(`/addcart?id=${id}`);
  };

  return (
    <nav className="bg-white text-black p-4 shadow-md sticky top-0 z-50 border-b border-gray-200 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4 relative">
        
        {/* ✅ Left-Aligned Bold Logo */}
        <div className="flex items-center justify-start flex-grow md:flex-grow-0">
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-80"
          >
            <span className="text-black">SOLE</span>
            <span className="text-gray-800">VIBE</span>
          </Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden ml-auto">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black text-xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-lg relative">
          <input
            type="text"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-black"
          />
          <FaSearch className="absolute right-3 top-3 text-black w-4 h-4" />
          {showDropdown && (
            <ul className="absolute z-50 bg-white border border-gray-200 mt-1 w-full max-h-64 overflow-y-auto rounded-md shadow-lg">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  >
                    {product.name}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400 text-sm">No products found</li>
              )}
            </ul>
          )}
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/categories" className="hover:underline underline-offset-4">All Categories</Link>
          <Link href="/gift-cards" className="hover:underline underline-offset-4">Gift Cards</Link>
          <Link href="/special-events" className="hover:underline underline-offset-4">Special Event</Link>
        </div>

        {/* Icons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/logout">Logout</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/wishlist" className="relative">
            <FaHeart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">2</span>
          </Link>
          <Link href="/profile">
            <FaUser className="w-6 h-6" />
          </Link>
          <Link href="/cart" className="relative">
            <FaShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="w-full md:hidden flex flex-col space-y-4 mt-4 text-black">
            <input
              type="text"
              placeholder="Search products"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-black"
            />
            {showDropdown && (
              <ul className="bg-white border border-gray-200 mt-1 w-full max-h-64 overflow-y-auto rounded-md shadow-lg">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {product.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400 text-sm">No products found</li>
                )}
              </ul>
            )}
            <Link href="/categories">All Categories</Link>
            <Link href="/gift-cards">Gift Cards</Link>
            <Link href="/special-events">Special Event</Link>
            <Link href="/logout">Logout</Link>
            <Link href="/signup">Signup</Link>
            <Link href="/wishlist" className="flex items-center gap-2">
              <FaHeart className="w-5 h-5" />
              Wishlist
            </Link>
            <Link href="/profile" className="flex items-center gap-2">
              <FaUser className="w-5 h-5" />
              Profile
            </Link>
            <Link href="/cart" className="flex items-center gap-2">
              <FaShoppingCart className="w-5 h-5" />
              Cart
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
