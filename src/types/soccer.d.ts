import { Player, Sport, Team } from "@prisma/client";

declare type SoccerResponse = Player & { team: Team; sport: Sport };
declare type SoccerPlayer = SoccerPlayerBase & { team: Team; sport: Sport };
declare type SoccerCache = { [key: string]: SoccerPlayer[] };
declare interface SoccerProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type SoccerPosition = "C" | "F" | "C-F" | "F-C" | "G" | "F-G" | "";

declare type SoccerPlayerBase = {
  id: string;
  updatedAt: Date | null;
  fullName: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  url: string;
  image: string;
  source: string;
};

declare type SoccerPlayerFilter = {
  team: string;
  position: string;
  league: string;
};
