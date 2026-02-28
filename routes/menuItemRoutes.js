const express = require("express");
const { 
    getMenuItems, 
    getMenuItemById, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
} = require("../controllers/MenuItemController");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public: Anyone can see the menu
router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);

// Protected: Only authorized users (Admins) should manage items
router.post("/", verifyToken, verifyAdmin, createMenuItem);
router.put("/:id", verifyToken, verifyAdmin, updateMenuItem);
router.delete("/:id", verifyToken, verifyAdmin, deleteMenuItem);

module.exports = router;