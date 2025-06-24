"use client";

import { useState } from "react";
// Update the import path below if ProductCard is located elsewhere
import ProductCard from "../components/ProductCard";

// Shoe data (your provided JSON data)
const products = [
  {
    id: 1,
    name: "Puma RS-X",
    price: 90.00,
    description: "Bold retro-style sneakers for men",
    sizes: ["8", "9", "10", "11"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587212/puma_ehwqrh.jpg",
    category: "Men",
  },
  {
    id: 2,
    name: "Reebok Nano X",
    price: 130.00,
    description: "Durable training shoes for women",
    sizes: ["6", "7", "8", "9"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587441/reeebok_pmbmpc.webp",
    category: "Women",
  },
  {
    id: 3,
    name: "Converse Chuck Taylor",
    price: 70.00,
    description: "Classic high-top shoes for all ages",
    sizes: ["5", "6", "7", "8"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587574/image_5_osjh6u.webp",
    category: "Unisex",
  },
  {
    id: 4,
    name: "New Balance Fresh Foam",
    price: 110.00,
    description: "Lightweight running shoes for men",
    sizes: ["9", "10", "11", "12"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587670/image_2_cwy5nt.avif",
    category: "Men",
  },
  {
    id: 5,
    name: "Under Armour HOVR",
    price: 140.00,
    description: "Advanced cushioning for boys",
    sizes: ["4", "5", "6"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587745/image_3_vpu9sz.webp",
    category: "Children",
  },
  {
    id: 6,
    name: "Vans Old Skool",
    price: 80.00,
    description: "Stylish skate shoes for girls",
    sizes: ["3", "4", "5"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749587954/image_4_bysmzs.jpg",
    category: "Children",
  },
  {
    id: 7,
    name: "Asics Gel-Kayano",
    price: 160.00,
    description: "Premium stability shoes for women",
    sizes: ["7", "8", "9"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588065/image_5_rmfe3h.webp",
    category: "Women",
  },
  {
    id: 8,
    name: "Skechers Arch Fit",
    price: 100.00,
    description: "Orthopedic support shoes for men",
    sizes: ["10", "11", "12"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588436/image_8_ixbbiw.jpg",
    category: "Men",
  },
  {
    id: 9,
    name: "Fila Disruptor II",
    price: 85.00,
    description: "Chunky platform shoes for women",
    sizes: ["6", "7", "8"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588507/image_9_tfwlpv.webp",
    category: "Women",
  },
  {
    id: 10,
    name: "Hoka One One Clifton",
    price: 135.00,
    description: "Max cushioning for men’s long runs",
    sizes: ["9", "10", "11"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588635/hoka_znlxmh.jpg",
    category: "Men",
  },
  {
    id: 11,
    name: "Timberland 6-Inch Boot",
    price: 180.00,
    description: "Rugged boots for boys",
    sizes: ["5", "6", "7"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588703/timer_ooiggd.avif",
    category: "Children",
  },
  {
    id: 12,
    name: "Crocs Classic Clog",
    price: 50.00,
    description: "Comfortable clogs for children",
    sizes: ["C4", "C5", "C6"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588801/child_tcmwzy.jpg",
    category: "Children",
  },
  {
    id: 13,
    name: "Salomon X Ultra",
    price: 145.00,
    description: "Hiking shoes for men",
    sizes: ["10", "11", "12"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749588942/child_2_du76vh.jpg",
    category: "Men",
  },
  {
    id: 14,
    name: "Merrell Moab 2",
    price: 120.00,
    description: "Waterproof hiking shoes for women",
    sizes: ["7", "8", "9"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749589091/girl_shoe_rmriyr.jpg",
    category: "Women",
  },
  {
    id: 15,
    name: "DC Shoes Trase",
    price: 75.00,
    description: "Skate shoes for boys",
    sizes: ["4", "5", "6"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749589156/boy_foi297.webp",
    category: "Children",
  },
  {
    id: 16,
    name: "Keds Champion",
    price: 65.00,
    description: "Timeless canvas shoes for girls",
    sizes: ["3", "4", "5"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749591723/new_shoe_cp7ufp.avif",
    category: "Children",
  },
  {
    id: 17,
    name: "Brooks Ghost",
    price: 140.00,
    description: "Smooth ride running shoes for men",
    sizes: ["9", "10", "11"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749591783/men_shoe_iiwhn8.webp",
    category: "Men",
  },
  {
    id: 18,
    name: "Ecco Soft 7",
    price: 150.00,
    description: "Elegant leather shoes for women",
    sizes: ["6", "7", "8"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749596263/coco_syehib.jpg",
    category: "Women",
  },
  {
    id: 19,
    name: "Columbia Newton Ridge",
    price: 110.00,
    description: "All-weather hiking boots for men",
    sizes: ["10", "11", "12"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749591934/women_mrgq8z.webp",
    category: "Men",
  },
  {
    id: 20,
    name: "Clarks Desert Boot",
    price: 130.00,
    description: "Classic suede boots for women",
    sizes: ["7", "8", "9"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592024/womennnn_sw933m.jpg",
    category: "Women",
  },
  {
    id: 21,
    name: "OshKosh B’gosh Sneaker",
    price: 45.00,
    description: "Casual shoes for children",
    sizes: ["C5", "C6", "C7"],
image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592131/baby_mk3c0h.webp",
category: "Children",
  },
  {
    id: 22,
    name: "Saucony Guide",
    price: 125.00,
    description: "Supportive running shoes for men",
    sizes: ["9", "10", "11"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592198/red_vsnqra.jpg",
    category: "Men",
  },
  {
    id: 23,
    name: "Altra Paradigm",
    price: 155.00,
    description: "Zero-drop shoes for women",
    sizes: ["6", "7", "8"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592416/rows_ezfwck.webp",
    category: "Women",
  },
  {
    id: 24,
    name: "New Balance 574",
    price: 95.00,
    description: "Retro lifestyle shoes for boys",
    sizes: ["4", "5", "6"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592776/blue_ghfyeg.webp",
    category: "Children",
  },
  {
    id: 25,
    name: "TOMS Alpargata",
    price: 60.00,
    description: "Comfortable slip-ons for girls",
    sizes: ["3", "4", "5"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749592860/yellow_a3pbad.jpg",
    category: "Children",
  },
  {
    id: 26,
    name: "Mizuno Wave Prophecy",
    price: 170.00,
    description: "High-end running shoes for men",
    sizes: ["10", "11", "12"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593018/white_hkfdiu.webp",
    category: "Men",
  },
  {
    id: 27,
    name: "Dr. Martens 1460",
    price: 140.00,
    description: "Iconic leather boots for women",
    sizes: ["6", "7", "8"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749595484/dr_bmupyb.webp",
    category: "Women",
  },
  {
    id: 28,
    name: "Stride Rite Soft Motion",
    price: 55.00,
    description: "Supportive shoes for children",
    sizes: ["C4", "C5", "C6"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593156/bbays_shoes_lebmp2.webp",
    category: "Children",
  },
  {
    id: 29,
    name: "Nike Air Force 1",
    price: 110.00,
    description: "Stylish low-top sneakers for men",
    sizes: ["8", "9", "10"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593330/kala_yuzdlb.jpg",
    category: "Men",
  },
  {
    id: 30,
    name: "Adidas Stan Smith",
    price: 90.00,
    description: "Classic tennis shoes for women",
    sizes: ["6", "7", "8"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593353/giles_shoes_mbklaq.jpg",
    category: "Women",
  },
  {
    id: 31,
    name: "Puma Suede",
    price: 75.00,
    description: "Vintage-inspired shoes for boys",
    sizes: ["4", "5", "6"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593453/red_wi_hiet_gqlijr.webp",
    category: "Children",
  },
  {
    id: 32,
    name: "Reebok Classic",
    price: 80.00,
    description: "Retro sneakers for girls",
    sizes: ["3", "4", "5"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593518/shoe_ogic5e.webp",
    category: "Children",
  },
  {
    id: 33,
    name: "Under Armour Curry",
    price: 120.00,
    description: "Basketball shoes for boys",
    sizes: ["5", "6", "7"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593670/new_vrsl9h.jpg",
    category: "Children",
  },
  {
    id: 34,
    name: "Vans Slip-On",
    price: 70.00,
    description: "Easy-on shoes for girls",
    sizes: ["3", "4", "5"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593787/pink_vf6zxc.webp",
    category: "Children",
  },
  {
    id: 35,
    name: "Asics Gel-Nimbus",
    price: 160.00,
    description: "Soft cushioning for women",
    sizes: ["7", "8", "9"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593839/light_b2lw5b.jpg",
    category: "Women",
  },
  {
    id: 36,
    name: "Skechers D’Lites",
    price: 90.00,
    description: "Lightweight shoes for children",
    sizes: ["C5", "C6", "C7"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749593936/children_nsnbi8.jpg",
    category: "Children",
  },
  {
    id: 37,
    name: "Hoka Carbon X",
    price: 180.00,
    description: "Carbon-plated racing shoes for men",
    sizes: ["9", "10", "11"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749595866/hokiiiii_jhgaes.webp",
    category: "Men",
  },
  {
    id: 38,
    name: "On Cloudflow",
    price: 165.00,
    description: "Lightweight running shoes with CloudTec technology",
    sizes: ["8", "9", "10", "11"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597235/note_w1qxbe.jpg",
    category: "Men",
  },
  {
    id: 39,
    name: "Salomon Speedcross",
    price: 130.00,
    description: "Aggressive trail running shoes for men",
    sizes: ["9", "10", "11", "12"],
    image: "https://res.cloudinary.com/dood2c2ca/image/upload/v1749597137/bro_zinpay.jpg",
    category: "Men",
  },
];

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("default");

  // Filter products by category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  // Sort products based on sortOption
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low-high") return a.price - b.price;
    if (sortOption === "price-high-low") return b.price - a.price;
    if (sortOption === "name-asc") return a.name.localeCompare(b.name);
    if (sortOption === "name-desc") return b.name.localeCompare(a.name);
    return 0; // Default: no sorting
  });

  // Unique categories for filter buttons
  const categories = ["All", "Men", "Women", "Children", "Unisex"];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shop Shoes</h1>
          <p className="mt-2 text-sm text-gray-600">
            Explore our wide range of stylish and comfortable shoes
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-300 hover:bg-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="default">Sort By</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-600 col-span-full text-center">
              No products found in this category.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}