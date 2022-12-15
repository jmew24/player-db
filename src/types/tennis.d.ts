import { Player, Sport, Team } from "@prisma/client";

declare type TennisResponse = Player & { team: Team; sport: Sport };
declare type TennisPlayer = ATPPlayer & { team: Team; sport: Sport };
declare type TennisRoster = Team & { sport: Sport; players: Player[] };

declare interface TennisProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type TennisPosition = string;

declare type ATPTeam = {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
};

declare type ATPTeamRequest = {
  copyright: string;
  teams: ATPTeam[];
};

declare type ATPTeamsRequest = {
  results: ATPTeam[];
};

declare type ATPTeamResult = ATPTeam[];

declare interface ATPTeamProps {
  query: string;
}

declare type ATPTeamFilter = {
  team: string;
};

declare type ATPPlayer = {
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

declare type ATPRequestPlayers = {
  playerProfile: ATPPlayer & { playerId: string };
  teamProfile: ATPTeam;
};

declare type ATPPlayerRequest = {
  payload: {
    players: ATPRequestPlayers[];
    error: {
      detail: string | null;
      isError: string | boolean;
      message: string | null;
    };
    timestamp: string;
  };
};

declare type ATPRequest = {
  query: string;
  results: ATPPlayer[];
};

declare type ATPPlayerResult = ATPPlayer[];

declare type TennisPlayerFilter = {
  team: string;
  position: ATPPosition;
  league: string;
};
