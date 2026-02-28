const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");
const { 
    createOrder, getOrders, getOrderById, updateStatus, cancelOrder 
} = require("../controllers/OrderController");

router.use(verifyToken); // All order routes require login

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", verifyAdmin, updateStatus); // For Admin
router.put("/:id/cancel", cancelOrder);  // For Client

module.exports = router;