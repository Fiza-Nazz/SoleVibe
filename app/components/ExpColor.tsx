"use client";
import { useState, useEffect } from "react";

interface Product {
  id: string | number;
  name: string;
  image: string;
  price: number;
  color?: string;
}

interface ExpColorProps {
  products: Product[];
  onFilterChange: (color: string | null) => void;
}

export default function ExpColor({ products, onFilterChange }: ExpColorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const colors = [
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Yellow", value: "#eab308" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Gray", value: "#6b7280" },
    { name: "Pink", value: "#ec4899" },
  ];

  const handleColorSelect = (color: string) => {
    const newColor = selectedColor === color ? null : color;
    setSelectedColor(newColor);
    onFilterChange(newColor);
  };

  useEffect(() => {
    onFilterChange(selectedColor);
  }, [selectedColor]);

  return (
    <div className="w-full bg-white text-black p-6 rounded-2xl shadow-xl transition-all duration-500 border border-zinc-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-wide uppercase">Explore by Colors</h2>
        <button className="text-sm text-zinc-500 hover:text-black duration-200 underline">Expand</button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => handleColorSelect(color.value)}
            className={`h-10 w-full rounded-xl font-medium text-xs shadow-lg transition-all duration-300 transform hover:scale-105 border-2 ${
              selectedColor === color.value
                ? "border-black bg-black text-white"
                : "border-zinc-300 bg-white text-black hover:border-black"
            }`}
            style={{
              backgroundColor: selectedColor === color.value ? color.value : "white",
              color: selectedColor === color.value ? "white" : "black",
            }}
          >
            {color.name}
          </button>
        ))}
      </div>

      {selectedColor && (
        <div className="mt-6 p-4 bg-zinc-100 rounded-xl border border-zinc-300 animate-fadeIn">
          <p className="text-base font-medium">
            Showing products for color:{" "}
            <span className="font-bold">{selectedColor}</span>
          </p>
          <button
            onClick={() => handleColorSelect(selectedColor)}
            className="mt-3 px-4 py-2 bg-white border border-black text-black rounded-md hover:bg-black hover:text-white transition-all duration-300"
          >
            Clear Filter
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
