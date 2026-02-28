require('dotenv').config();
const express = require('express');

const authRoute = require("./routes/AuthRoute")
const categoryRoute = require("./routes/CategoryRoute")
const menuItemRoute = require("./routes/menuItemRoutes")
const orderRoute = require("./routes/orderRoutes")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
    res.json({ message: "Restaurant API is running" });
});

app.use('/api/auth', authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/menu-items', menuItemRoute);
app.use('/api/orders', orderRoute);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});