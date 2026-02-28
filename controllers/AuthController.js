const prisma = require("../config/db");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { Role } = require("@prisma/client");

const register = async (req, res) => {
    try {
        const {name, phone, password, address} = req.body;

        const existUser = await prisma.user.findUnique({where: {phone}});
        if(existUser) {
            return res.status(400).json({message: "User is already exist"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
                address,
                role: "CLIENT",
            }
        })
        return res.status(201).json({message:"user registered successfully"})
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({error: "Internal server error"});
        
    }
}

const login = async (req, res) => {
    try {
        const {phone, password} = req.body;
        
        const user = await prisma.user.findUnique({where: {phone}});
        if(!user) {
            return res.status(401).json({message: "Invalid phone or password"})
        }

        const isPasswordValid = await bcrypt.compare(user.password, password)
        if(isPasswordValid) {            
            return res.status(401).json({message: "Invalid phone or password"})
        }

        const token = jwt.sign(
            {userId: user.id, role: user.role}, 
            process.env.JWT_SECRET,
            {expiresIn: '1d'});
        
        const {password: _, ...userInfo} = user;
        

            res.status(200).json({message: "Login successfully", token, user: userInfo })

    } catch (e) {
        console.log(e.message);
        
    }
}

module.exports = {register, login}
