declare interface SoccerProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type SoccerPosition = "C" | "F" | "C-F" | "F-C" | "G" | "F-G" | "";

declare type SoccerTeam = {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
};

declare type SoccerTeamRequest = {
  copyright: string;
  teams: SoccerTeam[];
};

declare type SoccerTeamsRequest = {
  results: SoccerTeam[];
};

declare type SoccerTeamResult = SoccerTeam[];

declare interface SoccerTeamProps {
  query: string;
}

declare type SoccerTeamFilter = {
  team: string;
};

declare type SoccerPlayer = {
  name: string;
  firstName: string;
  lastName: string;
  id: string;
  height: number;
  weight: number;
  age: number;
  isActive: boolean;
  playedPositions: string;
  playedPositionsShort: string;
  teamRegionName: string;
  regionCode: string;
  positionText: string;
  teamId: number;
  teamName: string;
  seasonId: number;
  seasonName: string;
  ranking: number;

  url: string;
  image: string;
  source: string;
};

declare type SoccerRequestPlayers = SoccerPlayer & { playerId: string };

declare type SoccerPlayerRequest = {
  playerTableStats: SoccerRequestPlayers[];
  paging: {
    currentPage: number;
    totalPages: number;
    resultsPerPage: number;
    totalResults: number;
    firstRecordIndex: number;
    lastRecordIndex: number;
  };
  statColumns: string[];
};

declare type SoccerRequest = {
  query: string;
  results: SoccerPlayer[];
};

declare type SoccerPlayerResult = SoccerPlayer[];

declare type SoccerPlayerFilter = {
  team: string;
  position: string;
};
