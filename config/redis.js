const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URI);

redis.on("connect",()=>{
    console.log("redis-connected")
} );
redis.on("error", (error)=>{
    console.error("redis error:"+ error);
});

module.exports = redis;
