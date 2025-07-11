"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map