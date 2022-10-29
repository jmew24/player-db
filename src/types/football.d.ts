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
  | "OLB"
  | "CB"
  | "FS"
  | "SS"
  | "K"
  | "P"
  | "";

declare type NFLTeam = {
  name: string;
  abbreviation: string;
  team: string;
};

declare type NFLTeamFilter = {
  team: string;
};

declare type NFLPlayer = {
  id: number;
  assetname: string;
  fullNameForSearch: string;
  firstName: string;
  lastName: string;
  jerseyNum: number;
  position: string;
  portraitId: number;
  team: NFLTeam;
  url: string;
  image: string;
  source: string;
};

declare type NFLRequestPlayers = {
  primaryKey: number;
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
  position: string;
};
