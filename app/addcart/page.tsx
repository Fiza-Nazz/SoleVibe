"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Heart, ShoppingCart, X, Share2, Star as StarIcon } from "lucide-react";
import Head from "next/head";

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description?: string;
  sizes?: string[];
  colors?: string[];
  reviews?: { rating: number; comment: string }[];
  selectedSize?: string;
  selectedColor?: string;
  quantity?: number;
}

export default function AddCartPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isWishlist, setIsWishlist] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showRatingFeedback, setShowRatingFeedback] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");

  // Load from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) setIsWishlist(JSON.parse(savedWishlist));
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedRating = localStorage.getItem(`rating_${productId}`);
    if (savedRating) setUserRating(parseInt(savedRating));
  }, [productId]);

  const fetchProduct = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return async () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const res = await fetch("http://localhost:5000/api/products");
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
          const selected = data.find((item: Product) => item.id.toString() === productId);
          if (!selected) throw new Error("Product not found");
          setProduct(selected);
          if (selected.sizes) setSelectedSize(selected.sizes[0]);
          if (selected.colors) setSelectedColor(selected.colors[0]);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      }, 300);
    };
  }, [productId]);

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId, fetchProduct]);

  const updateQuantity = useCallback((change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedSize) {
      alert("Please select a size!");
      return;
    }
    const cartItem = { ...product, selectedSize, selectedColor: selectedColor ?? undefined, quantity };
    setCart((prev) => {
      const newCart = [...prev, cartItem];
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
    setIsCartOpen(true);
    setQuantity(1);
    alert(`${product.name} added to cart!`);
    router.push("/cart"); // Navigate to cart page
  }, [product, selectedSize, selectedColor, quantity, router]);

  const handleWishlist = useCallback(() => {
    const newWishlist = !isWishlist;
    setIsWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    alert(`Added ${product?.name} to ${newWishlist ? "" : "remove from "}wishlist!`);
  }, [isWishlist, product]);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => {
      const newCart = prev.filter((_, i) => i !== index);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const handleProceedToBuy = useCallback(() => {
    if (cart.length > 0) {
      localStorage.setItem("buyItems", JSON.stringify(cart)); // Save cart items for buy page
      router.push("/buy"); // Navigate to buy page
    } else {
      alert("Cart is empty!");
    }
  }, [cart, router]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href,
      }).catch((err) => console.error("Share failed:", err));
    } else {
      alert("Share not supported on this browser. Copy link: " + window.location.href);
    }
  }, [product]);

  const handleRating = useCallback((rating: number) => {
    if (!userRating) {
      setUserRating(rating);
      localStorage.setItem(`rating_${productId}`, rating.toString());
      setShowRatingFeedback(true);
      setTimeout(() => setShowRatingFeedback(false), 2000);
    }
  }, [userRating, productId]);

  const averageRating = useMemo(() => {
    if (!product?.reviews) return 0;
    return Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / (product.reviews.length || 1));
  }, [product?.reviews]);

  const discount = product?.originalPrice ? ((product.originalPrice - product.price) / product.originalPrice) * 100 : 0;

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white p-4">
        <p className="text-black text-lg mb-4">Error: {error}</p>
        <motion.button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry
        </motion.button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <p className="text-black text-lg">Loading product...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - AI Shoe Store</title>
        <meta name="description" content={`${product.description || "Premium footwear"} - Buy now at $${product.price}`} />
        <meta name="keywords" content={`${product.name}, shoes, e-commerce, buy online, ${selectedColor || "black"}`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={window.location.href} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: product.image,
              description: product.description,
              sku: product.id,
              mpn: product.id,
              brand: { "@type": "Brand", name: "AI Shoe Store" },
              offers: {
                "@type": "Offer",
                url: window.location.href,
                priceCurrency: "USD",
                price: product.price,
                priceValidUntil: "2026-06-21",
                availability: "https://schema.org/InStock",
                seller: { "@type": "Organization", name: "AI Shoe Store" },
              },
              aggregateRating: product.reviews && {
                "@type": "AggregateRating",
                ratingValue: averageRating,
                reviewCount: product.reviews.length,
              },
            }),
          }}
        />
        <link rel="preload" href={product.image} as="image" />
      </Head>
      <motion.div
        className="min-h-screen bg-white p-4 md:p-8 text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-lg overflow-hidden p-6 border border-black"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={`${product.name} - ${selectedColor || "Black"} shoe`}
                  width={600}
                  height={600}
                  loading="lazy"
                  className="rounded-2xl w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                    -{discount.toFixed(0)}% Off
                  </span>
                )}
                <motion.button
                  onClick={handleWishlist}
                  className={`absolute top-6 right-6 p-2 rounded-full bg-white shadow-md ${
                    isWishlist ? "text-black" : "text-black"
                  } hover:bg-gray-100`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={20} />
                </motion.button>
                <motion.button
                  onClick={handleShare}
                  className="absolute top-6 right-16 p-2 rounded-full bg-white shadow-md text-black hover:bg-gray-100"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Share2 size={20} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-3xl shadow-lg p-6 lg:p-10 flex flex-col justify-between border border-black"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div>
                <h2 className="text-5xl lg:text-6xl font-extrabold text-black mb-6 tracking-wide leading-tight">
                  {product.name}
                </h2>
                <p className="text-gray-800 text-xl mb-8 leading-relaxed">
                  {product.description || "Top-quality performance sneakers designed for comfort and style."}
                </p>
                <div className="flex items-baseline gap-6 mb-8">
                  <p className="text-4xl font-bold text-black">${product.price.toFixed(2)}</p>
                  {product.originalPrice && (
                    <p className="text-2xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
                  )}
                </div>

                <div className="bg-gray-100 p-5 rounded-xl mb-8 shadow-inner">
                  <h3 className="text-xl font-semibold text-black mb-3">Quick View</h3>
                  <p className="text-gray-700">Material: Premium Leather</p>
                  <p className="text-gray-700">Color: {selectedColor || "Black"}</p>
                  <p className="text-gray-700">In Stock: 50 units</p>
                </div>

                <div className="mb-8">
                  <p className="text-lg font-semibold text-black mb-3">Choose Color</p>
                  <div className="flex gap-4 flex-wrap">
                    {product.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color ? "border-black ring-2 ring-black" : "border-gray-400"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    )) || <span className="text-gray-700 text-sm">No colors available</span>}
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-lg font-semibold text-black mb-3">Choose Your Size</p>
                  <div className="flex gap-4 flex-wrap">
                    {product.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2 border border-gray-400 rounded-full hover:bg-gray-200 hover:text-black transition duration-300 text-lg ${
                          selectedSize === size ? "bg-gray-200 text-black" : "text-gray-700"
                        } ${!selectedSize && "ring-2 ring-red-700"}`}
                      >
                        {size}
                      </button>
                    )) || <span className="text-gray-700 text-sm">Sizes Unavailable</span>}
                  </div>
                </div>

                <div className="mb-8 flex items-center gap-8">
                  <label className="text-lg font-semibold text-black">Quantity</label>
                  <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-xl">
                    <button
                      onClick={() => updateQuantity(-1)}
                      className="px-4 py-2 bg-white rounded-full hover:bg-gray-200 transition-colors text-black"
                    >
                      -
                    </button>
                    <span className="text-2xl font-medium text-black">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(1)}
                      className="px-4 py-2 bg-white rounded-full hover:bg-gray-200 transition-colors text-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-6 mb-8">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="flex-1 bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <ShoppingCart className="inline mr-2" size={20} /> Add to Cart
                  </motion.button>
                  <motion.button
                    className="flex-1 border-2 border-black text-black px-8 py-4 rounded-xl font-bold hover:bg-black hover:text-white transition-all duration-300 shadow-md flex items-center justify-center"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={handleProceedToBuy}
                  >
                    Proceed to Buy
                  </motion.button>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-black mb-4">Rate This Product</h3>
                  <div className="flex items-center gap-4 mb-4">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <motion.button
                        key={star}
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="text-2xl transition-colors duration-200"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={!!userRating}
                      >
                        <StarIcon
                          size={24}
                          fill={star <= (hoverRating ?? userRating ?? 0) ? "#000000" : "none"}
                          color={star <= (hoverRating ?? userRating ?? 0) ? "#000000" : "#d1d5db"}
                        />
                      </motion.button>
                    ))}
                    <span className="text-gray-700 text-sm ml-2">
                      {averageRating > 0 ? `Avg: ${averageRating}/5` : "No ratings yet"}
                    </span>
                  </div>
                  <AnimatePresence>
                    {showRatingFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-black bg-gray-200 p-2 rounded-lg"
                      >
                        Thank you for your rating!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {product.reviews && (
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-black mb-4">Customer Reviews</h3>
                    <div className="flex items-center gap-4 text-black mb-4">
                      {Array.from({ length: averageRating || 0 }, (_, i) => (
                        <StarIcon key={i} size={20} fill="#000000" />
                      ))}
                      <span className="text-gray-700 text-sm">{product.reviews.length} reviews</span>
                    </div>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                    >
                      {product.reviews.map((review, index) => (
                        <p key={index} className="text-gray-700 text-sm italic mb-3">{review.comment}</p>
                      ))}
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="mt-8 text-sm text-gray-700">
                <p>🚚 Free Shipping on orders over $100</p>
                <p>✅ Secure Payment • 💬 24/7 Support • 🔁 30-Day Returns</p>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {isCartOpen && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 100 }}
                className="fixed top-0 right-0 h-screen w-full md:w-96 bg-white shadow-2xl p-6 z-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-black">Shopping Cart</h3>
                  <button onClick={() => setIsCartOpen(false)}>
                    <X size={24} className="text-black hover:text-gray-600" />
                  </button>
                </div>
                {cart.length === 0 ? (
                  <p className="text-gray-700 text-center">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4 max-h-[60vh] md:max-h-[70vh] overflow-y-auto pr-2">
                    {cart.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-100 rounded-xl shadow-md"
                      >
                        <span className="text-black">{item.name} (Size: {item.selectedSize}, Color: {item.selectedColor}, Qty: {item.quantity})</span>
                        <div className="flex gap-3">
                          <span className="text-black">${(item.price * (item.quantity ?? 1)).toFixed(2)}</span>
                          <button onClick={() => removeFromCart(index)} className="text-red-700 hover:text-red-600">
                            <X size={18} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <p className="text-xl font-semibold text-black">
                    Total: ${cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0).toFixed(2)}
                  </p>
                  <motion.button
                    onClick={() => router.push("/buy")} // Navigate to buy page
                    className="w-full mt-4 px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all duration-300"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}