import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';
import '../styles/Products.css'; // Reuse the same styling

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        const formatted = data
          .slice(0, 4) // Show only first 4 as "featured"
          .map(p => ({
            ...p,
            price: Number(p.price),
            image: p.image_url ? `http://localhost:5000${p.image_url}` : "images/default.jpeg"
          }));
        setProducts(formatted);
      })
      .catch(err => console.error("Failed to fetch featured products:", err));
  }, []);

  const goToDetail = (id) => {
    history.push(`/product/${id}`);
  };

  const handleImageError = (e) => {
    e.target.src = "images/default.jpeg";
    e.target.onerror = null;
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onClick={() => goToDetail(product.id)}
            onError={handleImageError}
          />
          <h3>{product.name}</h3>
          <p><IndianRupee size={15} />{product.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
