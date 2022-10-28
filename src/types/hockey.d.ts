declare interface HockeyProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type NHLTeam = {
  id: number;
  name: string;
  abbreviation: string;
  teamName: string;
  shortName: string;
};

declare type NHLTeamRequest = {
  copyright: string;
  teams: NHLTeam[];
};

declare type NHLTeamsRequest = {
  results: NHLTeam[] | null;
};

declare type NHLTeamResult = NHLTeam[];

declare interface NHLTeamProps {
  query: string;
}

declare type NHLPosition = "F" | "C" | "RW" | "LW" | "D" | "G" | "Staff" | "";
declare type NHLTypes = "player" | "staff" | "";

declare type NHLPlayer = {
  id: number;
  firstName: string;
  lastName: string;
  team: NHLTeam;
  position: NHLPosition;
  number: number;
  experience: string;
  _type: NHLTypes;
  url: string;
  image: string;
  source: string;
};

declare type NHLFilter = {
  position: NHLPosition;
  team: string;
};

declare type NHLRequest = {
  query: string;
  results: NHLPlayer[];
};

declare type NHLResult = NHLPlayer[];

declare interface NHLProps {
  query: string;
}

declare type EliteProspectsResult = {
  age: string;
  country: string;
  fullname: string;
  id: string;
  matches: [number, number][];
  position: NHLPosition;
  season: string;
  team: string;
  verified: string;
  verifiedHidden: string;
  league: string;
  experience: string;
  _type: NHLTypes;
  url: string;
};
