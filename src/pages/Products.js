import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/Products.css';
import CartPanel from '../pages/CartPanel'; // ✅ Import CartPanel
import { IndianRupee } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false); // ✅ Cart visibility
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // Product details
  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatted = data.map(p => ({
            ...p,
            price: Number(p.price),
            image: p.image_url ? `http://localhost:5000${p.image_url}` : "images/default.jpeg"
          }));
          setProducts(formatted);
        } else {
          console.error("Unexpected response:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const goToProductDetail = (product) => {
    setSelectedProduct(product);
    setShowModal(true); // Show modal with product details
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageError = (e) => {
    e.target.src = "images/default.jpeg";
    e.target.onerror = null;
  };

  const handleOrder = () => {
    setShowCart(false);
    history.push('/order', { cartItems : cart }); // This route should be implemented for full-page order form
  };

  return (
    <div className="products-page">
      {/* Header with title and cart count */}
      <div className="products-header">
        <h2>Our Products</h2>
        <div className="cart-indicator" onClick={() => setShowCart(true)} style={{ cursor: 'pointer' }}>
          🛒 {cart.length} items
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Product List */}
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
                onClick={() => goToProductDetail(product)}
                onError={handleImageError}
              />
              <h3>{product.name}</h3>
              <p><IndianRupee size={15} />{product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p className="no-results">No products found.</p>
        )}
      </div>

      {/* ✅ Cart Panel */}
      {showCart && (
        <CartPanel
          cartItems={cart}
          onClose={() => setShowCart(false)}
          onOrder={handleOrder}
        />
      )}

      {/* Product Detail Modal */}
      {showModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeModal}>
          <div className="product-details-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>×</span>
            <img src={selectedProduct.image} alt={selectedProduct.name} className="modal-product-image" />
            <h2>{selectedProduct.name}</h2>
            <p>{selectedProduct.price} ₹</p>
            <div className="product-description">
              <h4>Description:</h4>
              <p>{selectedProduct.description}</p>
            </div>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
