const baseballRequest: MLBRequest = {
  query: "",
  results: [] as MLBPlayer[],
};

const baseballTeamRequest: MLBTeamsRequest = {
  results: null,
};

const hockeyRequest: NHLRequest = {
  query: "",
  results: [] as NHLPlayer[],
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
