import { Team } from "@prisma/client";

import { BaseballPlayer } from "baseball";
import { BasketballPlayer } from "basketball";
import { FootballPlayer } from "football";
import { HockeyPlayer } from "hockey";
import { SoccerPlayer } from "soccer";
import { TennisPlayer } from "tennis";
import { AutoRacingPlayer } from "autoRacing";
import { GolfPlayer } from "golf";

type CacheValue =
  | Team[]
  | BaseballPlayer[]
  | BasketballPlayer[]
  | FootballPlayer[]
  | HockeyPlayer[]
  | SoccerPlayer[]
  | TennisPlayer[]
  | AutoRacingPlayer[]
  | GolfPlayer[];

// Create a class for the cache
class Cache {
  // Create a private map to store the cache values
  private cache = new Map<string, CacheValue>();

  // Create a method to set a value in the cache and return the array
  set(key: string, value: CacheValue) {
    this.cache.set(key, value);
    return value;
  }

  // Create a method to get a value from the cache
  get(key: string): CacheValue | [] {
    return this.cache.get(key) || [];
  }
}

// Create a new cache instance
const cache = new Cache();

// Export the cache instance
export { cache };

export default cache;
