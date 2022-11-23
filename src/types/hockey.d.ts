import { Player, Sport, Team } from "@prisma/client";

declare type HockeyResponse = Player & { team: Team; sport: Sport };
declare type HockeyPlayer = NHLPlayer & { team: Team; sport: Sport };
declare type HockeyCache = { [key: string]: HockeyPlayer[] };

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
  results: NHLTeam[];
};

declare type NHLTeamResult = NHLTeam[];

declare interface NHLTeamProps {
  query: string;
}

declare type NHLPosition = "F" | "C" | "RW" | "LW" | "D" | "G" | "Staff" | "";
declare type NHLTypes = "player" | "staff" | "";

declare type NHLPlayer = {
  id: string;
  updatedAt: Date | null;
  fullName: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  isPlayer: boolean;
  _type: NHLTypes;
  experience: string;
  url: string;
  image: string;
  source: string;
};

declare type NHLPlayerResult = {
  suggestions: [
    {
      person: {
        id: string;
        otherNames: {
          firstLastNameRoman: string;
          slug: string;
        };
        fullName: string;
        firstName: string;
        lastName: lastName;
      };
      team: {
        abbreviation: string;
        locationName: string;
        name: string;
        teamName: string;
      };
      position: {
        abbreviation: string;
        code: string;
        type: string;
        name: string;
      };
      type: string;
      jerseyNumber: string;
    }
  ];
};

declare type NHLPlayerFilter = {
  position: NHLPosition;
  team: string;
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
  position: string;
  season: string;
  team: string;
  verified: string;
  verifiedHidden: string;
  league: string;
  experience: string;
  _type: NHLTypes;
  url: string;
};
