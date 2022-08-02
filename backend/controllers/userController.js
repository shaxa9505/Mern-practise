const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        res.status(401)
        throw new Error("Please add field");
    }

    const userExists = await User.findOne({email})

    if(userExists) {
        res.status(401)
        throw new Error("Kechirasiz bunday emailli foydalanuvchi mavjud")
    }


    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashPassword
    })

    if(user) {
        res.status(201)
        .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error("Malumotlaringiz xato")
    }

})


const loginUser = asyncHandler( async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password) {
        res.status(401)
        throw new Error("Iltimos hamma kataklarni tuldiring")
    }

    const user = await User.findOne({email});

    if(!user) {
        res.status(401)
        throw new Error("Kechirasiz bunday emaillik foydalanuvchi mavjuda emas ruyhatdan uting !!")
    } else {
        if(user && (await bcrypt.compare(password, user.password))) {
            res.status(201).json({
                message: "Tizimga kirdingiz Xush kelibsiz",
                token: generateToken(user._id)
            })
        } else {
            res.status(401)
            throw new Error("Kechirasiz parolingiz xato")
        }
    }

})


const getMe = asyncHandler( async (req, res) => {

    // const { _id, name, email } = await User.findById(req.user.id) 


    res.status(200).json(req.user)
})


// generateToken for user
const generateToken = (id) => {
    return decoded = jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe   
}