import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import {
  BaseballResponse,
  BaseballPlayer,
  BaseballSavantRequest,
  BaseballRoster,
} from "baseball";

import { fetchRequest } from "@factory/fetchRequest";
import { proxy } from "@factory/proxy";
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

const searchBaseball = async (query: string) => {
  const q = query.trim();
  const players = playerCache.get(`baseball:p:${q}`) as BaseballPlayer[];
  if (players.length > 0) return players;

  let teams = teamCache.get("baseball") as Team[];
  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=baseball"
    )) as Team[];

    for (const team of teamResponse) {
      teams = teamCache.add("baseball", team);
    }
  }

  const response = (await fetchRequest(
    `/api/players?sport=baseball&query=${q}`
  )) as BaseballResponse[];

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
    } as BaseballPlayer);
  }

  const baseballSavantResponse = (await proxy(
    `https://baseballsavant.mlb.com/player/search-all?search=${q}`
  )) as BaseballSavantRequest;

  const queryFirstName = q.split(" ")[0] || "";
  const queryLastName = q.split(" ")[1] || "";
  for (const item of baseballSavantResponse) {
    const firstName = item.name?.split(" ")[0] || "";
    const lastName = item.name.split(" ")[1] || "";
    const position: string =
      item.pos === "LHP"
        ? "P"
        : item.pos === "RHP"
        ? "P"
        : item.pos === "TWP"
        ? "P"
        : item.pos;
    const team =
      teams.find(
        (team) =>
          team.abbreviation.toLowerCase() ===
            item.name_display_club.toLowerCase() ||
          team.fullName.toLowerCase() ===
            item.name_display_club.toLowerCase() ||
          team.shortName.toLowerCase() ===
            item.name_display_club.toLowerCase() ||
          team.city.toLowerCase() === item.name_display_club.toLowerCase()
      ) || blankTeam;

    if (
      players.find(
        (player) =>
          player.fullName.toLowerCase() === item.name.toLowerCase() &&
          player.team.id === team.id
      )
    )
      continue;

    if (
      queryFirstName !== "" &&
      queryLastName !== "" &&
      (!firstName.toLowerCase().includes(queryFirstName.toLowerCase()) ||
        !lastName.toLowerCase().includes(queryLastName.toLowerCase()))
    )
      continue;

    players.push({
      id: item.id,
      updatedAt: null,
      fullName: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      number: -1,
      team: team,
      position: position,
      isPlayer: !!item.is_player,
      url: `https://baseballsavant.mlb.com/savant-player/${firstName}-${lastName}-${item.id}`,
      image: `https://img.mlbstatic.com/mlb-photos/image/upload/w_67,q_100/v1/people/${item.id}/headshot/silo/current.jpg`,
      source: "BaseballSavant.mlb.com",
    } as BaseballPlayer);
  }

  return playerCache.set(`baseball:p:${q}`, players) as BaseballPlayer[];
};

const searchBaseballTeam = async (query: string) => {
  const q = query.trim();
  const players = playerCache.get(`baseball:t:${q}`) as BaseballPlayer[];
  if (players.length > 0) return players;

  const results = (await fetchRequest(`/api/teams?sport=baseball&query=${q}`, {
    timeout: 30000,
  })) as BaseballRoster[];

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
      } as BaseballPlayer);
    }
  }

  return playerCache.set(`baseball:t:${q}`, players) as BaseballPlayer[];
};

export default function useGetBaseball(
  query: string,
  searchType: "player" | "team" = "player"
) {
  const { isFetching, isLoading, isError, error, data, refetch } = useQuery(
    ["searchBaseball", query],
    async () =>
      searchType === "player"
        ? await searchBaseball(query.toLowerCase())
        : await searchBaseballTeam(query.toLowerCase()),
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
