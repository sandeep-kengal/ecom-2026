"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const router = (0, express_1.Router)();
const orderController = new orderController_1.OrderController();
router.get('/my-orders', orderController.getMyOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.get('/', orderController.getAllOrders);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map