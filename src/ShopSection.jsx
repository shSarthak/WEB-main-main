import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import image1 from "./assets/image1.png"
import image2 from "./assets/image2.png"
const ShopSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/products");
        
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Loading/Error Component for product sections
  const ProductsLoadingState = () => (
    <div className="col-span-full flex items-center justify-center py-12">
      <div className="text-xl font-semibold text-gray-600">
        Loading products...
      </div>
    </div>
  );

  const ProductsErrorState = () => (
    <div className="col-span-full flex items-center justify-center py-12">
      <div className="text-center">
        <div className="text-xl font-semibold text-red-600 mb-2">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const EmptyProductsState = () => (
    <div className="col-span-full flex items-center justify-center py-12">
      <div className="text-center">
        <div className="text-xl font-semibold text-gray-600 mb-2">
          No products found in this category
        </div>
        <p className="text-gray-500">Try selecting a different category</p>
      </div>
    </div>
  );

  // Render product grid with appropriate state
  const renderProductGrid = (startIndex, endIndex) => {
    if (loading) {
      return <ProductsLoadingState />;
    }
    
    if (error) {
      return <ProductsErrorState />;
    }
    
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0 && startIndex === 0) {
      return <EmptyProductsState />;
    }
    
    return productsToShow.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  };

  return (
    <section className="w-full bg-gray-50 py-10 px-6 md:px-16">
      {/* HERO BANNER - Full width - ALWAYS SHOWN */}
      <div className="w-full mb-10 h-80 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="z-10 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <div>Power Your Workspace – Shop Smarter!</div>
          <div className="text-lg font-normal mt-3">Exclusive deals on tech & electronics</div>
        </div>
      </div>

      {/* CATEGORY FILTER - ALWAYS SHOWN */}
      <div className="flex justify-between items-center mb-8 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Shop by Category
        </h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        >
          <option value="All">All Categories</option>
          <option value="Software">Software</option>
          <option value="Pc parts">PC Parts</option>
          <option value="Printer & printer spare parts">
            Printers & Spares
          </option>
          <option value="Electricals & Electronics">
            Electricals & Electronics
          </option>
        </select>
      </div>

      {/* ASYMMETRIC BANNER GRID - ALWAYS SHOWN */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Left Banner */}
  <div className="md:col-span-2 h-80 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center text-white text-3xl font-bold">
    🖥️ Big Tech Sale - Up to 50% OFF
  </div>

  {/* Right Banner (Image) */}
  <div className="h-80 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
    <img src={image1} alt="Festive Offer" className="w-full h-full object-cover rounded-2xl" />
  </div>
</div>


      {/* FIRST 3 PRODUCTS */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {renderProductGrid(0, 3)}
      </div>

      {/* HORIZONTAL BANNER STRIP - ALWAYS SHOWN */}
      <div className="mb-10 h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
        <img src={image2}/>
      </div>

      {/* NEXT 3 PRODUCTS */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {renderProductGrid(3, 6)}
      </div>

      {/* ZIGZAG BANNERS - ALWAYS SHOWN */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-44 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-xl font-semibold">
          🔧 PC Parts <br/> Exclusive Deals
        </div>
        <div className="md:col-span-2 h-44 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
          ⚡ New Electrical Arrivals - Stock Just In!
        </div>
      </div>

      {/* NEXT 3 PRODUCTS */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {renderProductGrid(6, 9)}
      </div>

      {/* GRID OF 4 SMALL BANNERS - ALWAYS SHOWN */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="h-36 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-md flex items-center justify-center text-white text-lg font-semibold text-center p-4">
          💻 Software Deals
        </div>
        <div className="h-36 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-md flex items-center justify-center text-white text-lg font-semibold text-center p-4">
          🎁 Gift Cards
        </div>
        <div className="h-36 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-md flex items-center justify-center text-white text-lg font-semibold text-center p-4">
          🛠️ Accessories
        </div>
        <div className="h-36 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-md flex items-center justify-center text-white text-lg font-semibold text-center p-4">
          📦 Bulk Orders
        </div>
      </div>

      {/* REMAINING PRODUCTS */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {renderProductGrid(9, filteredProducts.length)}
      </div>

      {/* CLOSING DOUBLE BANNER - ALWAYS SHOWN */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-52 bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl shadow-xl flex items-center justify-center text-white text-2xl font-bold text-center p-6">
          🚚 Free Shipping <br/> on Orders Above ₹5000
        </div>
        <div className="h-52 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl shadow-xl flex items-center justify-center text-white text-2xl font-bold text-center p-6">
          🔒 Secure Payments <br/> & Easy Returns
        </div>
      </div>
    </section>
  );
};

export default ShopSection;