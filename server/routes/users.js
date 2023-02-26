const router = require('express').Router();
const {User, validate } = require("../models/User");
const bcrypt = require("bcrypt");


router.post("/", async (req, res) => {

    // This validates the register information
    try{
        const {error } = validate(req.body);
        if(error) {
            return res.status(400).send({message: error.details[0].message})
        }
        // This searches the database to see if there is a already that email
        const user = await User.findOne({ email: req.body.email});

        // This handles the message back to the user that an email already exists
        
        if(user) {
            return res.status(409).send({message: "User with given email already exists"})
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        await new User({...req.body, password: hashedPassword}).save();
        res.status(201).send({message: "User created successfully"})
    }
    catch(error) {
        res.status(500).send({message: "Internal server error"});
    }
});

module.exports = router;