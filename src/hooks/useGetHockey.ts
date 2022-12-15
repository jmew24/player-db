import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import {
  HockeyResponse,
  HockeyPlayer,
  HockeyRoster,
  EliteProspectsResult,
} from "hockey";

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

const searchHockey = async (query: string) => {
  const q = query.trim();
  const teams = teamCache.get("hockey") as Team[];
  const players = playerCache.get(`hockey:p:${q}`) as HockeyPlayer[];
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=hockey"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
    }
  }
  teamCache.set("hockey", teams);

  const response = (await fetchRequest(
    `/api/players?sport=hockey&query=${q}`
  )) as HockeyResponse[];

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
      experience: "NHL",
      _type: "player",
      url: item.linkUrl,
      image: item.headshotUrl,
      source: item.source,
      sport: item.sport,
    } as HockeyPlayer);
  }

  const eliteProspectsResponse = (await proxy(
    `https://autocomplete.eliteprospects.com/all?q=${q}`
  )) as EliteProspectsResult[];

  const queryFirstName = q.split(" ")[0] || "";
  const queryLastName = q.split(" ")[1] || "";
  for (const item of eliteProspectsResponse) {
    const _type = item._type?.toLowerCase();
    if (_type !== "player" && _type !== "staff") continue;

    const firstName = item.fullname?.split(" ")[0] || "";
    const lastName = item.fullname.split(" ")[1] || "";
    const teamName = item.team;
    const team =
      teams.find(
        (team) =>
          team.abbreviation.toLowerCase() === teamName.toLowerCase() ||
          team.fullName.toLowerCase() === teamName.toLowerCase() ||
          team.shortName.toLowerCase() === teamName.toLowerCase() ||
          team.city.toLowerCase() === teamName.toLowerCase()
      ) || blankTeam;

    if (
      players.find(
        (player) =>
          player.fullName.toLowerCase() === item.fullname.toLowerCase() &&
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
      fullName: item.fullname,
      lastName: lastName,
      firstName: firstName,
      team: team,
      position: item.position,
      number: -1,
      experience: item.experience,
      _type: _type,
      isPlayer: _type === "player",
      url:
        _type === "player"
          ? `https://www.eliteprospects.com/player/${
              item.id
            }/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}`
          : `https://www.eliteprospects.com/staff/${
              item.id
            }/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}`,
      image: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/skater.jpg`,
      source: "EliteProspects.com",
    } as HockeyPlayer);
  }

  return playerCache.set(`hockey:p:${q}`, players) as HockeyPlayer[];
};

const searchHockeyTeam = async (query: string) => {
  const q = query.trim();
  const players = playerCache.get(`hockey:t:${q}`) as HockeyPlayer[];
  if (players.length > 0) return players;

  const results = (await fetchRequest(`/api/teams?sport=hockey&query=${q}`, {
    timeout: 30000,
  })) as HockeyRoster[];

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
      } as HockeyPlayer);
    }
  }

  return playerCache.set(`hockey:t:${q}`, players) as HockeyPlayer[];
};

export default function useGetHockey(
  query: string,
  searchType: "player" | "team" = "player"
) {
  const { isFetching, isLoading, isError, error, data, refetch } = useQuery(
    ["searchHockey", query],
    async () =>
      searchType === "player"
        ? await searchHockey(query.toLowerCase())
        : await searchHockeyTeam(query.toLowerCase()),
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
