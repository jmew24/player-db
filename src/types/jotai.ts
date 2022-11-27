import { BaseballPlayer } from "./baseball";
import { BasketballPlayer } from "basketball";
import { FootballPlayer } from "football";
import { HockeyPlayer } from "hockey";
import { SoccerPlayer } from "soccer";

export type Filter = {
  baseball: boolean;
  basketball: boolean;
  football: boolean;
  hockey: boolean;
  soccer: boolean;
};

export type Baseball = {
  show: boolean;
  debouncedShow: boolean;
  items: BaseballPlayer[];
};

export type Basketball = {
  show: boolean;
  debouncedShow: boolean;
  items: BasketballPlayer[];
};

export type Football = {
  show: boolean;
  debouncedShow: boolean;
  items: FootballPlayer[];
};

export type Hockey = {
  show: boolean;
  debouncedShow: boolean;
  items: HockeyPlayer[];
};

export type Soccer = {
  show: boolean;
  debouncedShow: boolean;
  items: SoccerPlayer[];
};

export type ItemCount = {
  baseball: number;
  basketball: number;
  football: number;
  hockey: number;
  soccer: number;
};
