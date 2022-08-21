const jwt = require("jsonwebtoken");


module.exports = (req,res,next) =>
{
    // Get token
    const token = req.header("Authorization");
    if (!token) return res.status(401).send("Access denied, no token provided");

    try {
            // Decrypt token and get payload
            const payload = jwt.verify(token, process.env.secretKey);
            req.payload = payload;           
            next();

    } catch (error) {
        res.status(400).send("Invalid token, " + error);
    }
};

