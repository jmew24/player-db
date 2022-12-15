import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import {
  AutoRacingResponse,
  AutoRacingPlayer,
  AutoRacingRoster,
} from "autoRacing";

import { fetchRequest } from "@factory/fetchRequest";
import cache from "@factory/cache";

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

const searchAutoRacing = async (query: string) => {
  const q = query.trim();
  const teams = cache.get("autoRacing:t") as Team[];
  const players = cache.get(`autoRacing:p:${q}`) as AutoRacingPlayer[];
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=autoRacing"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
    }
  }
  cache.set("autoRacing:t", teams);

  const response = (await fetchRequest(
    `/api/players?sport=autoRacing&query=${q}`
  )) as AutoRacingResponse[];

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
    } as AutoRacingPlayer);
  }

  return cache.set(`autoRacing:p:${q}`, players);
};

const searchAutoRacingTeam = async (query: string) => {
  const q = query.trim();
  const players = cache.get(`autoRacing:tp:${q}`) as AutoRacingPlayer[];
  if (players.length > 0) return players;

  const results = (await fetchRequest(
    `/api/teams?sport=autoRacing&query=${q}`,
    {
      timeout: 30000,
    }
  )) as AutoRacingRoster[];

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
      } as AutoRacingPlayer);
    }
  }

  return cache.set(`autoRacing:tp:${q}`, players);
};

export default function useGetAutoRacing(
  query: string,
  searchType: "player" | "team" = "player"
) {
  const { isFetching, isLoading, isError, error, data, refetch } = useQuery(
    ["searchAutoRacing", query],
    async () =>
      searchType === "player"
        ? await searchAutoRacing(query.toLowerCase())
        : await searchAutoRacingTeam(query.toLowerCase()),
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
