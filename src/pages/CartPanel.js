// CartPanel.js
import React from 'react';
import { IndianRupee } from 'lucide-react';
import '../styles/CartPanel.css';

const CartPanel = ({ cartItems, onClose, onOrder }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-panel">
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button onClick={onClose}>✖</button>
      </div>

      {cartItems.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={index}>
                <img src={item.image} alt={item.name} />
                <div>
                  <p>{item.name}</p>
                  <p><IndianRupee size={15} />{item.price.toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-footer">
            <p>Total: <IndianRupee size={15} />{total.toFixed(2)}</p>
            <button className="order-btn" onClick={onOrder}>Order</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPanel;
