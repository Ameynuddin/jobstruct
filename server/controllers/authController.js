const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const util = require('util')
// const moment = require('moment');
// const {sendMail} = require('../utils/sendEMail')
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt

//1 Create New User
const signInToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const signUp = async (req, res) => {
    try {
        const { name, email, password, passwordConfirm } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                status: "Failure",
                message: "User already exists"
            });
        }
        // Check if all fields are filled
        if (!name || !email || !password || !passwordConfirm ) {
            return res.status(400).json({
                status: "Failure",
                message: "All fields are required"
            });
        }
        // Check if password and passwordConfirm match
        if (password !== passwordConfirm) {
            return res.status(400).json({
                status: "Failure",
                message: "Passwords do not match"
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed Password:", hashedPassword);

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            passwordConfirm,
        });

        // sendMail(email,"Wellcome to our Jobtrack App",`Hi ${name}, thank you for registering. We hope you enjoy our services!`)

        const token = signInToken(newUser._id)
        const expiresInMilliseconds = parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000; // Convert days to milliseconds

        // Save token in ccokies method 
        const cookieOptions = {
            expires: new Date(Date.now() + expiresInMilliseconds),
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: 'strict', // or 'lax', based on CSRF protection needs
        }

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.secure = true;
        }

        res.cookie('jwt', token, cookieOptions);
        // Remove password from output
        newUser.password = undefined;
        newUser.passwordConfirm = undefined;

        res.status(200).json({
            status: "User created successfully",
            token,
            user: newUser,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "User not created",
            message: "Server error", 
            error,
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).json({
                status: "Error",
                message: "Please provide email and password"
            });
        }

        // 2 check if user's email and password are correct
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log("User not found with provided email");
            return res.status(401).json({
                status: 'Error',
                message: 'Incorrect email or password',
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            console.log("Password comparison failed");
            return res.status(400).json({
                status: 'Error',
                message: 'Incorrect email or password',
            });
        }
        //     res.json({
        //         _id: user.id,
        //         nameL: user.name,
        //         email: user.email
        //     })
        // } else {
        //     res.status(400).json({
        //         message: "Incorrect email or password"
        //     })
        // }


        // generate jwt token
        const token = signInToken(user._id)
        const expiresInMilliseconds = parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000;

        const cookieOptions = {
            expires: new Date(Date.now() + expiresInMilliseconds),
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        }
        if (process.env.NODE_ENV === 'production') {
            cookieOptions.secure = true;
        }

        // set jwt token in the cookie
        res.cookie('jwt', token, cookieOptions);
        // Remove password from output
        user.password = undefined;

        res.status(200).json({
            status: "success",
            token,
            user
        })
        // } else {
        //     res.status(404).json({
        //         status: "failed",
        //         message: "Incorrect email or password"
        //     })
        // }

    } catch (error) {
        console.log("Error during login process:", error);
        res.status(500).json({
            status: "User Not Created",
            message: "Server Error", 
            error
        })

    }
}

// get Current user 
const getCurrentUser = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        if (currentUser) {
            res.status(200).json({
                status: "success",
                data: {
                    currentUser
                }
            });
        } else {
            res.status(404).json({
                status: "Current user not found",
                message: "User not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "Current user not retrieved",
            message: "Server error"
        });
    }
};

// Now Create Restricted Role
const restrictTo = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "You are not logged in!" });
        }
        if (req.user.role !== role) {
            return res.status(403).json({
                status: "failed",
                message: "you do not have permission to perform this action"
            });
        }
        next();
    }
}

//logout function 
const logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: 'success' });
}


module.exports = {
    signUp,
    login,
    getCurrentUser,
    restrictTo,
    logout
}