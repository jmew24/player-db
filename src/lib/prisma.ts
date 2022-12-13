import { Prisma, PrismaClient } from "@prisma/client";
import { createPrismaRedisCache } from "prisma-redis-middleware";
import Redis from "ioredis";

let prisma: PrismaClient;
let redis: Redis;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
  redis = new Redis(process.env.REDIS_URL ?? "");
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  const globalWithRedis = global as typeof globalThis & {
    redis: Redis;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  if (!globalWithRedis.redis) {
    globalWithRedis.redis = new Redis(process.env.REDIS_URL ?? "");
  }
  prisma = globalWithPrisma.prisma;
  redis = globalWithRedis.redis;
}

const cacheMiddleware: Prisma.Middleware = createPrismaRedisCache({
  models: [
    { model: "Sport", cacheTime: 3600 },
    { model: "Team", cacheTime: 3600 },
    { model: "Player", cacheTime: 1800 },
  ],
  storage: {
    type: "redis",
    options: {
      client: redis,
      invalidation: { referencesTTL: 3600 },
    },
  },
  cacheTime: 1800,
  onError: (key) => {
    console.error("Prisma Middlewhere - Redis Error: ❌", key);
  },
});

prisma.$use(cacheMiddleware);

export default prisma;
