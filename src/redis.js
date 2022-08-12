const Redis = require("ioredis");

const redis = new Redis({
  host: "redis",
  port: 6379,
});
//configured to use redis as a cache
module.exports = redis;
