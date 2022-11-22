import { Team } from "@prisma/client";

import { BaseballPlayer, BaseballCache } from "baseball";
import { FootballPlayer, FootballCache } from "football";
import { HockeyPlayer, HockeyCache } from "hockey";

const proxyCache = new Map<string, unknown>();

export function getProxyCache(query: string) {
  return proxyCache.get(query);
}

export function setProxyCache(query: string, value: unknown) {
  proxyCache.set(query, value);
  return value;
}

const baseballTeamRequest = [] as Team[];

export const getBaseballTeamCache = () => baseballTeamRequest;

export const addBaseballTeamCache = (team: Team) => {
  baseballTeamRequest.push(team);
  return baseballTeamRequest;
};

export const baseballTeamCache = {
  get: getBaseballTeamCache,
  add: addBaseballTeamCache,
};

const baseballRequest = {} as BaseballCache;

export const getBaseballCache = (query: string) => {
  const cached = baseballRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as BaseballPlayer[];
  }
};

export const setBaseballCache = (query: string, results: BaseballPlayer[]) => {
  const q = query.toLowerCase().trim();
  baseballRequest[q] = results;

  return baseballRequest[q];
};

export const baseballCache = {
  get: getBaseballCache,
  set: setBaseballCache,
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

const footballTeamRequest = [] as Team[];

export const getFootballTeamCache = () => footballTeamRequest;

export const addFootballTeamCache = (team: Team) => {
  footballTeamRequest.push(team);
  return footballTeamRequest;
};

export const footballTeamCache = {
  get: getFootballTeamCache,
  add: addFootballTeamCache,
};

const footballRequest = {} as FootballCache;

export const getFootballCache = (query: string) => {
  const cached = footballRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as FootballPlayer[];
  }
};

export const setFootballCache = (query: string, results: FootballPlayer[]) => {
  const q = query.toLowerCase().trim();
  footballRequest[q] = results;

  return footballRequest[q];
};

export const footballCache = {
  get: getFootballCache,
  set: setFootballCache,
};

const hockeyTeamRequest = [] as Team[];

export const getHockeyTeamCache = () => hockeyTeamRequest;

export const addHockeyTeamCache = (team: Team) => {
  hockeyTeamRequest.push(team);
  return hockeyTeamRequest;
};

export const hockeyTeamCache = {
  get: getHockeyTeamCache,
  add: addHockeyTeamCache,
};

const hockeyRequest = {} as HockeyCache;

export const getHockeyCache = (query: string) => {
  const cached = hockeyRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as HockeyPlayer[];
  }
};

export const setHockeyCache = (query: string, results: HockeyPlayer[]) => {
  const q = query.toLowerCase().trim();
  hockeyRequest[q] = results;

  return hockeyRequest[q];
};

export const hockeyCache = {
  get: getHockeyCache,
  set: setHockeyCache,
};

const soccerRequest: SoccerRequest = {
  query: "",
  results: [] as SoccerPlayer[],
};

export const getSoccerCache = (query: string) => {
  if (query === soccerRequest.query) {
    return soccerRequest.results;
  } else {
    return [] as SoccerPlayer[];
  }
};

export const setSoccerCache = (query: string, results: SoccerPlayer[]) => {
  soccerRequest.query = query;
  soccerRequest.results = results;

  return soccerRequest.results;
};

export const soccerCache = {
  get: getSoccerCache,
  set: setSoccerCache,
};
