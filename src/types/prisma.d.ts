declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

declare type Sport =
  | "UNKNOWN"
  | "BASEBALL"
  | "BASKETBALL"
  | "FOOTBALL"
  | "HOCKEY"
  | "SOCCER";
