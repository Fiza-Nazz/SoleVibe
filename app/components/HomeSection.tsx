import Image from 'next/image';
import Link from 'next/link';

const HomeSection = () => {
  return (
    <section className="bg-gradient-to-b from-white via-gray-50 to-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">

        {/* Left Section – Highlight Banner */}
        <div className="relative rounded-3xl shadow-2xl overflow-hidden group transform transition duration-500 hover:scale-102 sm:hover:scale-105">
          <Image
            src="https://res.cloudinary.com/dood2c2ca/image/upload/v1749545934/nike-she_ebitgt.webp"
            alt="Summer Outfit Inspiration"
            width={600}
            height={400}
            className="object-cover w-full h-full transform transition duration-700 group-hover:scale-110 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/20 p-6 sm:p-8 flex flex-col justify-end backdrop-blur-sm">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow-lg transition-opacity duration-700 opacity-0 group-hover:opacity-100">
              Color of Summer
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white mb-4 sm:mb-5 transition-transform duration-700 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
              100+ Outfits to inspire this summer
            </p>
            <Link
              href="/collections"
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-white text-black text-base sm:text-lg font-bold rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-100 opacity-0 group-hover:opacity-100 delay-150"
            >
              View Collections
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Outdoor Active */}
          <div className="relative rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition duration-500 transform hover:scale-102 sm:hover:scale-105">
            <Image
              src="https://res.cloudinary.com/dood2c2ca/image/upload/v1749563499/new-shoe_gpbxqr.jpg"
              alt="Outdoor Active"
              width={300}
              height={200}
              className="object-cover w-full h-full transform transition duration-700 group-hover:scale-110 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-5">
              <h3 className="text-white text-xl sm:text-2xl font-bold transform transition duration-500 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                Outdoor Active
              </h3>
            </div>
          </div>

          {/* Casual Comfort */}
          <div className="relative rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition duration-500 transform hover:scale-102 sm:hover:scale-105">
            <Image
              src="https://res.cloudinary.com/dood2c2ca/image/upload/v1749563483/buy-shoe_hgmt4y.jpg"
              alt="Casual Comfort"
              width={300}
              height={200}
              className="object-cover w-full h-full transform transition duration-700 group-hover:scale-110 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-5">
              <h3 className="text-white text-xl sm:text-2xl font-bold transform transition duration-500 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                Casual Comfort
              </h3>
            </div>
          </div>

          {/* Casual Inspirations */}
          <div className="relative col-span-1 sm:col-span-2 rounded-3xl shadow-2xl overflow-hidden group hover:shadow-3xl transition duration-500 transform hover:scale-102 sm:hover:scale-105">
            <Image
              src="https://res.cloudinary.com/dood2c2ca/image/upload/v1749545994/addidas-shoe_pvxfgx.jpg"
              alt="Casual Inspirations"
              width={600}
              height={400}
              className="object-cover w-full h-full transform transition duration-700 group-hover:scale-110 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center backdrop-blur-sm">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white transform transition duration-700 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                  Casual Inspirations
                </h2>
                <p className="text-base sm:text-lg text-white transform transition duration-700 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 delay-150">
                  Say it with Shirt
                </p>
              </div>
              <Link
                href="/inspirations"
                className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-white text-black text-base sm:text-lg font-semibold rounded-full shadow-lg transform transition duration-300 hover:scale-105 hover:bg-gray-100 opacity-0 group-hover:opacity-100 delay-300"
              >
                Browse Inspirations
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 sm:mt-16 lg:mt-20 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 transform transition duration-700 translate-y-4 opacity-0 group-hover:opacity-100">
          Explore More Styles
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 transform transition duration-700 translate-y-4 opacity-0 group-hover:opacity-100 delay-150">
          Find the perfect outfit for any mood, event, or adventure.
        </p>
        <Link
          href="/"
          className="inline-block px-8 sm:px-10 py-3 sm:py-4 bg-black text-white text-base sm:text-lg font-bold rounded-full shadow-xl transform transition duration-300 hover:scale-105 hover:bg-gray-800"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default HomeSection;