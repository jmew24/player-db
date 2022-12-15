import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import { GolfResponse, GolfPlayer, GolfRoster } from "golf";

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

const searchGolf = async (query: string) => {
  const q = query.trim();
  const teams = teamCache.get("golf") as Team[];
  const players = playerCache.get(`golf:p:${q}`) as GolfPlayer[];
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=golf"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
    }
  }
  teamCache.set("golf", teams);

  const response = (await fetchRequest(
    `/api/players?sport=golf&query=${q}`
  )) as GolfResponse[];

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
    } as GolfPlayer);
  }

  return playerCache.set(`golf:p:${q}`, players) as GolfPlayer[];
};

const searchGolfTeam = async (query: string) => {
  const q = query.trim();
  const players = playerCache.get(`golf:t:${q}`) as GolfPlayer[];
  if (players.length > 0) return players;

  const results = (await fetchRequest(`/api/teams?sport=golf&query=${q}`, {
    timeout: 30000,
  })) as GolfRoster[];

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
      } as GolfPlayer);
    }
  }

  return playerCache.set(`golf:t:${q}`, players) as GolfPlayer[];
};

export default function useGetGolf(
  query: string,
  searchType: "player" | "team" = "player"
) {
  const { isFetching, isLoading, isError, error, data, refetch } = useQuery(
    ["searchGolf", query],
    async () =>
      searchType === "player"
        ? await searchGolf(query.toLowerCase())
        : await searchGolfTeam(query.toLowerCase()),
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
