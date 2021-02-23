const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body;

        //validation
        if(!email || !password || !passwordVerify) 
            return res.status(400).json({ errorMessage: "Please enter all required fields."});
        
        if(password.length < 8)
            return res.status(400).json({ errorMessage: "Password must be 8 characters or more."});

        if(password !== passwordVerify)
            return res.status(400).json({ errorMessage: "Passwords do not match." });

        const existingUser = await User.findOne({ email });
        if(existingUser)
            return res.status(400).json({ errorMessage: "Email already exists." });

        //hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        //save new user to db
        const newUser = new User({
            email, 
            passwordHash,
        });

        const savedUser = await newUser.save();

        //log user in
        const token = jwt.sign(
        {
            user: savedUser._id,
        },
            process.env.JWT_SECRET
        );

        //send the token in an HTTP only cookie
        res.cookie('token', token, {
            httpOnly: true,
        }).send();

        //installed jsonwebtoken
        //installed bcrypt
    }
    catch(err) {
        console.error(err);
        res.status(500).send();
    }
});

//log in

module.exports = router;