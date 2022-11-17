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

declare type Team = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  city: string;
  abbreviation: string;
  shortName: string;
  sport: Sport;
  league: string;
  players: Player[];
};

declare type Player = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  fullName: string;
  position: string;
  teamId: string;
  team: Team;
  logoUrl: string;
  linkUrl: string;
};
