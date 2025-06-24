'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart, FaEnvelope, FaTruck, FaGift } from 'react-icons/fa';

interface GiftCard {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  deliveryType: string;
  image: string;
}

const giftCards: GiftCard[] = [
  {
    id: 1,
    name: 'Eid Special Gift Card',
    description: 'Celebrate Eid with style! Perfect for loved ones.',
    price: 30,
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587212/puma_ehwqrh.jpg',
  },
  {
    id: 2,
    name: 'Birthday Gift Card',
    description: 'Surprise them on their special day.',
    price: 50,
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749588065/image_5_rmfe3h.webp',
  },
  {
    id: 3,
    name: 'Shopping Spree Card',
    description: 'Let them choose what they love.',
    price: 100,
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749588942/child_2_du76vh.jpg',
  },
];

export default function GiftCardsPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [deliveryType, setDeliveryType] = useState<'digital' | 'physical'>('digital');
  const [recipient, setRecipient] = useState<{ email: string; name: string; message: string }>({ email: '', name: '', message: '' });
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage only on client-side
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Failed to parse cart:', error);
        }
      }
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const draft = { selectedCard, customAmount, quantity, deliveryType, recipient, deliveryAddress };
      localStorage.setItem('giftCardDraft', JSON.stringify(draft));
    }
  }, [selectedCard, customAmount, quantity, deliveryType, recipient, deliveryAddress, isMounted]);

  // Load draft
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('giftCardDraft');
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setSelectedCard(draft.selectedCard);
          setCustomAmount(draft.customAmount);
          setQuantity(draft.quantity);
          setDeliveryType(draft.deliveryType);
          setRecipient(draft.recipient);
          setDeliveryAddress(draft.deliveryAddress);
          updateTotalPrice(draft.selectedCard, draft.customAmount, draft.quantity);
        } catch (error) {
          console.error('Failed to parse draft:', error);
        }
      }
    }
  }, [isMounted]);

  // Update total price
  const updateTotalPrice = (cardId: number | null, custom: string, qty: number) => {
    const card = cardId ? giftCards.find((c) => c.id === cardId) : null;
    const amount = custom ? Number(custom) || 0 : card?.price || 0;
    if (amount < 0) return;
    setTotalPrice(amount * qty * (1 - discount));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const amount = customAmount ? Number(customAmount) : giftCards.find((c) => c.id === selectedCard)?.price || 0;
    
    if (!selectedCard && !customAmount) {
      newErrors.selection = 'Please select a card or enter a custom amount.';
    }
    if (customAmount && (isNaN(Number(customAmount)) || Number(customAmount) < 1000 || Number(customAmount) > 50000)) {
      newErrors.amount = 'Amount must be a number between $1,000 and $50,000.';
    }
    if (quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1.';
    }
  if (deliveryType === 'digital') {
    if (!recipient.email.includes('@') || !recipient.email.includes('.')) {
      newErrors.email = 'Please enter a valid recipient email.';
    }
    // Optionally validate recipient name if required
  } else {
    if (!deliveryAddress || deliveryAddress.trim().length < 5) {
      newErrors.address = 'Please enter a valid delivery address.';
    }
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // Handle card selection
  const handleCardSelect = (id: number) => {
    setSelectedCard(id);
    setCustomAmount('');
    updateTotalPrice(id, '', quantity);
  };

  // Handle custom amount
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setCustomAmount(value);
      setSelectedCard(null);
      updateTotalPrice(null, value, quantity);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qty = Math.max(1, Number(e.target.value));
    setQuantity(qty);
    updateTotalPrice(selectedCard, customAmount, qty);
  };

  // Handle recipient change
  const handleRecipientChange = (field: 'email' | 'name' | 'message', value: string) => {
    setRecipient({ ...recipient, [field]: value });
  };

  // Add to cart (for form)
  const handleAddToCart = async () => {
    if (!validateForm()) {
      setShowToast({ message: 'Please fix the errors in the form.', type: 'error' });
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setIsAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const card = giftCards.find((c) => c.id === selectedCard) || {
        id: 0,
        name: 'Custom Gift Card',
        price: Number(customAmount) || 0,
        image: '',
      };
      const newItem: CartItem = {
        id: card.id,
        name: card.name,
        price: customAmount ? Number(customAmount) : card.price,
        quantity,
        deliveryType,
        image: card.image,
      };
      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      setShowToast({ message: `Added ${quantity} ${card.name} to cart!`, type: 'success' });
      triggerConfetti();
      console.log('Analytics: Gift card added to cart', { id: card.id, price: card.price, quantity, deliveryType });
    } catch (error) {
      console.error('Add to cart error:', error);
      setShowToast({ message: 'Failed to add to cart. Please try again.', type: 'error' });
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  // Add to cart (for card grid)
  const handleAddCardToCart = async (card: GiftCard) => {
    setIsAddingToCart(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newItem: CartItem = {
        id: card.id,
        name: card.name,
        price: card.price,
        quantity: 1,
        deliveryType: 'digital',
        image: card.image,
      };
      const updatedCart = [...cartItems, newItem];
      setCartItems(updatedCart);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      }
      setShowToast({ message: `Added ${card.name} to cart!`, type: 'success' });
      triggerConfetti();
      console.log('Analytics: Gift card added to cart', { id: card.id, price: card.price, quantity: 1 });
    } catch (error) {
      console.error('Add to cart error:', error);
      setShowToast({ message: 'Failed to add to cart. Please try again.', type: 'error' });
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  // Confetti effect
  const triggerConfetti = () => {
    if (typeof window === 'undefined') return;
    
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 3 + 2,
        color: ['#000000', '#FFFFFF'][Math.floor(Math.random() * 2)],
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      if (particles.some((p) => p.y < canvas.height)) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };
    animate();
  };

  // Progress bar
  const progressSteps = ['Select Card', 'Details', 'Add to Cart'];
  const currentStep = Object.keys(errors).length === 0 && (selectedCard || customAmount) ? 2 : deliveryType ? 1 : 0;

  if (!isMounted) return null;

    function applyPromoCode(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      event.preventDefault();
      if (promoCode.trim().toUpperCase() === 'SOLEVIBE15') {
        setDiscount(0.15);
        setShowToast({ message: 'Promo code applied! 15% off.', type: 'success' });
        updateTotalPrice(selectedCard, customAmount, quantity);
      } else {
        setDiscount(0);
        setShowToast({ message: 'Invalid promo code.', type: 'error' });
      }
      setTimeout(() => setShowToast(null), 3000);
    }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header with Video */}
      <header className="relative bg-black py-8 sm:py-12 md:py-16 lg:py-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10 filter grayscale"
          onError={(e) => {
            console.error('Video load error:', {
              message: e.currentTarget.error?.message,
              code: e.currentTarget.error?.code,
              src: e.currentTarget.currentSrc,
            });
            setShowToast({ message: 'Failed to load video.', type: 'error' });
          }}
        >
          <source src="https://res.cloudinary.com/dood2c2ca/video/upload/v1749587212/shoe-video.mp4" type="video/mp4" />
          <source src="https://res.cloudinary.com/dood2c2ca/video/upload/v1749587212/shoe-video.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 animate-slide-in">
            SoleVibe Gift Cards
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 animate-slide-in" style={{ animationDelay: '0.2s' }}>
            Gift style and comfort – perfect for every occasion
          </p>
          <nav className="mt-4 text-sm sm:text-base text-gray-400">
            <Link href="/" className="hover:text-white transition-colors duration-200">
              Home
            </Link>{' '}
            / <span>Gift Cards</span>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Gift Cards Grid */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-6 sm:mb-8 animate-slide-in">
            Our Gift Cards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {giftCards.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer w-full sm:w-80"
                onClick={() => handleCardSelect(card.id)}
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={card.image}
                    alt={card.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={card.id === 1}
                    className="transition-transform duration-300 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                    onError={() => {
                      console.error('Image load failed:', card.image);
                      setShowToast({ message: `Failed to load image for ${card.name}`, type: 'error' });
                    }}
                  />
                  {selectedCard === card.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <FaGift className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold text-black mb-2">{card.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{card.description}</p>
                  <p className="text-sm sm:text-base font-semibold text-black">
                    $ {card.price.toLocaleString('en-US')}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddCardToCart(card);
                    }}
                    className="mt-4 w-full text-center bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <span className="animate-spin inline-block mr-2">⏳</span>
                    ) : (
                      <FaShoppingCart className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    )}
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Purchase Form */}
        <section ref={formRef} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12 sm:mb-16 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-6 animate-slide-in">
            Customize Your Gift Card
          </h2>
          {Object.keys(errors).length > 0 && (
            <div className="bg-gray-100 border border-gray-200 text-black p-4 rounded-lg mb-6 animate-fade-in">
              {Object.values(errors).map((error, i) => (
                <p key={i} className="text-xs sm:text-sm text-black">{error}</p>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Custom Amount */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                Custom Amount
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount ($1,000–50,000)"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                />
                {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount}</p>}
              </label>
            </div>
            {/* Quantity */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                Quantity
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                />
                {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
              </label>
            </div>
            {/* Promo Code */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                Promo Code
                <div className="flex">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-3 sm:px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-800 transition-all duration-200 text-sm sm:text-base"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && <p className="text-xs sm:text-sm text-gray-500 mt-1">Discount: {(discount * 100).toFixed(0)}%</p>}
              </label>
            </div>
            {/* Delivery Type */}
            <div className="col-span-1 sm:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-black mb-2">Delivery Type</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDeliveryType('digital')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                    deliveryType === 'digital' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaEnvelope className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Digital (Email)
                </button>
                <button
                  onClick={() => setDeliveryType('physical')}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                    deliveryType === 'physical' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FaTruck className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Physical (Mail)
                </button>
              </div>
            </div>
            {/* Delivery Details */}
            {deliveryType === 'digital' ? (
              <div className="col-span-1 sm:col-span-2 space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                    Recipient Name
                    <input
                      type="text"
                      value={recipient.name}
                      onChange={(e) => handleRecipientChange('name', e.target.value)}
                      placeholder="Enter recipient's name (optional)"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    />
                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                  </label>
                  <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                    Recipient Email
                    <input
                      type="email"
                      value={recipient.email}
                      onChange={(e) => handleRecipientChange('email', e.target.value)}
                      placeholder="Enter recipient's email"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    />
                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                  </label>
                  <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                    Personalized Message
                    <textarea
                      value={recipient.message}
                      onChange={(e) => handleRecipientChange('message', e.target.value)}
                      placeholder="Add a personal message (optional)"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                      rows={4}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="col-span-1 sm:col-span-2 space-y-4">
                <label className="block text-xs sm:text-sm font-semibold text-black mb-2">
                  Delivery Address
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter delivery address"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 text-sm sm:text-base"
                    rows={5}
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </label>
              </div>
            )}
            {/* Total Price */}
            <div className="mt-6 sm:mt-8 col-span-1 sm:col-span-2">
              <p className="text-lg sm:text-xl font-semibold text-black">
                Total: <span className="text-black">$ {totalPrice.toLocaleString('en-US')}</span>
              </p>
              {discount > 0 && <p className="text-xs sm:text-sm text-gray-500 mt-1">Discount applied: {(discount * 100).toFixed(0)}%</p>}
            </div>
            {/* Add to Cart Button */}
            <div className="col-span-1 sm:col-span-2">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className={`flex items-center justify-center w-full px-6 sm:px-8 py-2 sm:py-3 bg-black text-white rounded-lg transition-all duration-300 shadow-md text-sm sm:text-base ${
                  isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800 hover:shadow-lg'
                }`}
              >
                {isAddingToCart ? (
                  <span className="animate-spin mr-2">⏳</span>
                ) : (
                  <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
                )}
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </section>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <section className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-12 sm:mb-16 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-6 animate-slide-in">
              Cart Summary
            </h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between text-xs sm:text-sm text-gray-700">
                  <span>
                    {item.quantity} x {item.name} ($ {item.price.toLocaleString('en-US')}) ({item.deliveryType})
                  </span>
                  <span>$ {(item.price * item.quantity).toLocaleString('en-US')}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-black text-sm sm:text-base">
                <span>Total</span>
                <span>$ {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('en-US')}</span>
              </div>
              <Link
                href="/cart"
                className="block mt-4 text-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md text-sm sm:text-base"
              >
                Proceed to Cart
              </Link>
            </div>
          </section>
        )}

        {/* Progress Bar */}
        <section className="mb-12 sm:mb-16">
          <div className="flex justify-between mb-3 text-xs sm:text-sm font-semibold text-gray-700">
            {progressSteps.map((step, index) => (
              <div key={index} className={index <= currentStep ? 'text-black' : 'text-gray-400'}>
                {step}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / progressSteps.length) * 100}%` }}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-6 sm:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs sm:text-sm">© {new Date().getFullYear()} SoleVibe. All Rights Reserved.</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <Link href="/about" className="hover:text-gray-300 transition-all duration-200">
                About
              </Link>
              <Link href="/contact" className="hover:text-gray-300 transition-all duration-200">
                Contact
              </Link>
              <Link href="/terms" className="hover:text-gray-300 transition-all duration-200">
                Terms
              </Link>
            </div>
          </div>
        </footer>

        {/* Toast Notification */}
        {showToast && (
          <div
            className={`fixed bottom-4 right-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-white animate-fade-in text-xs sm:text-sm max-w-[90%] sm:max-w-md`}
          >
            {showToast.message.replace(/[<>"'&]/g, '')}
          </div>
        )}

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeIn {
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
            animation: fadeIn 0.5s ease-out forwards;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slide-in {
            animation: slideIn 0.6s ease-out forwards;
          }
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }
          .animate-pulse {
            animation: pulse 0.4s ease-in-out infinite;
          }
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
            background-color: #d1d5db;
            border-radius: 9999px;
          }
          .scrollbar-track-gray-100::-webkit-scrollbar-track {
            background-color: #f3f4f6;
          }
        `}</style>
      </main>
    </div>
  );
}