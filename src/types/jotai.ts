import { BaseballPlayer } from "./baseball";
import { BasketballPlayer } from "basketball";
import { FootballPlayer } from "football";
import { HockeyPlayer } from "hockey";
import { SoccerPlayer } from "soccer";

export type Filter =
  | "all"
  | "baseball"
  | "basketball"
  | "football"
  | "hockey"
  | "soccer";

export type Baseball = {
  show: boolean;
  items: BaseballPlayer[];
};

export type Basketball = {
  show: boolean;
  items: BasketballPlayer[];
};

export type Football = {
  show: boolean;
  items: FootballPlayer[];
};

export type Hockey = {
  show: boolean;
  items: HockeyPlayer[];
};

export type Soccer = {
  show: boolean;
  items: SoccerPlayer[];
};

export type ItemCount = {
  baseball: number;
  basketball: number;
  football: number;
  hockey: number;
  soccer: number;
};
