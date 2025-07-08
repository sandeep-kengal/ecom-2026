const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER || "postgres",
  host: process.env.PGHOST || "localhost",
  database: process.env.PGDATABASE || "products_db",
  password: process.env.PGPASSWORD || "postgres",
  port: process.env.PGPORT || 5432,
});

// Ensure DB connection before starting API
pool.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL database");
    app.listen(port, () => {
      console.log(`🟢 Backend API listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  });

// Auto-create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL
  );
`);

app.get("/products", async (req, res) => {
  const result = await pool.query("SELECT * FROM products");
  res.json(result.rows);
});

app.post("/products", async (req, res) => {
  const { name, price } = req.body;
  await pool.query("INSERT INTO products (name, price) VALUES ($1, $2)", [name, price]);
  res.status(201).json({ message: "Product added" });
});
