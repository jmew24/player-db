declare interface BasketballProps {
  query: string;
  setShow: Dispatch<SetStateAction<SearchShowSport>>;
}

declare type NBAPosition = "C" | "F" | "C-F" | "F-C" | "G" | "F-G" | "";

declare type NBATeam = {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
};

declare type NBATeamRequest = {
  copyright: string;
  teams: NBATeam[];
};

declare type NBATeamsRequest = {
  results: NBATeam[];
};

declare type NBATeamResult = NBATeam[];

declare interface NBATeamProps {
  query: string;
}

declare type NBATeamFilter = {
  team: string;
};

declare type NBAPlayer = {
  id: string;
  code: string;
  displayName: string;
  firstName: string;
  lastName: string;
  jerseyNo: string;
  position: string;
  team: NBATeam;
  url: string;
  image: string;
  source: string;
};

declare type NBARequestPlayers = {
  playerProfile: NBAPlayer & { playerId: string };
  teamProfile: NBATeam;
};

declare type NBAPlayerRequest = {
  payload: {
    players: NBARequestPlayers[];
    error: {
      detail: string | null;
      isError: string | boolean;
      message: string | null;
    };
    timestamp: string;
  };
};

declare type NBARequest = {
  query: string;
  results: NBAPlayer[];
};

declare type NBAPlayerResult = NBAPlayer[];

declare type NBAPlayerFilter = {
  team: string;
  position: string;
};
