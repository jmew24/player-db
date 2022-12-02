import { Team } from "@prisma/client";

import { BaseballPlayer, BaseballCache } from "baseball";
import { BasketballPlayer, BasketballCache } from "basketball";
import { FootballPlayer, FootballCache } from "football";
import { HockeyPlayer, HockeyCache } from "hockey";
import { SoccerPlayer, SoccerCache } from "soccer";
import { TennisPlayer, TennisCache } from "tennis";
import { AutoRacingPlayer, AutoRacingCache } from "autoRacing";

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

const basketballTeamRequest = [] as Team[];

export const getBasketballTeamCache = () => basketballTeamRequest;

export const addBasketballTeamCache = (team: Team) => {
  basketballTeamRequest.push(team);
  return basketballTeamRequest;
};

export const basketballTeamCache = {
  get: getBasketballTeamCache,
  add: addBasketballTeamCache,
};

const basketballRequest = {} as BasketballCache;

export const getBasketballCache = (query: string) => {
  const cached = basketballRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as BasketballPlayer[];
  }
};

export const setBasketballCache = (
  query: string,
  results: BasketballPlayer[]
) => {
  const q = query.toLowerCase().trim();
  basketballRequest[q] = results;

  return basketballRequest[q];
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

const soccerTeamRequest = [] as Team[];

export const getSoccerTeamCache = () => soccerTeamRequest;

export const addSoccerTeamCache = (team: Team) => {
  soccerTeamRequest.push(team);
  return soccerTeamRequest;
};

export const soccerTeamCache = {
  get: getSoccerTeamCache,
  add: addSoccerTeamCache,
};

const soccerRequest = {} as SoccerCache;

export const getSoccerCache = (query: string) => {
  const cached = soccerRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as SoccerPlayer[];
  }
};

export const setSoccerCache = (query: string, results: SoccerPlayer[]) => {
  const q = query.toLowerCase().trim();
  soccerRequest[q] = results;

  return soccerRequest[q];
};

export const soccerCache = {
  get: getSoccerCache,
  set: setSoccerCache,
};

const tennisTeamRequest = [] as Team[];

export const getTennisTeamCache = () => tennisTeamRequest;

export const addTennisTeamCache = (team: Team) => {
  tennisTeamRequest.push(team);
  return tennisTeamRequest;
};

export const tennisTeamCache = {
  get: getTennisTeamCache,
  add: addTennisTeamCache,
};

const tennisRequest = {} as TennisCache;

export const getTennisCache = (query: string) => {
  const cached = tennisRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as TennisPlayer[];
  }
};

export const setTennisCache = (query: string, results: TennisPlayer[]) => {
  const q = query.toLowerCase().trim();
  tennisRequest[q] = results;

  return tennisRequest[q];
};

export const tennisCache = {
  get: getTennisCache,
  set: setTennisCache,
};

const autoRacingTeamRequest = [] as Team[];

export const getAutoRacingTeamCache = () => autoRacingTeamRequest;

export const addAutoRacingTeamCache = (team: Team) => {
  autoRacingTeamRequest.push(team);
  return autoRacingTeamRequest;
};

export const autoRacingTeamCache = {
  get: getAutoRacingTeamCache,
  add: addAutoRacingTeamCache,
};

const autoRacingRequest = {} as AutoRacingCache;

export const getAutoRacingCache = (query: string) => {
  const cached = autoRacingRequest[query.toLowerCase().trim()];
  if (cached) {
    return cached;
  } else {
    return [] as AutoRacingPlayer[];
  }
};

export const setAutoRacingCache = (
  query: string,
  results: AutoRacingPlayer[]
) => {
  const q = query.toLowerCase().trim();
  autoRacingRequest[q] = results;

  return autoRacingRequest[q];
};

export const autoRacingCache = {
  get: getAutoRacingCache,
  set: setAutoRacingCache,
};
