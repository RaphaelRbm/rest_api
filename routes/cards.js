const express = require("express");
const { Card } = require("../models/Card");
const { User } = require("../models/User");
const router = express.Router();
const _ = require("lodash");
const joi = require("joi");
const auth = require("../middlewares/auth");

// Joi Schema of Card
const cardSchema = joi.object
(
    {
       name: joi.string().required().min(2),
       address: joi.string().required().min(2),
       description:joi.string().required().min(2),
       phone:joi.string().required().regex(/^0[2-9]\d{7,8}$/),
       image:joi.string().required()
    }
);


// Get all cards of specific user
router.get("/my-cards", auth, async (req, res) => {
  try {
        // Get user's cards
        let myCards = await Card.find({user_id: req.payload._id});
        res.status(200).send(myCards);

  } catch (error) {
    res.status(400).send("Error in get all cards of user, " + error);
  }
});

// Get specific card of specific user
router.get("/:_id", auth, async (req, res) => {
  try {
        // Get card
        let card = await Card.findOne({ _id: req.params._id, user_id: req.payload._id });
        if (!card) return res.status(404).send("Card was not found");

        res.status(200).send(card);

  } catch (error) {
    res.status(400).send("Error in get card, " + error);
  }
});

// Get all cards
router.get("/",auth, async (req,res) =>{
  try {
        // Get cards
        let cards = await Card.find();
        res.status(200).send(cards);
  } catch (error) {
    res.status(400).send("Error in get all cards, " + error);
  }
});

// Post new card
router.post("/", auth, async(req, res) => 
{
    try {
            // Joi validation
            const {error} = cardSchema.validate(req.body);
            if (error) return res.status(400).send(error.message);
    
            // Get card number and user id
            let card = new Card (req.body);
            card.cardNumber = await genCardNum();
            card.user_id = req.payload._id;
    
            // Create and save card in db
            await card.save();
            res.status(201).send(card);
    } catch (error) {
        res.status(400).send("Error in post card, " + error);
    }

});

// Update specific card of specific user
router.put("/:_id", auth, async (req, res) => 
{
  try {
        // Joi validation
        const {error} = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);

        // Get and update card
        let card = await Card.findOneAndUpdate({ _id: req.params._id, user_id:req.payload._id}, req.body, {new:true});
        if (!card) return res.status(404).send("Card was not found");

        // Send updated card
        res.status(200).send(card);

  } catch (error) {
    res.status(400).send("Error in put card, " + error);
  }
});

// Delete specific card of specific user
router.delete("/:_id",auth, async (req, res) => {
  try {
        // Get and remove card
        let card = await Card.findOneAndRemove({ _id: req.params._id, user_id:req.payload._id});
        if (!card) return res.status(404).send("Card was not found");

        res.status(200).send("Card has been deleted");

  } catch (error) {
    res.status(400).send("Error in delete card, " + error);
  }
});

// Generate random number
const genCardNum = async ()=>{

    while(true)
    {
        let randomNum = _.random(1000,999999)
        let card = await Card.findOne({cardNumber: randomNum});

        if (!card)
            return randomNum;
    }
};

module.exports = router;
