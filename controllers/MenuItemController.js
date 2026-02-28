const prisma = require("../config/db");

// GET all menu items
const getMenuItems = async (req, res) => {
    try {
        const items = await prisma.menuItem.findMany({
            include: { category: true } // Shows the category name/details
        });
        res.status(200).json(items);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// GET one menu item by ID
const getMenuItemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const item = await prisma.menuItem.findUnique({
            where: { id: id },
            include: { category: true }
        });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST a new menu item
const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, categoryId, imageURL } = req.body;
        if(!name || !price || !categoryId) {
            return res.status(400).json({message: "Name, price and categoryId are required"})
        }
        const newItem = await prisma.menuItem.create({
            data: {
                name,
                description,
                price: parseInt(price), // Prisma Decimal handles float/string conversion
                categoryId: categoryId,
                imageURL
            }
        });
        res.status(201).json(newItem);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT (Update) a menu item
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, imageURL } = req.body;

        const existItem = await prisma.menuItem.findUnique({where: {id: id}});
        if(!existItem) {
            return res.status(404).json({message: "Menu item not found"})
        }
        const updatedItem = await prisma.menuItem.update({
            where: { id: id },
            data: {
                name: name,
                description: description ? description : existItem.description,
                price: price ? price : undefined,
                categoryId: categoryId ? categoryId : undefined,
                imageURL: imageURL ? imageURL : existItem.imageURL
            }
        });
        res.status(200).json(updatedItem);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE a menu item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const existItem = await prisma.menuItem.findUnique({where: {id: id}});
        if(!existItem) {
            return res.status(404).json({message: "Menu item not found"})
        }
        await prisma.menuItem.delete({ where: { id: id } });
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };