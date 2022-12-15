import { Player, Sport, Team } from "@prisma/client";

declare type BaseballResponse = Player & { team: Team; sport: Sport };
declare type BaseballPlayer = MLBPlayer & { team: Team; sport: Sport };
declare type BaseballRoster = Team & { sport: Sport; players: Player[] };

declare interface BaseballProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type MLBPosition =
  | "P"
  | "C"
  | "1B"
  | "2B"
  | "SS"
  | "3B"
  | "RF"
  | "CF"
  | "LF"
  | "";

declare type MLBTeam = {
  id: number;
  name: string;
  teamCode: string;
  fileCode: string;
  abbreviation: string;
  teamName: string;
  locationName: string;
  shortName: string;
  franchiseName: string;
  clubName: string;
};

declare type MLBTeamRequest = {
  copyright: string;
  teams: MLBTeam[];
};

declare type MLBTeamsRequest = {
  results: MLBTeam[];
};

declare type MLBTeamResult = MLBTeam[];

declare interface MLBTeamProps {
  query: string;
}

declare type MLBTeamFilter = {
  team: string;
};

declare type MLBPlayer = {
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

declare type MLBResult = {
  id: number;
  currentTeam: {
    id: number;
  };
  fullName: string;
  firstName: string;
  lastName: string;
  isPlayer: boolean;
  primaryNumber: string;
  primaryPosition: {
    name: string;
    abbreviation: string;
  };
};

declare type BaseballSavantResult = {
  name: string;
  id: string;
  is_player: number;
  mlb: number;
  league: string;
  first: string;
  is_prospect: number;
  parent_team: string;
  pos: BaseballSavantPosition;
  rank: string;
  last_year: string;
  name_display_club: string;
  url: string;
};

declare type BaseballSavantRequest = BaseballSavantResult[];

declare type MLBPlayerRequest = {
  copyright: string;
  people: MLBResult[];
};

declare type MLBRequest = {
  query: string;
  mlbResults: BaseballPlayer[];
  baseballSavantResults: BaseballPlayer[];
};

declare type MLBPlayerResult = MLBPlayer[];

declare type MLBPlayerFilter = {
  team: string;
  position: MLBPosition;
  league: string;
};
