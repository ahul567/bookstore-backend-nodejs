import Queue from "bull";
import redisClient from "../config/redis.js";

const emailQueue = new Queue("emailQueue", {
  limiter: { max: 100, duration: 60000 },
  redis: { host: "127.0.0.1", port: 6379 }
});

export default emailQueue;
