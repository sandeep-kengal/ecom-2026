"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4001;
app.use(express_1.default.json());
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
