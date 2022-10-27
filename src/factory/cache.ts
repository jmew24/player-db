import { BaseballSavantResult } from "../component/Baseball";
import { EliteProspectsResult } from "../component/Hockey";

const baseballRequest = {
  query: "",
  results: [] as BaseballSavantResult[],
};

const hockeyRequest = {
  query: "",
  results: [] as EliteProspectsResult[],
};

export const getBaseballCache = (query: string) => {
  if (query === baseballRequest.query) {
    return baseballRequest.results;
  } else {
    return [];
  }
};

export const setBaseballCache = (
  query: string,
  results: BaseballSavantResult[]
) => {
  baseballRequest.query = query;
  baseballRequest.results = results;

  return baseballRequest.results;
};

export const baseballCache = {
  get: getBaseballCache,
  set: setBaseballCache,
};

export const getHockeyCache = (query: string) => {
  if (query === hockeyRequest.query) {
    return hockeyRequest.results;
  } else {
    return [];
  }
};

export const setHockeyCache = (
  query: string,
  results: EliteProspectsResult[]
) => {
  hockeyRequest.query = query;
  hockeyRequest.results = results;

  return hockeyRequest.results;
};

export const hockeyCache = {
  get: getHockeyCache,
  set: setHockeyCache,
};
