const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.json({
                message: "Fields are missing",
                success: false,
                error: true
            })
        }

        // Check if any users exist
        const userCount = await User.countDocuments();
        let role = 'user';
        if (userCount === 0) {
            role = 'admin';
        }

        // Check for existing username or email
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                error: true,
                message: 'Username or email already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        return res.status(201).json({
            success: true,
            message: `User registered successfully as ${role}`
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json({
                message: "Fields are missing",
                success: false,
                error: true
            })
        }

        const user = await User.findOne({ username })

        if (!user) {
            return res.json({
                message: "User not found",
                success: false,
                error: true
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(401).json({
                message: "Incorrect password",
                success: false,
                error: true
            })
        }

        // create user token
        const payload = {
            userId : user._id,
            role: user.role
        }
        const accessToken = await jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })

        res.status(200)
            .header('Authorization', accessToken)
            .json({
                message: 'Login Successfully',
                success: true,
            })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const updatedPassword = req.body.updatedPassword;

        if (!updatedPassword) {
            return res.status(400).json({
                error: true,
                message: 'New password is required'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updatedPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        return res.json({
            message: 'Password changed successfully',
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

module.exports = { register, login , changePassword}