const prisma = require("../config/db");

// GET all categories
const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { menuItems: true } // Optional: includes items in that category
        });
        res.status(200).json(categories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// POST a new category
const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if(!name) {
            return res.status(400).json({message: "Category name is required"})
        }
        const category = await prisma.category.create({
            data: { name }
        });
        res.status(201).json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// PUT (Update) a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const existCategory = await prisma.category.findUnique({where: {id: id}});
        if(!existCategory) {
            return res.status(404).json({message: "Category not found"})
        }
        const category = await prisma.category.update({
            where: { id: id },
            data: { name }
        });
        res.status(200).json(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

// DELETE a category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const existCategory = await prisma.category.findUnique({where: {id: id}});
        if(!existCategory) {
            return res.status(404).json({message: "Category not found"})
        }
        await prisma.category.delete({
            where: { id: id }
        });
        res.status(204).json({message: "Category deleted successfully"});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};


module.exports = { getCategories, createCategory, updateCategory, deleteCategory };