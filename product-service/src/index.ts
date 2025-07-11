import express from 'express';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'product-service' });
});

// Example product endpoint
app.get('/products', (req, res) => {
  res.json([
    { id: 1, name: 'Sample Product', price: 99.99 },
    { id: 2, name: 'Another Product', price: 49.99 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
}); 