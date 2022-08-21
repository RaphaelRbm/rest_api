const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config();
const app = express ();
const PORT = process.env.PORT || 8000;


// Import Routes
const register = require("./routes/register");
const login = require("./routes/login");
const profile = require("./routes/profile");
const cards = require("./routes/cards")


// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/api/register",register);
app.use("/api/login",login);
app.use("/api/profile",profile);
app.use("/api/cards",cards);


// Connect to MongoDB
mongoose
.connect(process.env.db, {useNewUrlParser:true})
.then(()=>{console.log("Connected to mongoDB")})
.catch((err)=>{console.log("Cannot connect to mongoDB, " + err);})


// Listeners
app.listen(PORT,()=>{
    console.log("Server started on port: " + PORT);
})
