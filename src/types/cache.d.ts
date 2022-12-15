import { Team, Player, Sport } from "@prisma/client";

import { BaseballPlayer } from "baseball";
import { BasketballPlayer } from "basketball";
import { FootballPlayer } from "football";
import { HockeyPlayer } from "hockey";
import { SoccerPlayer } from "soccer";
import { TennisPlayer } from "tennis";
import { AutoRacingPlayer } from "autoRacing";
import { GolfPlayer } from "golf";

declare type CachePlayer = Player & { team: Team; sport: Sport };

declare type CachedPlayers =
  | CachePlayer[]
  | BaseballPlayer[]
  | BasketballPlayer[]
  | FootballPlayer[]
  | HockeyPlayer[]
  | SoccerPlayer[]
  | TennisPlayer[]
  | AutoRacingPlayer[]
  | GolfPlayer[];

declare type CachedTeams = Team[];
