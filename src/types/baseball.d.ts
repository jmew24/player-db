declare interface BaseballProps {
  query: string;
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
  allStarStatus: string;
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
  active: boolean;
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
  link: string;
  firstName: string;
  lastName: string;
  primaryNumber: string;
  currentAge: number;
  birthCity: string;
  birthStateProvince: string;
  birthCountry: string;
  active: boolean;
  currentTeam: {
    id: number;
    link: string;
    name: string;
  };
  primaryPosition: {
    name: string;
    abbreviation: MLBPosition;
  };
  isPlayer: boolean;
  url: string;
  image: string;
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
