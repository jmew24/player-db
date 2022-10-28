const baseballRequest: MLBRequest = {
  query: "",
  results: [] as MLBPlayer[],
};

const baseballTeamRequest: MLBTeamsRequest = {
  results: null,
};

export const getBaseballCache = (query: string) => {
  if (query === baseballRequest.query) {
    return baseballRequest.results;
  } else {
    return null;
  }
};

export const setBaseballCache = (query: string, results: MLBPlayer[]) => {
  baseballRequest.query = query;
  baseballRequest.results = results;

  return baseballRequest.results;
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
  results: null,
};

export const getHockeyCache = (query: string) => {
  if (query === hockeyRequest.query) {
    return hockeyRequest.results;
  } else {
    return null;
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
    return null;
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
