import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import {
  BasketballResponse,
  BasketballPlayer,
  BasketballRoster,
} from "basketball";

import { fetchRequest } from "@factory/fetchRequest";
import { teamCache, playerCache } from "@factory/cache";

const blankTeam: Team = {
  id: "-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  identifier: "-1",
  fullName: "Unknown",
  city: "Unknown",
  shortName: "Unknown",
  abbreviation: "Unknown",
  league: "Unknown",
  source: "Unknown",
  sportId: "-1",
};

const searchBasketball = async (query: string) => {
  const q = query.trim();
  const players = playerCache.get(`basketball:p:${q}`) as BasketballPlayer[];
  if (players.length > 0) return players;

  let teams = teamCache.get("basketball") as Team[];
  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=basketball"
    )) as Team[];

    for (const team of teamResponse) {
      teams = teamCache.add("basketball", team);
    }
  }

  const response = (await fetchRequest(
    `/api/players?sport=basketball&query=${q}`
  )) as BasketballResponse[];

  for (const item of response) {
    const team =
      teams.find((team) => team.identifier === item.team.identifier) ||
      item.team ||
      blankTeam;

    players.push({
      id: item.id,
      updatedAt: item.updatedAt,
      fullName: item.fullName,
      firstName: item.firstName,
      lastName: item.lastName,
      number: item.number,
      team: team,
      position: item.position,
      isPlayer: true,
      url: item.linkUrl,
      image: item.headshotUrl,
      source: item.source,
      sport: item.sport,
    } as BasketballPlayer);
  }

  return playerCache.set(`basketball:p:${q}`, players) as BasketballPlayer[];
};

const searchBasketballTeam = async (query: string) => {
  const q = query.trim();
  const players = playerCache.get(`basketball:t:${q}`) as BasketballPlayer[];
  if (players.length > 0) return players;

  const results = (await fetchRequest(
    `/api/teams?sport=basketball&query=${q}`,
    {
      timeout: 30000,
    }
  )) as BasketballRoster[];

  for (const result of results) {
    const team = {
      ...blankTeam,
      id: result.id,
      identifier: result.id,
      fullName: result.fullName,
      city: result.city,
      shortName: result.shortName,
      abbreviation: result.abbreviation,
      league: result.league,
      source: result.source,
      sportId: result.sport.id,
    } as Team;

    for (const item of result.players) {
      players.push({
        id: item.id,
        updatedAt: item.updatedAt,
        fullName: item.fullName,
        firstName: item.firstName,
        lastName: item.lastName,
        number: item.number,
        team: team,
        position: item.position,
        isPlayer: true,
        url: item.linkUrl,
        image: item.headshotUrl,
        source: item.source,
        sport: result.sport,
      } as BasketballPlayer);
    }
  }

  return playerCache.set(`basketball:t:${q}`, players) as BasketballPlayer[];
};

export default function useGetBasketball(
  query: string,
  searchType: "player" | "team" = "player"
) {
  const { isFetching, isLoading, isError, error, data, refetch } = useQuery(
    ["searchBasketball", query],
    async () =>
      searchType === "player"
        ? await searchBasketball(query.toLowerCase())
        : await searchBasketballTeam(query.toLowerCase()),
    { enabled: !!query }
  );

  return {
    isFetching,
    isLoading,
    isError,
    error,
    data,
    refetch,
  };
}
