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
  results: MLBTeam[] | null;
};

declare type MLBTeamResult = MLBTeam[];

declare interface MLBTeamProps {
  query: string;
}

declare type MLBTeamFilter = {
  team: string;
};

declare type MLBPlayer = {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  primaryNumber: string;
  team: MLBTeam;
  primaryPosition: {
    name: string;
    abbreviation: MLBPosition;
  };
  isPlayer: boolean;
  url: string;
  image: string;
  source: string;
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

declare type MLBPlayerRequest = {
  copyright: string;
  people: MLBPlayer[];
};

declare type MLBRequest = {
  query: string;
  results: MLBPlayer[];
};

declare type MLBPlayerResult = MLBPlayer[];

declare type MLBPlayerFilter = {
  team: string;
  position: string;
};
