const prisma = require("../config/db");

// POST: Create Order + OrderItems (Nested Write)
const createOrder = async (req, res) => {
    try {
        const { deliveryAddress, items } = req.body; // items: [{ menuItemId: 1, quantity: 2, price: 10 }, ...]
        const userId = req.user.userId;

        const newOrder = await prisma.order.create({
            data: {
                userId,
                deliveryAddress,
                status: "PENDING",
                items: {
                    create: items.map(item => ({
                        menuItemId: item.menuItemId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: { items: true }
        });

        res.status(201).json(newOrder);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET: All Orders (Admin sees all, User sees only theirs)
const getOrders = async (req, res) => {
    try {
        const query = req.user.role === "ADMIN" ? {} : { userId: req.user.userId };
        const orders = await prisma.order.findMany({
            where: query,
            include: { items: { include: { menuItem: true } }, user: true }
        });
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET: Single Order
const getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: { items: true }
        });
        
        if (!order) return res.status(404).json({ message: "Order not found" });
        
        // Authorization check
        if (req.user.role !== "ADMIN" && order.userId !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        res.status(200).json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT: Update Status (Admin Only)
const updateStatus = async (req, res) => {
    try {        
        const updated = await prisma.order.update({
            where: { id: req.params.id },
            data: { status: req.body.status } // e.g., "DELIVERED"
        });
        res.status(200).json(updated);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT: Cancel Order (Client Only, only if PENDING)
const cancelOrder = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({ where: { id: req.params.id } });
        
        if (order.userId !== req.user.userId) return res.status(403).json({ message: "Unauthorized" });
        if (order.status == "DELIVERED") return res.status(400).json({ message: "Cannot cancel an order that is not delivered" });

        const cancelled = await prisma.order.update({
            where: { id: order.id },
            data: { status: "CANCELLED" }
        });
        res.status(200).json(cancelled);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { createOrder, getOrders, getOrderById, updateStatus, cancelOrder };