'use client';
import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import HomeSection from "./components/HomeSection";
import ProductCard from "./components/ProductCard";
import ExpColor from "./components/ExpColor";
import Offer from "./components/Offer";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/products", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch failed:", err);
        setProducts([]);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <HomeSection />
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* 🔥 Updated Heading Starts */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center mb-12 leading-tight tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-black">
            Welcome to
          </span>{' '}
          <span className="inline-block transform rotate-[-1deg] scale-105 text-red-600 hover:text-black transition duration-300">
            SOLEVIBE
          </span>
          <span className="block text-lg sm:text-xl font-medium text-gray-600 mt-2">
            Your Ultimate ShoeStore Experience
          </span>
        </h1>
        {/* 🔥 Updated Heading Ends */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No products available.
            </p>
          )}
        </div>

        <ExpColor products={products} onFilterChange={() => {}} />
        <Offer />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
