import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct } from './api';
import Cart from './Cart';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [cart, setCart] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Name & price required");

    await addProduct(form);
    setForm({ name: '', price: '' });
    loadProducts();
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🛍️ Product Store</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button type="submit">Add Product</button>
      </form>

      <hr />

      <h2>🧾 Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} – ₹{p.price}{" "}
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <hr />

      <Cart cartItems={cart} removeFromCart={removeFromCart} />
    </div>
  );
}

export default App;
