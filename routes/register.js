const express = require("express");
const {User} = require("../models/User.js");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerSchema = joi.object
(
    {
        name: joi.string().required().min(2),
        email: joi.string().required().min(6).max(1024).email(),
        password: joi.string().required().min(8).max(1024),
        biz: joi.boolean().required(),
    }
);

router.post("/",async (req,res)=>
{
    try 
    {
        // Joi validation
        const {error} = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);

        // Check if user already exists in db
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send("User already exists");
        user = new User (req.body);

        // Password encryption
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Save user in db
        await user.save();
        const gToken = jwt.sign({id:user._id, biz:user.biz}, process.env.secretKey);
        res.status(201).send({token:gToken});
    } 

    catch (error) 
    {
        res.status(400).send("Error in register new user, " + error);
    }

})

module.exports = router;