"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState, useEffect } from "react";

interface Offer {
  id: number;
  title: string;
  description: string;
  image: string;
  discount: string;
  badge: string;
  expiry: string;
}

interface OfferProps {
  onOfferSelect?: (offerId: number) => void;
}

const offers: Offer[] = [
  {
    id: 1,
    title: "Summer Style Sale",
    description: "Get 20% off on all summer collections.",
    image:
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749680483/fashion_4_nkvyqi.avif",
    discount: "20% OFF",
    badge: "HOT DEAL",
    expiry: "2025-06-30T23:59:59",
  },
  {
    id: 2,
    title: "Elegant Footwear Deal",
    description: "Buy 1, Get 1 Free on selected shoes.",
    image:
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749680517/fasion_2_b01tfr.jpg",
    discount: "BOGO",
    badge: "LIMITED TIME",
    expiry: "2025-06-20T23:59:59",
  },
  {
    id: 3,
    title: "Winter Warmth Offer",
    description: "Up to 30% off on winter boots.",
    image:
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749680499/fason_3_efhk0r.avif",
    discount: "30% OFF",
    badge: "SEASONAL",
    expiry: "2025-07-15T23:59:59",
  },
];

function calculateRemainingTime(expiry: string) {
  const now = new Date();
  const end = new Date(expiry);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export default function Offer({ onOfferSelect }: OfferProps) {
  const [isClient, setIsClient] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState<string[]>([]);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: "snap",
    slides: { perView: 1, spacing: 16 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    animationEnded() {
      setIsAnimating(false);
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const saved = localStorage.getItem("favorites");
      if (saved) setFavorites(JSON.parse(saved));
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, isClient]);

  useEffect(() => {
    const updateTimers = () => {
      const times = offers.map((offer) => calculateRemainingTime(offer.expiry));
      setRemainingTimes(times);
    };

    if (isClient) {
      updateTimers();
      const timer = setInterval(updateTimers, 1000);
      return () => clearInterval(timer);
    }
  }, [isClient]);

  useEffect(() => {
    if (instanceRef.current && autoPlay) {
      const interval = setInterval(() => {
        if (!isAnimating) {
          setIsAnimating(true);
          instanceRef.current?.next();
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, instanceRef, isAnimating]);

  const nextSlide = () => {
    if (instanceRef.current && !isAnimating) {
      setIsAnimating(true);
      instanceRef.current.next();
    }
  };

  const prevSlide = () => {
    if (instanceRef.current && !isAnimating) {
      setIsAnimating(true);
      instanceRef.current.prev();
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleDetails = (id: number) => {
    setShowDetails(showDetails === id ? null : id);
  };

  const toggleAutoPlay = () => {
    setAutoPlay((prev) => !prev);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white text-gray-900 rounded-2xl shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 tracking-tight animate-pulse">
        SoleVibe | Exclusive Offers
      </h2>

      <div className="relative overflow-hidden rounded-xl shadow-lg group">
        <div ref={sliderRef} className="keen-slider">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className="keen-slider__slide transition-opacity duration-500 ease-in-out"
            >
              <div className="relative w-full aspect-[16/9] bg-gray-100">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-contain rounded-xl transition-transform duration-700 ease-in-out group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder-image.jpg";
                  }}
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md animate-bounce">
                  {offer.badge}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-4 sm:p-6 rounded-b-xl text-white">
                  <h3 className="text-xl sm:text-2xl font-semibold">{offer.title}</h3>
                  <p className="text-sm mt-1">{offer.description}</p>
                  <p className="text-lg font-medium mt-2">{offer.discount}</p>
                  {isClient && (
                    <p className="text-xs mt-1 font-medium animate-pulse">
                      {remainingTimes[index] || "Calculating..."}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex justify-center gap-3 sm:gap-4">
                <button
                  onClick={() => toggleFavorite(offer.id)}
                  className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    favorites.includes(offer.id)
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {favorites.includes(offer.id) ? "★ Favorited" : "☆ Favorite"}
                </button>
                <button
                  onClick={() => toggleDetails(offer.id)}
                  className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
                >
                  {showDetails === offer.id ? "Hide Details" : "Show Details"}
                </button>
              </div>

              {showDetails === offer.id && (
                <div className="mt-4 text-center border border-gray-300 p-4 sm:p-6 rounded-lg bg-white shadow-md animate-fade-in">
                  <p className="text-sm font-medium">
                    Code: <strong>SOLEVIBE20</strong>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Expires on: {new Date(offer.expiry).toDateString()}
                  </p>
                  <button
                    onClick={() => onOfferSelect?.(offer.id)}
                    className="mt-3 px-4 sm:px-6 py-1.5 sm:py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Claim Offer 🎁
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 bg-gray-100/80 text-gray-900 p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 z-10"
          aria-label="Previous Slide"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 bg-gray-100/80 text-gray-900 p-2 sm:p-3 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 z-10"
          aria-label="Next Slide"
        >
          →
        </button>
      </div>

      {/* Dots and Autoplay Control */}
      <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6">
        <button
          onClick={toggleAutoPlay}
          className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-xs font-medium hover:bg-gray-200 transition-all duration-300"
          aria-label={autoPlay ? "Pause Autoplay" : "Resume Autoplay"}
        >
          {autoPlay ? "❚❚ Pause" : "▶ Play"}
        </button>
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (instanceRef.current && !isAnimating) {
                instanceRef.current.moveToIdx(index);
                setCurrentSlide(index);
              }
            }}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-gray-300 transition-all duration-300 transform hover:scale-125 ${
              currentSlide === index
                ? "bg-red-600 border-red-600"
                : "bg-gray-100"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
