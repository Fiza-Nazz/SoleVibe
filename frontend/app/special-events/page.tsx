"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaCalendarAlt, FaShareAlt, FaHeart, FaCheckCircle, FaFilter, FaSearch, FaMapMarkerAlt, FaStar, FaTimes, FaQrcode } from "react-icons/fa";

const events = [
  {
    id: 1,
    title: "Black Friday Sneaker Drop",
    type: "Sale",
    status: "Upcoming",
    date: "2025-11-28T00:00:00Z",
    description: "Exclusive discounts on our hottest sneakers. Don’t miss out!",
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp",
    promoCode: "BLACKVIBE25",
    gallery: [
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587954/image_4_bysmzs.jpg",
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg",
    ],
    video: "https://res.cloudinary.com/dood2c2ca/video/upload/v1749599999/blackfriday_teaser.mp4",
    popularity: 95,
    category: "Men",
    isExclusive: true,
    attendees: 1200,
    location: "SOLEVIBE NYC Store",
    tags: ["Trending", "Limited Stock"],
    products: [
      { id: 101, name: "Vibe X1", price: 120, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp" },
    ],
  },
  {
    id: 2,
    title: "SOLEVIBE x Designer Collab",
    type: "Collaboration",
    status: "Ongoing",
    date: "2025-06-10T00:00:00Z",
    description: "Limited-edition sneakers with top designers. Shop now!",
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg",
    promoCode: "DESIGNVIBE10",
    gallery: [
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg",
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp",
    ],
    video: "https://res.cloudinary.com/dood2c2ca/video/upload/v1749599999/collab_teaser.mp4",
    popularity: 85,
    category: "Women",
    isExclusive: false,
    attendees: 800,
    location: "Online Only",
    tags: ["Designer", "Limited Edition"],
    products: [
      { id: 102, name: "Collab Pro", price: 150, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg" },
    ],
  },
  {
    id: 3,
    title: "Summer Vibe Launch",
    type: "Launch",
    status: "Past",
    date: "2025-05-01T00:00:00Z",
    description: "Our summer collection brought the heat. Check out the highlights!",
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg",
    promoCode: null,
    gallery: [
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587954/image_4_bysmzs.jpg",
      "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593839/light_b2lw5b.jpg",
    ],
    video: "https://res.cloudinary.com/dood2c2ca/video/upload/v1749599999/summer_teaser.mp4",
    popularity: 70,
    category: "Kids",
    isExclusive: false,
    attendees: 500,
    location: "SOLEVIBE LA Store",
    tags: ["Summer", "Family-Friendly"],
    products: [
      { id: 103, name: "Summer Kidz", productId: 103, price: 80, image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593839/light_b2lw5b.jpg" },
    ],
  },
];

export default function SpecialEventsPage() {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState<string>("All");
  const [eventStatus, setEventStatus] = useState<string>("All");
  const [eventCategory, setEventCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("date");
  const [savedEvents, setSavedEvents] = useState<number[]>([]);
  const [rsvpData, setRsvpData] = useState<{ [key: number]: { email: string; notified: boolean } }>({});
  const [waitlistData, setWaitlistData] = useState<{ [key: number]: string }>({});
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [showToast, setShowToast] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);
  const [galleryModal, setGalleryModal] = useState<{ eventId: number; images: string[]; video?: string } | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ eventId: number } | null>(null);
  const [shareModal, setShareModal] = useState<{ eventId: number; title: string } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const toastIdRef = useRef(0);

  const getCountdown = (date: string) => {
    const eventDate = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = eventDate - now;
    if (diff < 0) return { text: "Event Started!", progress: 100 };
    const totalDuration = eventDate - new Date("2025-06-14T00:00:00Z").getTime();
    const progress = ((totalDuration - diff) / totalDuration) * 100;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    if (diff < 3600 * 1000 && !rsvpData[events.find((e) => e.date === date)?.id || 0]?.notified) {
      triggerNotification(`Event ${events.find((e) => e.date === date)?.title} starts in 1 hour!`);
    }
    return { text: `${days}d ${hours}h ${minutes}m ${seconds}s`, progress: Math.min(progress, 100) };
  };

  useEffect(() => {
    const timer = setInterval(() => setFilteredEvents([...filteredEvents]), 1000);
    return () => clearInterval(timer);
  }, [filteredEvents, rsvpData]);

  useEffect(() => {
    let result = [...events];
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (eventType !== "All") result = result.filter((event) => event.type === eventType);
    if (eventStatus !== "All") result = result.filter((event) => event.status === eventStatus);
    if (eventCategory !== "All") result = result.filter((event) => event.category === eventCategory);
    if (sortBy === "popularity") {
      result.sort((a, b) => b.popularity - a.popularity);
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    setFilteredEvents(result);
  }, [searchTerm, eventType, eventStatus, eventCategory, sortBy]);

  useEffect(() => {
    const saved = localStorage.getItem("savedEvents");
    if (saved) setSavedEvents(JSON.parse(saved));
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode) setIsDarkMode(JSON.parse(darkMode));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
          }
        });
      },
      { threshold: 0.1 }
    );
    eventRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [filteredEvents]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          mapRef.current?.classList.add("animate-zoom-in");
        }
      },
      { threshold: 0.1 }
    );
    if (mapRef.current) observer.observe(mapRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shareModal && qrCanvasRef.current) {
      const ctx = qrCanvasRef.current.getContext("2d")!;
      const url = `https://solevibe.com/special-events/${shareModal.eventId}`;
      const size = 128;
      const pixelSize = 4;
      const pixels = Math.floor(size / pixelSize);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#000000";
      for (let i = 0; i < pixels * pixels; i++) {
        if (Math.random() > 0.7) {
          ctx.fillRect((i % pixels) * pixelSize, Math.floor(i / pixels) * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }, [shareModal]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveEvent = (eventId: number) => {
    const newSaved = savedEvents.includes(eventId)
      ? savedEvents.filter((id) => id !== eventId)
      : [...savedEvents, eventId];
    setSavedEvents(newSaved);
    localStorage.setItem("savedEvents", JSON.stringify(newSaved));
    addToast({
      message: savedEvents.includes(eventId) ? "Removed from saved events!" : "Saved to events!",
      type: "success",
    });
    triggerConfetti("heart");
    console.log("Analytics: Event saved", { eventId });
  };

  const handleRsvp = async (eventId: number, email: string) => {
    if (!email.includes("@") || !email.includes(".")) {
      addToast({ message: "Please enter a valid email.", type: "error" });
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRsvpData({ ...rsvpData, [eventId]: { email, notified: false } });
      addToast({ message: "RSVP successful! Promo code unlocked!", type: "success" });
      triggerConfetti("star");
      console.log("Analytics: RSVP submitted", { eventId, email });
    } catch {
      addToast({ message: "Failed to RSVP. Retrying...", type: "error" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRsvpData({ ...rsvpData, [eventId]: { email, notified: false } });
      addToast({ message: "RSVP successful! Promo code unlocked!", type: "success" });
      triggerConfetti("star");
    }
  };

  const handleWaitlist = (eventId: number, email: string) => {
    if (!email.includes("@") || !email.includes(".")) {
      addToast({ message: "Please enter a valid email.", type: "error" });
      return;
    }
    setWaitlistData({ ...waitlistData, [eventId]: email });
    addToast({ message: "Joined waitlist successfully!", type: "success" });
    triggerConfetti("circle");
    console.log("Analytics: Waitlist joined", { eventId, email });
  };

  const handleFeedback = (eventId: number, feedback: string, rating: number) => {
    if (feedback.length < 10) {
      addToast({ message: "Feedback must be at least 10 characters.", type: "error" });
      return;
    }
    if (rating < 1 || rating > 5) {
      addToast({ message: "Please select a rating.", type: "error" });
      return;
    }
    setRatings({ ...ratings, [eventId]: rating });
    addToast({ message: "Feedback submitted! Thank you!", type: "success" });
    console.log("Analytics: Feedback submitted", { eventId, feedback, rating });
    setFeedbackModal(null);
  };

  const handleShare = (event: { id: number; title: string }) => {
    setShareModal({ eventId: event.id, title: event.title });
  };

  const triggerNotification = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") new Notification(message);
      });
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(!isDarkMode));
  };

  const addToast = (toast: { message: string; type: "success" | "error" }) => {
    const id = toastIdRef.current++;
    setShowToast((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => setShowToast((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const triggerConfetti = (type: "star" | "heart" | "circle") => {
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; type: string }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 5 + 2,
        color: ["#000000", "#FFFFFF", "#CCCCCC"][Math.floor(Math.random() * 3)],
        type,
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
        if (p.type === "star") {
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(
              p.x + p.size * Math.cos((18 + i * 72) * Math.PI / 180),
              p.y - p.size * Math.sin((18 + i * 72) * Math.PI / 180)
            );
            ctx.lineTo(
              p.x + p.size / 2 * Math.cos((54 + i * 72) * Math.PI / 180),
              p.y - p.size / 2 * Math.sin((54 + i * 72) * Math.PI / 180)
            );
          }
        } else if (p.type === "heart") {
          ctx.moveTo(p.x, p.y + p.size / 4);
          ctx.bezierCurveTo(
            p.x + p.size / 2,
            p.y - p.size / 2,
            p.x + p.size,
            p.y + p.size / 4,
            p.x,
            p.y + p.size
          );
          ctx.bezierCurveTo(
            p.x - p.size,
            p.y + p.size / 4,
            p.x - p.size / 2,
            p.y - p.size / 2,
            p.x,
            p.y + p.size / 4
          );
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
      });
      if (particles.some((p) => p.y < canvas.height)) requestAnimationFrame(animate);
      else document.body.removeChild(canvas);
    };
    animate();
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollTimeline = (eventId: number) => {
    const timeline = document.querySelector(".timeline-container");
    const eventEl = document.querySelector(`[data-event-id="${eventId}"]`);
    if (timeline && eventEl) {
      timeline.scrollTo({
        left: eventEl.getBoundingClientRect().left - timeline.getBoundingClientRect().left + timeline.scrollLeft - 100,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => scrollCarousel("right"), 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const offset = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${offset * 0.5}px`;
      }
      if (carouselRef.current) {
        const offset = window.scrollY;
        carouselRef.current.style.backgroundPositionY = `${offset * 0.3}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);

    const canvas = document.createElement("canvas");
    canvas.className = "particle-canvas";
    heroRef.current?.appendChild(canvas);
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight < 600 ? window.innerHeight : 600;
    const particles: { x: number; y: number; vx: number; vy: number; size: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    };
    animateParticles();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      canvas.remove();
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dood2c2ca/image/upload/v1749599999/noise.png')] opacity-5 pointer-events-none"></div>

      <header ref={heroRef} className="relative bg-gradient-to-r from-gray-900 to-black text-white py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden">
        <div ref={carouselRef} className="relative flex overflow-x-hidden snap-x snap-mandatory">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="min-w-full h-[40vh] sm:h-[50vh] md:h-[60vh] flex-shrink-0 relative snap-start"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
                loading="lazy"
              />
              <div className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold animate-reveal text-center drop-shadow-2xl">
                  {event.title}
                </h1>
                <p className="mt-2 sm:mt-4 text-base sm:text-lg md:text-xl animate-reveal text-center max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl" style={{ animationDelay: "200ms" }}>
                  {event.description}
                </p>
                <Link
                  href="#events"
                  className="mt-4 sm:mt-6 px-6 sm:px-8 py-2 sm:py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 animate-pulse-once ripple text-sm sm:text-base"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 animate-reveal">Event Timeline</h2>
          <div className="relative flex overflow-x-auto gap-2 sm:gap-4 pb-4 hide-scrollbar timeline-container snap-x snap-mandatory">
            {events.map((event, index) => (
              <div
                key={event.id}
                data-event-id={event.id}
                className="flex-shrink-0 w-48 sm:w-56 md:w-64 bg-white rounded-xl border border-gray-200 shadow-lg p-3 sm:p-4 relative cursor-pointer hover:bg-gray-50 transition-all duration-300 snap-start"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => scrollTimeline(event.id)}
                role="button"
                tabIndex={0}
                aria-label={`View ${event.title} timeline`}
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-black rounded-full"></div>
                <h3 className="text-xs sm:text-sm font-semibold line-clamp-1">{event.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-[10px] sm:text-xs text-gray-600">{event.status}</p>
              </div>
            ))}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
              <div className="h-full bg-black" style={{ width: `${(events.filter((e) => e.status !== "Upcoming").length / events.length) * 100}%` }}></div>
            </div>
          </div>
        </section>

        <section className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 mb-8 sm:mb-12 border border-gray-200 sticky top-4 z-20">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="sm:hidden flex items-center mb-4 text-sm"
            aria-label={isFilterOpen ? "Hide filters" : "Show filters"}
          >
            <FaFilter className="w-4 h-4 mr-2" />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          <div className={`flex flex-col gap-4 ${isFilterOpen ? "block" : "hidden sm:flex sm:flex-row sm:items-center sm:gap-4"}`}>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search events..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black pr-10 shadow-sm text-sm sm:text-base"
                aria-label="Search events"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm sm:text-base"
                aria-label="Filter by event type"
              >
                <option value="All">All Types</option>
                <option value="Sale">Sale</option>
                <option value="Launch">Launch</option>
                <option value="Collaboration">Collaboration</option>
              </select>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm sm:text-base"
                aria-label="Filter by event status"
              >
                <option value="All">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Past">Past</option>
              </select>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm sm:text-base"
                aria-label="Filter by event category"
              >
                <option value="All">All Categories</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black shadow-sm text-sm sm:text-base"
                aria-label="Sort events"
              >
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={() => {
                setEventStatus("Ongoing");
                setEventType("All");
                setEventCategory("All");
                setSortBy("date");
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
            >
              Today’s Events
            </button>
            <button
              onClick={() => {
                setSortBy("popularity");
                setEventType("All");
                setEventStatus("All");
                setEventCategory("All");
              }}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
            >
              Most Popular
            </button>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-sm sm:text-base"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </section>

        <section id="events" className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 animate-reveal">Upcoming & Ongoing Events</h2>
          {filteredEvents.length === 0 ? (
            <p className="text-gray-600 text-center text-sm sm:text-base">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredEvents.map((event, index) => {
                const countdown = getCountdown(event.date);
                return (
                  <div
                    key={event.id}
                    ref={(el) => { eventRefs.current[index] = el; }}
                    className="relative bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 event-card group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {event.status === "Ongoing" && (
                      <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black text-white text-xs px-2 py-1 rounded-full animate-pulse">
                        LIVE
                      </span>
                    )}
                    {event.isExclusive && (
                      <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                        Exclusive
                      </span>
                    )}
                    <div className="w-full h-40 sm:h-48 overflow-hidden rounded-t-xl relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 border-2 border-transparent group-hover:border-black/50 transition-all duration-500 ease-in-out flex items-center justify-center opacity-0 group-hover:opacity-100 neon-glow">
                        <div className="flex gap-2">
                          {!rsvpData[event.id] && event.status !== "Past" && (
                            <button
                              onClick={() => handleRsvp(event.id, prompt("Enter email to RSVP") || "")}
                              className="px-3 py-1 bg-black/80 text-white rounded-lg hover:bg-gray-900 hover:shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-all duration-300 text-xs sm:text-sm"
                            >
                              RSVP
                            </button>
                          )}
                          <button
                            onClick={() => handleSaveEvent(event.id)}
                            className="px-3 py-1 bg-black/80 text-white rounded-lg hover:bg-gray-900 hover:shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-all duration-300 text-xs sm:text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => handleShare(event)}
                            className="px-3 py-1 bg-black/80 text-white rounded-lg hover:bg-gray-900 hover:shadow-[0_0_8px_rgba(0,0,0,0.8)] transition-all duration-300 text-xs sm:text-sm"
                          >
                            Share
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {event.tags.map((tag) => (
                          <span key={tag} className="text-[10px] sm:text-xs bg-gray-200 text-black px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold line-clamp-1">{event.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{event.type} • {event.category} • {event.status}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">{event.description}</p>
                      {event.status === "Upcoming" && (
                        <div className="mt-2 relative w-14 sm:w-16 h-14 sm:h-16">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="50%"
                              cy="50%"
                              r="45%"
                              stroke="#E5E7EB"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              cx="50%"
                              cy="50%"
                              r="45%"
                              stroke="#000000"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray="188.5"
                              strokeDashoffset={188.5 - (countdown.progress / 100) * 188.5}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold">
                            {countdown.text.split(" ")[0]}
                          </span>
                        </div>
                      )}
                      <div className="mt-3 sm:mt-4 flex justify-between text-xs sm:text-sm text-gray-600">
                        <span>{event.attendees} Attendees</span>
                        <span>{event.location}</span>
                      </div>
                      <div className="mt-3 sm:mt-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleSaveEvent(event.id)}
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
                        >
                          <FaHeart className={`w-4 h-4 mr-2 ${savedEvents.includes(event.id) ? "text-black" : "text-gray-500"}`} />
                          {savedEvents.includes(event.id) ? "Saved" : "Save"}
                        </button>
                        <button
                          onClick={() => handleShare(event)}
                          className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
                        >
                          <FaShareAlt className="w-4 h-4 mr-2" />
                          Share
                        </button>
                      </div>
                      {event.status !== "Past" && !rsvpData[event.id] && (
                        <div className="mt-2 sm:mt-3">
                          <input
                            type="email"
                            placeholder="Enter email to RSVP"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-2 text-xs sm:text-sm"
                            aria-label="Enter email to RSVP"
                          />
                          <button
                            onClick={() =>
                              handleRsvp(event.id, (document.querySelector(`input[placeholder="Enter email to RSVP"]`) as HTMLInputElement).value)
                            }
                            className="w-full px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 ripple text-xs sm:text-sm"
                          >
                            RSVP / Notify Me
                          </button>
                        </div>
                      )}
                      {event.status !== "Past" && !waitlistData[event.id] && event.attendees > 1000 && (
                        <div className="mt-2 sm:mt-3">
                          <input
                            type="email"
                            placeholder="Enter email for waitlist"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-2 text-xs sm:text-sm"
                            aria-label="Enter email for waitlist"
                          />
                          <button
                            onClick={() =>
                              handleWaitlist(event.id, (document.querySelector(`input[placeholder="Enter email for waitlist"]`) as HTMLInputElement).value)
                            }
                            className="w-full px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 ripple text-xs sm:text-sm"
                          >
                            Join Waitlist
                          </button>
                        </div>
                      )}
                      {event.promoCode && rsvpData[event.id] && (
                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-bold">Promo Code: {event.promoCode}</p>
                      )}
                      {event.status === "Past" && (
                        <button
                          onClick={() => setFeedbackModal({ eventId: event.id })}
                          className="w-full mt-2 sm:mt-3 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 text-xs sm:text-sm"
                        >
                          Submit Feedback
                        </button>
                      )}
                      <button
                        onClick={() => setGalleryModal({ eventId: event.id, images: event.gallery, video: event.video })}
                        className="w-full mt-2 sm:mt-3 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-300 text-xs sm:text-sm"
                      >
                        View Gallery
                      </button>
                      {event.products.length > 0 && (
                        <div className="mt-3 sm:mt-4">
                          <h4 className="text-sm sm:text-base font-semibold">Featured Products</h4>
                          <div className="flex gap-2 mt-2 overflow-x-auto">
                            {event.products.map((product) => (
                              <Link
                                href={{
                                  pathname: "/addcart",
                                  query: { id: "productId" in product ? (product as any).productId : product.id },
                                }}
                                key={product.id}
                                className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg overflow-hidden flex-shrink-0"
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {event.status === "Ongoing" && (
                        <button
                          className="w-full mt-2 sm:mt-3 px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm"
                          disabled
                        >
                          Watch Live Stream (Coming Soon)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section ref={mapRef} className="mb-12 sm:mb-16 bg-white rounded-2xl shadow-xl p-4 sm:p-6 sm:p-8 opacity-0 translate-y-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 animate-reveal">Event Locations</h2>
          <div className="h-48 sm:h-64 rounded-lg overflow-hidden border-2 border-black">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.241264559167!2d-73.98784368459375!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1635781234567"
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
              title="SOLEVIBE Event Locations"
            ></iframe>
          </div>
        </section>

        <section className="mb-12 sm:mb-16 bg-gray-100 rounded-2xl p-4 sm:p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 animate-reveal">Social Buzz</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-xs sm:text-sm text-gray-600">@{event.title.replace(/\s/g, "")}</p>
                <p className="text-xs sm:text-sm">Loving the vibe at #{event.title.replace(/\s/g, "")}! 🔥 #SOLEVIBE</p>
                <img
                  src={event.image}
                  alt="Social post"
                  className="w-full h-24 sm:h-32 object-cover rounded-lg mt-2"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {galleryModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-slide-in p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-full sm:max-w-2xl md:max-w-3xl w-full relative">
              <button
                onClick={() => setGalleryModal(null)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 hover:text-gray-600"
                aria-label="Close gallery"
              >
                <FaTimes className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                {events.find((e) => e.id === galleryModal.eventId)?.title} Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryModal.video && (
                  <video autoPlay loop muted className="w-full h-32 sm:h-40 object-cover rounded-lg">
                    <source src={galleryModal.video} type="video/mp4" />
                  </video>
                )}
                {galleryModal.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Gallery Image"
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {feedbackModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-slide-in p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-full sm:max-w-md w-full relative">
              <button
                onClick={() => setFeedbackModal(null)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 hover:text-gray-600"
                aria-label="Close feedback"
              >
                <FaTimes className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Event Feedback</h3>
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-5 sm:w-6 h-5 sm:h-6 cursor-pointer ${ratings[feedbackModal.eventId] >= star ? "text-black" : "text-gray-300"}`}
                    onClick={() => setRatings({ ...ratings, [feedbackModal.eventId]: star })}
                  />
                ))}
              </div>
              <textarea
                placeholder="Share your thoughts..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4 text-sm sm:text-base"
                rows={5}
                aria-label="Enter feedback"
              />
              <button
                onClick={() =>
                  handleFeedback(
                    feedbackModal.eventId,
                    (document.querySelector("textarea") as HTMLTextAreaElement).value,
                    ratings[feedbackModal.eventId] || 0
                  )
                }
                className="w-full px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 ripple text-sm sm:text-base"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        )}

        {shareModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-slide-in p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-full sm:max-w-md w-full relative">
              <button
                onClick={() => setShareModal(null)}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 hover:text-gray-600"
                aria-label="Close share"
              >
                <FaTimes className="w-5 sm:w-6 h-5 sm:h-6" />
              </button>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Share {shareModal.title}</h3>
              <canvas ref={qrCanvasRef} className="w-24 sm:w-32 h-24 sm:h-32 mx-auto mb-4"></canvas>
              <p className="text-xs sm:text-sm text-center text-gray-600">Scan to share</p>
              <div className="flex gap-2 sm:gap-4 mt-4">
                <button
                  onClick={() => {
                    navigator.share({
                      title: `Check out ${shareModal.title} on SOLEVIBE!`,
                      url: `https://solevibe.com/special-events/${shareModal.eventId}`,
                    });
                    setShareModal(null);
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 text-xs sm:text-sm"
                >
                  Share via Device
                </button>
                <button
                  onClick={() => {
                    addToast({ message: "Shared to X! (Mock)", type: "success" });
                    setShareModal(null);
                  }}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all duration-300 text-xs sm:text-sm"
                >
                  Share to X
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="bg-gray-100 rounded-2xl p-4 sm:p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 animate-reveal">About Our Events</h2>
          <div className="space-y-4 sm:space-y-6 text-gray-600 text-sm sm:text-base">
            <p>
              SOLEVIBE’s special events bring the heat with exclusive sneaker drops, designer collaborations, and unbeatable sales. Stay in the loop for the latest vibes!
            </p>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">How to Participate</h3>
              <p>RSVP to secure your spot or get notified when events go live. Share events with friends and unlock exclusive promo codes.</p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">Terms & Conditions</h3>
              <ul className="list-disc pl-4 sm:pl-6 space-y-2">
                <li>Promo codes are valid for one-time use during the event period.</li>
                <li>Event details are subject to change; check back for updates.</li>
                <li>Contact support@solevibe.com for assistance.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Link
        href="#events"
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center z-30 animate-pulse-once ripple text-sm sm:text-base"
        aria-label="Explore events"
      >
        <FaCalendarAlt className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
        Explore Events
      </Link>

      

      {showToast.map((toast) => (
        <div
          key={toast.id}
          className={`fixed bottom-4 right-4 px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg text-white animate-reveal
            ${toast.type === "success" ? "bg-black" : "bg-gray-800"} text-xs sm:text-sm`}
          style={{ bottom: `${4 + showToast.indexOf(toast) * 4}rem` }}
        >
          {toast.message}
        </div>
      ))}

      <style jsx>{`
        :root {
          --bg-color: ${isDarkMode ? "#111827" : "#F9FAFB"};
          --text-color: ${isDarkMode ? "#FFFFFF" : "#000000"};
          --card-bg: ${isDarkMode ? "#1F2937" : "#FFFFFF"};
          --border-color: ${isDarkMode ? "#374151" : "#E5E7EB"};
        }
        .min-h-screen {
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        .event-card {
          background-color: var(--card-bg);
          border-color: var(--border-color);
        }
        .event-card:hover {
          transform: perspective(1000px) rotateX(2deg) rotateY(5deg) translateY(-8px);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal {
          animation: reveal 0.6s ease-out forwards;
        }
        @keyframes pulseOnce {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-pulse-once {
          animation: pulseOnce 0.3s ease-in-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-zoom-in {
          animation: zoomIn 0.6s ease-out forwards;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .snap-x {
          scroll-snap-type: x mandatory;
        }
        .snap-start {
          scroll-snap-align: start;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .ripple {
          position: relative;
          overflow: hidden;
        }
        .ripple::after {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          top: 50%;
          left: 50%;
          transform-origin: center;
          animation: rippleEffect 0.6s ease-out;
          pointer-events: none;
        }
        @keyframes rippleEffect {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          opacity: 0.2;
        }
        .neon-glow {
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}