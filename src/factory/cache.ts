const baseballRequest: MLBRequest = {
  query: "",
  mlbResults: [] as MLBPlayer[],
  baseballSavantResults: [] as MLBPlayer[],
};

const baseballTeamRequest: MLBTeamsRequest = {
  results: [] as MLBTeam[],
};

export const getBaseballCache = (query: string) => {
  if (
    query.toLowerCase().trim() === baseballRequest.query.toLowerCase().trim()
  ) {
    return {
      lastQuery: baseballRequest.query,
      mlbResults: baseballRequest.mlbResults,
      baseballSavantResults: baseballRequest.baseballSavantResults,
    } as MLBCache;
  }

  return {
    lastQuery: baseballRequest.query,
    mlbResults: baseballRequest.mlbResults,
    baseballSavantResults: [],
  } as MLBCache;
};

export const setBaseballCache = (
  query: string,
  mlb: MLBPlayer[],
  baseballSavant: MLBPlayer[]
) => {
  baseballRequest.query = query.toLowerCase().trim();
  baseballRequest.mlbResults = mlb;
  baseballRequest.baseballSavantResults = baseballSavant;

  return [
    ...baseballRequest.mlbResults,
    ...baseballRequest.baseballSavantResults,
  ];
};

export const baseballCache = {
  get: getBaseballCache,
  set: setBaseballCache,
};

export const getBaseballTeamCache = () => {
  return baseballTeamRequest.results;
};

export const setBaseballTeamCache = (results: MLBTeam[]) => {
  baseballTeamRequest.results = results;

  return baseballTeamRequest.results;
};

export const baseballTeamCache = {
  get: getBaseballTeamCache,
  set: setBaseballTeamCache,
};

const hockeyRequest: NHLRequest = {
  query: "",
  results: [] as NHLPlayer[],
};

const hockeyTeamRequest: NHLTeamsRequest = {
  results: [] as NHLTeam[],
};

export const getHockeyCache = (query: string) => {
  if (query === hockeyRequest.query) {
    return hockeyRequest.results;
  } else {
    return [] as NHLPlayer[];
  }
};

export const setHockeyCache = (query: string, results: NHLPlayer[]) => {
  hockeyRequest.query = query;
  hockeyRequest.results = results;

  return hockeyRequest.results;
};

export const hockeyCache = {
  get: getHockeyCache,
  set: setHockeyCache,
};

export const getHockeyTeamCache = () => {
  return hockeyTeamRequest.results;
};

export const setHockeyTeamCache = (results: NHLTeam[]) => {
  hockeyTeamRequest.results = results;

  return hockeyTeamRequest.results;
};

export const hockeyTeamCache = {
  get: getHockeyTeamCache,
  set: setHockeyTeamCache,
};

const basketballRequest: NBARequest = {
  query: "",
  results: [] as NBAPlayer[],
};

export const getBasketballCache = (query: string) => {
  if (query === basketballRequest.query) {
    return basketballRequest.results;
  } else {
    return [] as NBAPlayer[];
  }
};

export const setBasketballCache = (query: string, results: NBAPlayer[]) => {
  basketballRequest.query = query;
  basketballRequest.results = results;

  return basketballRequest.results;
};

export const basketballCache = {
  get: getBasketballCache,
  set: setBasketballCache,
};

const footballRequest: NFLRequest = {
  query: "",
  results: [] as NFLPlayer[],
};

export const getFootballCache = (query: string) => {
  if (query === footballRequest.query) {
    return footballRequest.results;
  } else {
    return [] as NFLPlayer[];
  }
};

export const setFootballCache = (query: string, results: NFLPlayer[]) => {
  footballRequest.query = query;
  footballRequest.results = results;

  return footballRequest.results;
};

export const footballCache = {
  get: getFootballCache,
  set: setFootballCache,
};
