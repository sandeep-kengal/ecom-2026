// frontend/src/Cart.jsx
import React from 'react';

function Cart({ cartItems, removeFromCart }) {
  return (
    <div>
      <h2>🛒 Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <ul>
          {cartItems.map((item, i) => (
            <li key={i}>
              {item.name} – ₹{item.price}
              <button onClick={() => removeFromCart(i)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
