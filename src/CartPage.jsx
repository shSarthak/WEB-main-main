import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`http://localhost:5000/cart/${user.id}`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity becomes 0, remove the item
      await removeFromCart(itemId);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/cart/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          quantity: newQuantity
        })
      });

      if (res.ok) {
        // Refresh the cart to get updated data
        await fetchCart();
      } else {
        console.error("Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/cart/remove/${itemId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        // Remove item from local state immediately for better UX
        setCart(prev => prev.filter(item => item.id !== itemId));
      } else {
        console.error("Failed to remove item");
        const errorData = await res.json();
        console.error("Error details:", errorData);
      }
    } catch (err) {
      console.error("Error removing item:", err);
    } finally {
      setLoading(false);
    }
  };

  const payNow = () => {
    console.log("Pay Now clicked");
    // Add your payment logic here
  };


  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      // Remove currency symbol and commas, then convert to number
      const price = parseFloat(item.price.replace(/[₹,]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  if (!user) {
    return <p className="p-6">Please log in to view your cart.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Cart</h2>

      {loading && <div className="text-center py-4">Updating cart...</div>}

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded shadow"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{item.item_name}</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="text-sm text-gray-600 min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={loading}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={loading}
                      className="ml-4 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-semibold block">
                    {item.price}
                  </span>
                  {item.quantity > 1 && (
                    <span className="text-sm text-gray-500">
                      {item.quantity} × {item.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
            {/* Total Amount Section */}
            <div className="bg-white p-4 rounded-lg border-l-4 border-green-500 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">All taxes included</p>
            </div>

            {/* Pay Now Button */}
            <button
              onClick={payNow}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span className="text-lg">Pay Now</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secure Payment Gateway</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;