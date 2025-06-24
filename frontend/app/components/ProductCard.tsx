"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [rotated, setRotated] = useState(false);

  const handleImageClick = () => {
    setRotated(!rotated);
  };

  return (
    <div className="relative bg-white text-black rounded-2xl border border-gray-200 overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-300 ease-in-out group">
      {/* Image Section */}
      <div
        className="w-full h-72 overflow-hidden cursor-pointer bg-white relative"
        onClick={handleImageClick}
      >
        <Image
          src={product.image}
          alt={product.name}
          width={288} // 288px = h-72 (3:4 aspect ratio)
          height={384}
          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-in-out 
            ${rotated ? 'rotate-[360deg]' : ''}
            grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:shadow-xl
          `}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg';
          }}
        />

        {/* Heart Icon */}
        <button
          type="button"
          title="Add to Wishlist"
          className="absolute top-3 right-3 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:scale-110 transition-all duration-300"
        >
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
            2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81
            14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55
            11.54L12 21.35z" />
          </svg>
        </button>

        {/* Quick View Button */}
        <button
          type="button"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-90 transition-opacity duration-300 hover:bg-white hover:text-black border hover:border-black"
        >
          Quick View
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold hover:text-gray-800 transition-colors duration-200 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 font-medium">${product.price}</p>

        <Link
          href={{
            pathname: '/addcart',
            query: { id: product.id },
          }}
          className="mt-2 inline-block text-sm border border-black text-black px-4 py-1.5 rounded-md hover:bg-black hover:text-white transition-all duration-300"
          prefetch={false}
        >
          Add to Cart
        </Link>
      </div>

      {/* Trending Badge */}
      <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-90 hover:opacity-100 transition-opacity duration-300">
        TRENDING
      </span>
    </div>
  );
}
