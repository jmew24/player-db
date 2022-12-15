import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import { SoccerResponse, SoccerPlayer, SoccerRoster } from "soccer";

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

const searchSoccer = async (query: string) => {
  const q = query.trim();
  const teams = cache.get("soccer:t") as Team[];
  const players = cache.get(q) as SoccerPlayer[];
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=soccer"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
    }
  }
  cache.set("soccer:t", teams);

  const response = (await fetchRequest(
    `/api/players?sport=soccer&query=${q}`
  )) as SoccerResponse[];

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
      url: item.linkUrl,
      image: item.headshotUrl,
      source: item.source,
      sport: item.sport,
    } as SoccerPlayer);
  }

  return cache.set(`soccer:p:${q}`, players);
};

const searchSoccerTeam = async (query: string) => {
  const q = query.trim();
  const players = cache.get(`soccer:tp:${q}`) as SoccerPlayer[];
  if (players.length > 0) return players;

  const results = (await fetchRequest(`/api/teams?sport=soccer&query=${q}`, {
    timeout: 30000,
  })) as SoccerRoster[];

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
      } as SoccerPlayer);
    }
  }

  return cache.set(`soccer:tp:${q}`, players);
};

export default function useGetSoccer(
  query: string,
  searchType: "player" | "team" = "player"
) {
  const { isFetching, isLoading, isError, error, data, refetch } = useQuery(
    ["searchSoccer", query],
    async () =>
      searchType === "player"
        ? await searchSoccer(query.toLowerCase())
        : await searchSoccerTeam(query.toLowerCase()),
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
