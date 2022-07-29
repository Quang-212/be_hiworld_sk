const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
  host: "cache",
});
//configured to use redis as a cache
module.exports = redis;
