const Redis = require("ioredis");

const redis = new Redis();
//configured to use redis as a cache
module.exports = redis;
