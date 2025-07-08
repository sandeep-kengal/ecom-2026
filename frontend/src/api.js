// frontend/src/api.js
import axios from 'axios';

export const fetchProducts = async () => {
  const res = await axios.get('/api/products');  // Let Nginx handle it
  return res.data;
};

export const addProduct = async (product) => {
  const res = await axios.post('/api/products', product);
  return res.data;
};
