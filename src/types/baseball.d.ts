declare interface BaseballProps {
  query: string;
}

declare type BaseballSavantPosition =
  | "RHP"
  | "LHP"
  | "TWP"
  | "C"
  | "1B"
  | "2B"
  | "SS"
  | "3B"
  | "RF"
  | "CF"
  | "LF"
  | "";

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

declare type BaseballSavantFilter = {
  position: BaseballSavantPosition;
  team: string;
};
