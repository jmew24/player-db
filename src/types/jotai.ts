import { BaseballPlayer, MLBPosition } from "./baseball";
import { BasketballPlayer, NBAPosition } from "basketball";
import { FootballPlayer, NFLPosition } from "football";
import { HockeyPlayer, NHLPosition } from "hockey";
import { SoccerPlayer, SoccerPosition } from "soccer";
import { TennisPlayer, TennisPosition } from "tennis";
import { AutoRacingPlayer, AutoRacingPosition } from "autoRacing";

export type SearchType = "player" | "team";

export type Filter =
  | "all"
  | "baseball"
  | "basketball"
  | "football"
  | "hockey"
  | "soccer"
  | "tennis"
  | "autoRacing";

export type BaseJOTAI = {
  show: boolean;
  team: string;
  league: string;
};

export type Baseball = BaseJOTAI & {
  position: MLBPosition;
  items: BaseballPlayer[];
};

export type Basketball = BaseJOTAI & {
  position: NBAPosition;
  items: BasketballPlayer[];
};

export type Football = BaseJOTAI & {
  position: NFLPosition;
  items: FootballPlayer[];
};

export type Hockey = BaseJOTAI & {
  position: NHLPosition;
  items: HockeyPlayer[];
};

export type Soccer = BaseJOTAI & {
  position: SoccerPosition;
  items: SoccerPlayer[];
};

export type Tennis = BaseJOTAI & {
  position: TennisPosition;
  items: TennisPlayer[];
};

export type AutoRacing = BaseJOTAI & {
  position: AutoRacingPosition;
  items: AutoRacingPlayer[];
};

export type ItemCount = {
  baseball: number;
  basketball: number;
  football: number;
  hockey: number;
  soccer: number;
};
