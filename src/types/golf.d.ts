import { Player, Sport, Team } from "@prisma/client";

declare type GolfResponse = Player & { team: Team; sport: Sport };
declare type GolfPlayer = PGAPlayer & { team: Team; sport: Sport };
declare type GolfRoster = Team & { sport: Sport; players: Player[] };
declare type GolfCache = { [key: string]: GolfPlayer[] };

declare interface GolfProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type GolfPosition = string;

declare type PGATeam = {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
};

declare type PGATeamRequest = {
  copyright: string;
  teams: PGATeam[];
};

declare type PGATeamsRequest = {
  results: PGATeam[];
};

declare type PGATeamResult = PGATeam[];

declare interface PGATeamProps {
  query: string;
}

declare type PGATeamFilter = {
  team: string;
};

declare type PGAPlayer = {
  id: string;
  updatedAt: Date | null;
  fullName: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  isPlayer: boolean;
  url: string;
  image: string;
  source: string;
};

declare type PGARequestPlayers = {
  playerProfile: PGAPlayer & { playerId: string };
  teamProfile: PGATeam;
};

declare type PGAPlayerRequest = {
  payload: {
    players: PGARequestPlayers[];
    error: {
      detail: string | null;
      isError: string | boolean;
      message: string | null;
    };
    timestamp: string;
  };
};

declare type PGARequest = {
  query: string;
  results: PGAPlayer[];
};

declare type PGAPlayerResult = PGAPlayer[];

declare type GolfPlayerFilter = {
  team: string;
  position: PGAPosition;
  league: string;
};
