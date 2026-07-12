import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//generate token for new user
const generateToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

// controller for user registration
//POST: /api/users/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //check if require fields are present
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        // check if user is already registered
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: 'user already registered' })
        }

        // create new user
        const hashedPassword = await bcrypt.hash(paaword, 10) // encrypted user password

        const newuser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        //return success message
        const token = generateToken(newuser._id)
        newuser.password = undefined;

        return res.status(201).json({
            message: "user registered successfully",
            user: newuser,
            token
        })
    } catch (error) {
        return res.status(400).json({ message: "internal server error", error: error.message })
    }
}

//controller for user login
//POST: /api/users/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if user exits
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }

        // compare password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ message: 'invalid password' })
        }

        // return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({
            message: "user logged in successfully",
            user,
            token
        })
    } catch (error) {
        return res.status(400).json({ message: "internal server error", error: error.message })
    }
}

// controller for user logout
//POST: /api/users/logout
export const logoutUser = async (req, res) => {
    try {
        // return success message
        return res.status(200).json({
            message: "user logged out successfully"
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}


// controller for getting user by  id
//GET: /api/users/:id
export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'user not found' })
        }

        // return user found message
        user.password = undefined;
        return res.status(200).json({
            message: "user fetched successfully",
            user
        })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

