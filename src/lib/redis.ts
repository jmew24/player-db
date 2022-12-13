import Redis from "ioredis";

let redis: Redis;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.REDIS ?? "");
  if (redis.status !== "ready" && redis.status !== "connecting")
    redis.connect();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    redis: Redis;
  };
  if (!globalWithPrisma.redis) {
    globalWithPrisma.redis = new Redis(process.env.REDIS ?? "");
  }
  redis = globalWithPrisma.redis;
  if (redis.status !== "ready" && redis.status !== "connecting")
    redis.connect();
}

const redisClient = {
  async get(key: string): Promise<string | null> {
    if (redis.status === "ready") return Promise.resolve(await redis.get(key));

    let countdown = 30;

    return new Promise((resolve) => {
      const timeout = setInterval(async () => {
        if (redis.status === "ready") {
          clearInterval(timeout);
          return resolve(await redis.get(key));
        } else if (countdown === 0) {
          clearInterval(timeout);
          redis.disconnect();
          return resolve(null);
        } else {
          countdown--;
        }
      }, 1000);
    });
  },
  async set(key: string, value: string, seconds = 0) {
    if (redis.status === "ready") {
      return Promise.resolve(
        await redis.set(
          key,
          value,
          "EX",
          seconds === 0
            ? parseInt(process.env.REDIS_EXPIRE_SECONDS?.toString() ?? "60")
            : seconds
        )
      );
    }

    let countdown = 30;

    return new Promise((resolve) => {
      const timeout = setInterval(async () => {
        if (redis.status === "ready") {
          clearInterval(timeout);
          return resolve(
            await redis.set(
              key,
              value,
              "EX",
              seconds === 0
                ? parseInt(process.env.REDIS_EXPIRE_SECONDS?.toString() ?? "60")
                : seconds
            )
          );
        } else if (countdown === 0) {
          clearInterval(timeout);
          redis.disconnect();
          return resolve(null);
        } else {
          countdown--;
        }
      }, 1000);
    });
  },
};

export default redisClient;
