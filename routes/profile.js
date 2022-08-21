const express = require("express");
const {User} = require("../models/User.js");
const router = express.Router();
const _ = require("lodash");
const joi = require("joi");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");

router.get("/",auth, async (req,res)=>{
    try {
        const user = await User.findById(req.payload._id);
        res.status(200).send(_.pick(user,["_id","name","email","biz"]));
    } catch (error) {
        res.status(400).send("Error in get profile, " + error);
    }
});

module.exports = router;