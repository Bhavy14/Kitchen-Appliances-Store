import React, { useState, useEffect } from "react";
import "../styles/ProductsPage.css";
import { IndianRupee } from 'lucide-react';

const ProductsPage = () => {
  const [productList, setProductList] = useState([]);  // Ensure it's an array initially
  const [form, setForm] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    stock: "",
    image: null, // Field for image
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch products from backend on initial load
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductList(data);  // Set productList only if it's an array
        } else {
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", category: "", price: "", stock: "", image: null });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.price || !form.stock) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    if (form.image) formData.append("image", form.image);  // Append image if selected

    fetch("http://localhost:5000/api/products", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProductList([...productList, data]); // Add the new product to the list
        resetForm();
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  const handleEdit = (product) => {
    setForm(product);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    if (form.image) formData.append("image", form.image); // Append image if selected

    fetch(`http://localhost:5000/api/products/${form.id}`, {
      method: "PUT",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProductList(productList.map((p) => (p.id === form.id ? data : p))); // Update the product in the list
        resetForm();
      })
      .catch((err) => console.error("Error updating product:", err));
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setProductList(productList.filter((product) => product.id !== id)); // Remove deleted product from the list
        })
        .catch((err) => console.error("Error deleting product:", err));
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        <button className="add-product-btn" onClick={() => {
          setShowForm(!showForm);
          setIsEditing(false);
          setForm({ id: null, name: "", category: "", price: "", stock: "", image: null });
        }}>
          {showForm ? "Close Form" : "+ Add Product"}
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <input name="name" value={form.name} onChange={handleInputChange} placeholder="Product Name" />
          <input name="category" value={form.category} onChange={handleInputChange} placeholder="Category" />
          <input name="price" value={form.price} onChange={handleInputChange} placeholder="Price" type="number" />
          <input name="stock" value={form.stock} onChange={handleInputChange} placeholder="Stock" type="number" />
          <input name="image" type="file" onChange={handleImageChange} />
          <button className="add-product-btn" onClick={isEditing ? handleUpdateProduct : handleAddProduct}>
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹)</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(productList) && productList.length > 0 ? (
            productList.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td><IndianRupee size={15}/>{product.price}</td>
                <td>{product.stock}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
