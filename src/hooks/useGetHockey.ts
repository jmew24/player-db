import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import { HockeyResponse, HockeyPlayer, EliteProspectsResult } from "hockey";

import { fetchRequest } from "@factory/fetchRequest";
import { proxy } from "@factory/proxy";
import { hockeyTeamCache, hockeyCache } from "@factory/cache";

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

const searchNHL = async (query: string) => {
  const q = query.trim();
  const teams = hockeyTeamCache.get();
  const players = hockeyCache.get(q.toLowerCase());
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=hockey"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
      hockeyTeamCache.add(team);
    }
  }

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

    players.push({
      id: item.id,
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

  return hockeyCache.set(q.toLowerCase(), players);
};

export default function useGetHockey(query: string) {
  const {
    isFetching: nhlIsFetching,
    isLoading: nhlIsLoading,
    isError: nhlIsError,
    error: nhlError,
    data: nhlData,
  } = useQuery(
    ["searchNHL", query],
    async () => await searchNHL(query.toLowerCase()),
    { enabled: !!query }
  );

  return {
    isFetching: nhlIsFetching,
    isLoading: nhlIsLoading,
    isError: nhlIsError,
    error: nhlError,
    data: nhlData,
  };
}
