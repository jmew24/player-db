declare interface HockeyProps {
  query: string;
}

declare type NHLPosition = "C" | "R" | "L" | "D" | "G" | "";

declare type NHLPlayer = {
  id: number;
  first_name: string;
  last_name: string;
  birthplace: string;
  birth_state: string;
  birth_country: string;
  birth_date: string;
  team: string;
  position: NHLPosition;
  number: number;
  url: string;
  image: string;
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
