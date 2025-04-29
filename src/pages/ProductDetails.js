import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import "../styles/ProductDetails.css"; // Styling for small-page look

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setProduct({
            ...data,
            price: Number(data.price),
            image: data.image_url ? `http://localhost:5000${data.image_url}` : "images/default.jpeg"
          });
        }
      })
      .catch(err => console.error("Failed to fetch product:", err));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-card">
        <img src={product.image} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
          <div className="product-description">
            <h4>Description:</h4>
            <p>{product.description || "No description available."}</p>
          </div>
          <button onClick={() => history.goBack()}>Back to Products</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
