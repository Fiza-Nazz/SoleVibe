'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ChevronUp,
  Github,
  Linkedin,
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

// Newsletter form schema
const newsletterSchema = z.object({
  email: z.string().email('Valid email is required'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Sample product data (subset from provided JSON)
const products = [
  {
    name: 'Puma RS-X',
    price: 90.00,
    description: 'Bold retro-style sneakers for men',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587212/puma_ehwqrh.jpg',
  },
  {
    name: 'Reebok Nano X',
    price: 130.00,
    description: 'Durable training shoes for women',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp',
  },
  {
    name: 'Converse Chuck Taylor',
    price: 70.00,
    description: 'Classic high-top shoes for all ages',
    image: 'https://res.cloudinary.com/dood2c2ca/image/upload/v1749587574/image_5_osjh6u.webp',
  },
];

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({ resolver: zodResolver(newsletterSchema) });

  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle newsletter submission
  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock API call
      toast.success('Subscribed successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to subscribe.');
    }
  };

  // Scroll event for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white px-6 md:px-24 py-16 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-6 animate-slide-in duration-700">
            <h2 className="text-3xl font-extrabold uppercase tracking-widest">
              Shoe<span className="text-gray-300">Mart</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover premium footwear for men, women, and kids. Style meets comfort at ShoeMart.
            </p>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 group-hover:text-white transition duration-300" />
                <a
                  href="mailto:support@shoemart.com"
                  className="hover:text-white transition duration-300"
                >
                  FizaNaazz321@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 group-hover:text-white transition duration-300" />
                <a href="tel:+921234567890" className="hover:text-white transition duration-300">
                  +92 3123632197
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <MapPin className="w-5 h-5 group-hover:text-white transition duration-300" />
                <span>DHA Phase 6, Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="animate-slide-in duration-700 delay-100">
            <h3 className="text-xl font-bold mb-4 tracking-tight">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition duration-300 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-slide-in duration-700 delay-200">
            <h3 className="text-xl font-bold mb-4 tracking-tight">Customer Service</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {[
                { href: '/returns', label: 'Return Policy' },
                { href: '/shipping', label: 'Shipping Info' },
                { href: '/faq', label: 'FAQs' },
                { href: '/privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition duration-300 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div className="animate-slide-in duration-700 delay-300">
            <h3 className="text-xl font-bold mb-4 tracking-tight">Join Our Newsletter</h3>
            <form
              onSubmit={handleSubmit(onNewsletterSubmit)}
              className="flex items-center border border-white/30 bg-white/10 backdrop-blur-md rounded-full overflow-hidden shadow-lg"
            >
              <input
                {...register('email')}
                type="email"
                placeholder="Your email"
                className={clsx(
                  'px-4 py-3 w-full bg-transparent text-white placeholder-gray-400 focus:outline-none',
                  errors.email && 'border-red-500'
                )}
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black px-4 py-3 hover:bg-gray-200 transition duration-300"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>
            )}

            <div className="mt-6">
              <h4 className="font-bold mb-3">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  {
                    href: 'https://www.instagram.com/zii_tech_63?igsh=eDg5ZnA4ZmUyb3B6',
                    icon: Instagram,
                    label: 'Instagram',
                    hoverColor: 'text-pink-600',
                  },
                  {
                    href: 'https://Facebook.com',
                    icon: Facebook,
                    label: 'Facebook',
                    hoverColor: 'text-blue-600',
                  },
                  {
                    href: 'https://x.com/FizaNazzx',
                    icon: Twitter,
                    label: 'Twitter',
                    hoverColor: 'text-sky-500',
                  },
                  {
                    href: 'https://github.com/Fiza-Nazz',
                    icon: Github,
                    label: 'GitHub',
                    hoverColor: 'text-gray-900',
                  },
                  {
                    href: 'https://www.linkedin.com/in/fiza-nazz-765241355/',
                    icon: Linkedin,
                    label: 'LinkedIn',
                    hoverColor: 'text-blue-700',
                  },
                ].map(({ href, icon: Icon, label, hoverColor }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                    aria-label={`Follow on ${label}`}
                  >
                    <Icon className="w-6 h-6 hover:text-gray-300 hover:scale-125 transition duration-300" />
                    <span
                      className={clsx(
                        'absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300',
                        `group-hover:${hoverColor}`
                      )}
                    >
                      {label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="border-t border-white/20 pt-12 pb-8">
          <h3 className="text-xl font-bold mb-6 text-center tracking-tight">
            Featured Products
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.name}
                href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group bg-white/10 backdrop-blur-md p-4 rounded-xl hover:bg-white/20 transition-all duration-500 animate-slide-in"
                aria-label={`View ${product.name}`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="text-lg font-semibold group-hover:text-white">
                  {product.name}
                </h4>
                <p className="text-sm text-gray-400">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {product.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} ShoeMart. All rights reserved.
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all duration-300 animate-pulse-grow"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </footer>
  );
};

export default Footer;