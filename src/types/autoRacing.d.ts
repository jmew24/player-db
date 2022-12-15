import { Player, Sport, Team } from "@prisma/client";

declare type AutoRacingResponse = Player & { team: Team; sport: Sport };
declare type AutoRacingPlayer = RacingPlayer & { team: Team; sport: Sport };
declare type AutoRacingRoster = Team & { sport: Sport; players: Player[] };

declare interface AutoRacingProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type AutoRacingPosition = string;

declare type AutoRacingTeam = {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
};

declare type AutoRacingTeamRequest = {
  copyright: string;
  teams: AutoRacingTeam[];
};

declare type AutoRacingTeamsRequest = {
  results: AutoRacingTeam[];
};

declare type AutoRacingTeamResult = AutoRacingTeam[];

declare interface AutoRacingTeamProps {
  query: string;
}

declare type AutoRacingTeamFilter = {
  team: string;
};

declare type RacingPlayer = {
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

declare type AutoRacingRequestPlayers = {
  playerProfile: RacingPlayer & { playerId: string };
  teamProfile: AutoRacingTeam;
};

declare type AutoRacingPlayerRequest = {
  payload: {
    players: AutoRacingRequestPlayers[];
    error: {
      detail: string | null;
      isError: string | boolean;
      message: string | null;
    };
    timestamp: string;
  };
};

declare type AutoRacingRequest = {
  query: string;
  results: RacingPlayer[];
};

declare type AutoRacingPlayerResult = RacingPlayer[];

declare type AutoRacingPlayerFilter = {
  team: string;
  position: AutoRacingPosition;
  league: string;
};
