const router = require('express').Router();
const User = require('../models/userModel');

router.post('/', async (req, res) => {
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
    }
    catch(err) {
        console.error(err);
        res.status(400).send();
    }
});

module.exports = router;