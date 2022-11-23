import { Player, Sport, Team } from "@prisma/client";

declare type BasketballResponse = Player & { team: Team; sport: Sport };
declare type BasketballPlayer = NBAPlayer & { team: Team; sport: Sport };
declare type BasketballCache = { [key: string]: BasketballPlayer[] };

declare interface BasketballProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type NBAPosition = "C" | "F" | "C-F" | "F-C" | "G" | "F-G" | "";

declare type NBATeam = {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
};

declare type NBATeamRequest = {
  copyright: string;
  teams: NBATeam[];
};

declare type NBATeamsRequest = {
  results: NBATeam[];
};

declare type NBATeamResult = NBATeam[];

declare interface NBATeamProps {
  query: string;
}

declare type NBATeamFilter = {
  team: string;
};

declare type NBAPlayer = {
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

declare type NBARequestPlayers = {
  playerProfile: NBAPlayer & { playerId: string };
  teamProfile: NBATeam;
};

declare type NBAPlayerRequest = {
  payload: {
    players: NBARequestPlayers[];
    error: {
      detail: string | null;
      isError: string | boolean;
      message: string | null;
    };
    timestamp: string;
  };
};

declare type NBARequest = {
  query: string;
  results: NBAPlayer[];
};

declare type NBAPlayerResult = NBAPlayer[];

declare type NBAPlayerFilter = {
  team: string;
  position: string;
};
