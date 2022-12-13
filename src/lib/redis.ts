import Redis from "ioredis";

let redis: Redis;

if (process.env.NODE_ENV === "production") {
  redis = new Redis(process.env.NEXT_PUBLIC_REDIS ?? "");
} else {
  const globalWithPrisma = global as typeof globalThis & {
    redis: Redis;
  };
  if (!globalWithPrisma.redis) {
    globalWithPrisma.redis = new Redis(process.env.NEXT_PUBLIC_REDIS ?? "");
  }
  redis = globalWithPrisma.redis;
}

export default redis;
