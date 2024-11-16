const jwt = require("../utils/jwt");
const redis = require("../config/redis");
const {verifyToken } = require("../utils/jwt");

module.exports = async (req,res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(404).json({message: "No toke provided or found"});
    try {
        const decode = verifyToken(token);
        const cacheToken = await redis.get(`user:${decode.id}`)
        if(!cacheToken || cacheToken != token){
            return res.status(404).json({message:"Token has expired or invalid"});
        }
        req.user = decode
        next();
    } catch (error) {
        console.error(error.message)
    }
}

