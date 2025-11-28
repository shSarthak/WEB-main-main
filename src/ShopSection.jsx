import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const ShopSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); // Show 9 products per page

  // Fetch products and banners from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch("http://localhost:5000/products");
        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);

        // Fetch banners
        const bannersResponse = await fetch("http://localhost:5000/banners");
        if (!bannersResponse.ok) {
          throw new Error("Failed to fetch banners");
        }
        const bannersData = await bannersResponse.json();
        
        // Organize banners by position
        const bannersByPosition = {};
        bannersData.forEach(banner => {
          if (!bannersByPosition[banner.position]) {
            bannersByPosition[banner.position] = [];
          }
          bannersByPosition[banner.position].push(banner);
        });
        setBanners(bannersByPosition);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get banner by position (returns first banner for that position)
  const getBanner = (position) => {
    return banners[position]?.[0] || null;
  };

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
  const renderProductGrid = (productsToRender) => {
    if (loading) {
      return <ProductsLoadingState />;
    }
    
    if (error) {
      return <ProductsErrorState />;
    }
    
    if (productsToRender.length === 0) {
      return <EmptyProductsState />;
    }
    
    return productsToRender.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
        {/* Previous Button */}
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          Previous
        </button>

        {/* First Page + Ellipsis */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => paginate(1)}
              className={`px-4 py-2 rounded-lg border ${
                1 === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {/* Page Numbers */}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-lg border ${
              number === currentPage
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {number}
          </button>
        ))}

        {/* Last Page + Ellipsis */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => paginate(totalPages)}
              className={`px-4 py-2 rounded-lg border ${
                totalPages === currentPage
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          Next
        </button>

        {/* Page Info */}
        <div className="ml-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages} • {filteredProducts.length} products
        </div>
      </div>
    );
  };

  // Hero Banner
  const heroBanner = getBanner("hero");
  
  // Top Asymmetric Banners
  const topLeftBanner = getBanner("top_asymmetric_left");
  const topRightBanner = getBanner("top_asymmetric_right");
  
  // Horizontal Strip Banner
  const horizontalBanner = getBanner("horizontal_strip");
  
  // Zigzag Banners
  const zigzagLeftBanner = getBanner("zigzag_left");
  const zigzagRightBanner = getBanner("zigzag_right");

  // New Secure Payments Banner
  const securePaymentsBanner = getBanner("secure_payments");

  return (
    <section className="w-full bg-gray-50 py-10 px-6 md:px-16">
      {/* HERO BANNER - Full width */}
      {heroBanner ? (
        <div className="w-full mb-10 h-80 rounded-3xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold relative overflow-hidden bg-gray-900">
          <img 
            src={heroBanner.image_url} 
            alt={heroBanner.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="z-10 text-center px-4">
            <div className="text-5xl mb-4">🚀</div>
            <div className="text-3xl md:text-4xl">{heroBanner.title}</div>
            {heroBanner.subtitle && (
              <div className="text-lg font-normal mt-3">{heroBanner.subtitle}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full mb-10 h-auto bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-3xl shadow-2xl flex items-center justify-center text-white text-4xl font-bold relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="z-10 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <div>Power Your Workspace – Shop Smarter!</div>
            <div className="text-lg font-normal mt-3">Exclusive deals on tech & electronics</div>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER */}
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
          <option value="Printer & printer spare parts">Printers & Spares</option>
          <option value="Electricals & Electronics">Electricals & Electronics</option>
        </select>
      </div>

      {/* ASYMMETRIC BANNER GRID */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Banner */}
        {topLeftBanner ? (
          <div className="md:col-span-2 h-auto rounded-2xl shadow-lg overflow-hidden flex items-center justify-center relative bg-gray-100">
            <img 
              src={topLeftBanner.image_url} 
              alt={topLeftBanner.title}
              className="w-full h-full object-contain"
            />
            {topLeftBanner.title && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-3xl font-bold text-center bg-black bg-opacity-40 px-6 py-3 rounded-lg">
                  {topLeftBanner.title}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="md:col-span-2 h-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center text-white text-3xl font-bold">
            🖥️ Big Tech Sale - Up to 50% OFF
          </div>
        )}

        {/* Right Banner */}
        {zigzagLeftBanner ? (
          <div className="h-auto rounded-2xl shadow-lg overflow-hidden flex items-center justify-center relative bg-gray-100">
            <img 
              src={zigzagLeftBanner.image_url} 
              alt={zigzagLeftBanner.title}
              className="w-full h-full object-contain"
            />
            {zigzagLeftBanner.title && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-2xl font-bold text-center bg-black bg-opacity-40 px-4 py-2 rounded-lg">
                  {zigzagLeftBanner.title}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
            🎉 Festive Offers
          </div>
        )}
      </div>

      {/* PRODUCTS GRID WITH PAGINATION */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {renderProductGrid(currentProducts)}
      </div>

      {/* PAGINATION CONTROLS */}
      <Pagination />

      {/* HORIZONTAL BANNER STRIP */}
      {horizontalBanner ? (
        <div className="my-10 h-32 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center relative bg-gray-100">
          <img 
            src={horizontalBanner.image_url} 
            alt={horizontalBanner.title}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 pointer-events-none">
            <div className="text-white text-2xl font-bold text-center px-4">
              {horizontalBanner.title}
            </div>
          </div>
        </div>
      ) : (
        <div className="my-10 h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
          ⚡ Flash Sale: Limited Stock Available - Grab Now!
        </div>
      )}

      {/* GRID OF 4 SMALL BANNERS */}
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

      {/* CLOSING DOUBLE BANNER */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT BANNER */}
        {topRightBanner ? (
          <div className="h-auto rounded-2xl shadow-lg overflow-hidden flex items-center justify-center relative bg-gray-100">
            <img 
              src={topRightBanner.image_url} 
              alt={topRightBanner.title}
              className="w-full h-full object-contain"
            />
            {topRightBanner.title && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-2xl font-bold text-center bg-black bg-opacity-40 px-4 py-2 rounded-lg">
                  {topRightBanner.title}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-auto bg-gradient-to-br from-slate-800 to-slate-600 rounded-2xl shadow-lg flex items-center justify-center text-white text-2xl font-bold">
            🚚 Free Shipping <br /> on Orders Above ₹5000
          </div>
        )}

        {/* RIGHT BANNER — secure_payments DYNAMIC */}
        <div className="h-auto rounded-2xl shadow-xl overflow-hidden flex items-center justify-center relative bg-gray-100">
          {securePaymentsBanner ? (
            <>
              <img
                src={securePaymentsBanner.image_url}
                alt={securePaymentsBanner.title}
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="z-10 text-white text-3xl font-bold text-center px-6">
                {securePaymentsBanner.title}
                {securePaymentsBanner.subtitle && (
                  <p className="mt-2 text-lg font-normal">{securePaymentsBanner.subtitle}</p>
                )}
              </div>
            </>
          ) : (
            <div className="h-auto bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl shadow-xl flex items-center justify-center text-white text-2xl font-bold text-center p-6">
              🔒 Secure Payments <br /> & Easy Returns
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ShopSection;