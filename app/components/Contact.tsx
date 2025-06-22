'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  ShieldCheck,
  PackageCheck,
  Github,
  Linkedin,
} from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  email: z.string().email('Valid email is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  botcheck: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault(); // Prevent default form submission behavior

    try {
      console.log('Submitting data:', data); // Debug log
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '3d5062a7-28d3-4a1f-a2bd-ac96bdb06099', // Ensure this is correct
          ...data,
          botcheck: undefined, // Explicitly exclude botcheck to avoid issues
        }),
      });

      const result = await res.json(); // Parse response
      console.log('API response:', result); // Debug log

      if (res.ok && result.success) {
        toast.success('✅ Message sent successfully!');
        reset();
      } else {
        toast.error(`❌ Failed to send message: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Something went wrong! Please try again later.');
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 text-black px-6 py-16 md:px-24 transition-all duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-12 text-center tracking-tight uppercase animate-fade-in-down duration-1000">
          <span className="border-b-4 border-black pb-2 inline-block">Contact Us</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {[
            { icon: <Mail />, label: 'Email', value: 'FizaNaazz321@gmail.com' },
            { icon: <Phone />, label: 'Phone', value: '+92 3123632197' },
            { icon: <MapPin />, label: 'Address', value: 'DHA Phase 6, Karachi, Pakistan' },
            { icon: <Clock />, label: 'Working Hours', value: 'Mon - Sat | 10:00am - 8:00pm' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 border border-black rounded-2xl bg-white hover:bg-black hover:text-white shadow-lg text-center transition-all duration-500 hover:scale-105"
            >
              <div className="text-2xl mb-2 flex justify-center">{item.icon}</div>
              <h4 className="font-bold text-lg">{item.label}</h4>
              <p className="text-sm mt-1">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-white/90 backdrop-blur-xl border border-black p-10 rounded-3xl shadow-2xl animate-fade-in-up duration-700"
          >
            <input
              type="text"
              {...register('botcheck')}
              className="hidden"
              style={{ display: 'none' }}
              tabIndex={-1}
              aria-hidden="true"
            />

            <div>
              <label className="block font-semibold mb-2">Full Name</label>
              <input
                {...register('name')}
                className={clsx(
                  'w-full px-5 py-3 rounded-xl border border-black/50 focus:outline-none focus:ring-2 focus:ring-black transition duration-300',
                  errors.name && 'border-red-500'
                )}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-2">Email Address</label>
              <input
                {...register('email')}
                className={clsx(
                  'w-full px-5 py-3 rounded-xl border border-black/50 focus:outline-none focus:ring-2 focus:ring-black transition duration-300',
                  errors.email && 'border-red-500'
                )}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-semibold mb-2">Your Message</label>
              <textarea
                {...register('message')}
                rows={5}
                className={clsx(
                  'w-full px-5 py-3 rounded-xl border border-black/50 focus:outline-none focus:ring-2 focus:ring-black transition duration-300',
                  errors.message && 'border-red-500'
                )}
                placeholder="Write your message here..."
              />
              {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-white hover:text-black border-2 border-black transition-all duration-500"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>

          <div className="flex flex-col gap-8 justify-center">
            <div className="border border-black rounded-xl p-6 shadow-md bg-white/90">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <ShieldCheck className="text-green-600" /> 100% Secure Shopping
              </h3>
              <p className="text-sm text-gray-600">
                Your payment and personal details are protected with end-to-end encryption.
              </p>
            </div>
            <div className="border border-black rounded-xl p-6 shadow-md bg-white/90">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <PackageCheck className="text-blue-600" /> Fast Delivery Service
              </h3>
              <p className="text-sm text-gray-600">
                We offer express shipping across Pakistan for your ease and satisfaction.
              </p>
            </div>
            <div className="border border-black rounded-xl p-6 shadow-md bg-white/90">
              <h3 className="text-xl font-bold mb-2">Connect With Us</h3>
              <div className="flex gap-5 mt-3">
                <a href="https://www.instagram.com/zii_tech_63" target="_blank" rel="noopener noreferrer">
                  <Instagram className="hover:scale-125 hover:text-pink-600 transition duration-300" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="hover:scale-125 hover:text-blue-600 transition duration-300" />
                </a>
                <a href="https://x.com/FizaNazzx" target="_blank" rel="noopener noreferrer">
                  <Twitter className="hover:scale-125 hover:text-sky-500 transition duration-300" />
                </a>
                <a href="https://github.com/Fiza-Nazz" target="_blank" rel="noopener noreferrer">
                  <Github className="hover:scale-125 hover:text-gray-900 transition duration-300" />
                </a>
                <a href="https://www.linkedin.com/in/fiza-nazz-765241355/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="hover:scale-125 hover:text-blue-700 transition duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

// Custom CSS
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
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in-down {
    animation: fadeInDown 1s ease-in-out;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.7s ease-in-out;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin {
    animation: spin 1s linear infinite;
  }
`}</style>

