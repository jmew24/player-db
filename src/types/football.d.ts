import { Player, Sport, Team } from "@prisma/client";

declare type FootballResponse = Player & { team: Team; sport: Sport };
declare type FootballPlayer = NFLPlayer & { team: Team; sport: Sport };
declare type FootballRoster = Team & { sport: Sport; players: Player[] };

declare interface FootballProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type NFLPosition =
  | "QB"
  | "C"
  | "OG"
  | "FB"
  | "HB"
  | "WR"
  | "TE"
  | "LT"
  | "RT"
  | "DE"
  | "DT"
  | "MLB"
  | "ROLB"
  | "OLB"
  | "LOLB"
  | "CB"
  | "FS"
  | "SS"
  | "K"
  | "P"
  | "";

declare type NFLTeam = {
  name: string;
  abbreviation: string;
  teamName: string;
};

declare type NFLTeamFilter = {
  team: string;
};

declare type NFLCBSPlayer = {
  playerId: number;
  playerFirstName: string;
  playerLastName: string;
  playerLeagueAbbreviation: string;
  playerPosition: string;
  playerSlug: string;
  teamAbbreviation: string;
};

declare type NFLPlayer = {
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

declare type NFLRequestPlayers = {
  primaryKey: string;
  plyrAssetname: string;
  fullNameForSearch: string;
  firstName: string;
  lastName: string;
  jerseyNum: number;
  position: string;
  plyrPortrait: number;
  team: string;
  teamId: number;
};

declare type NFLCBSRequest = {
  results: NFLCBSPlayer[];
  hasMore: boolean;
};

declare type NFLPlayerRequest = {
  count: number;
  docs: NFLRequestPlayers[];
};

declare type NFLRequest = {
  query: string;
  results: NFLPlayer[];
};

declare type NFLPlayerResult = NFLPlayer[];

declare type NFLPlayerFilter = {
  team: string;
  position: NFLPosition;
  league: string;
};
