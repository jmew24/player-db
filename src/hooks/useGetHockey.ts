import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { hockeyCache, hockeyTeamCache } from "../factory/cache";

const blankTeam: NHLTeam = {
  id: -1,
  name: "Unknown",
  abbreviation: "",
  teamName: "Unknown",
  shortName: "",
};

const getTeams = async () => {
  const cached = hockeyTeamCache.get();
  if (cached.length > 0) return cached;

  const response = (await proxy(
    `https://statsapi.web.nhl.com/api/v1/teams`
  )) as NHLTeamRequest;

  const teams: NHLTeam[] = [blankTeam];
  for (const item of response.teams) {
    teams.push({
      id: item.id,
      name: item.name,
      abbreviation: item.abbreviation,
      teamName: item.teamName,
      shortName: item.shortName,
    } as NHLTeam);
  }

  return hockeyTeamCache.set(teams);
};

const searchNHL = async (query: string, t: NHLTeam[] | undefined) => {
  const teams = t || ([] as NHLTeam[]);
  const q = query.trim();
  const cached = hockeyCache.get(q.toLowerCase());
  if (cached.length > 0) return cached;

  const nhlResponse = (await proxy(
    `https://suggest.svc.nhl.com/svc/suggest/v1/players/${q}/99999`
  )) as NHLPlayerResult;

  const players: NHLPlayer[] = [];
  for (const item of nhlResponse.suggestions) {
    const person = item.person;
    const position = item.position;
    const teamAbbreviation = item.team.abbreviation;
    const team = teams.find(
      (team) => team.abbreviation === teamAbbreviation
    ) || { ...blankTeam };

    players.push({
      id: parseInt(person.id || "-1"),
      lastName: person.lastName,
      firstName: person.firstName,
      team: team,
      position: position.abbreviation,
      number: parseInt(item.jerseyNumber || "-1"),
      experience: "NHL",
      _type: item.type,
      url: `https://www.nhl.com/player/${person.otherNames.slug}`,
      image: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${person.id}.jpg`,
      source: "NHL.com",
    } as NHLPlayer);
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
    const team = teams.find(
      (team) =>
        team.name === teamName ||
        team.abbreviation === teamName ||
        team.teamName === teamName ||
        team.shortName === teamName
    ) || { ...blankTeam };

    if (
      players.find(
        (player) =>
          player.firstName === firstName &&
          player.lastName === lastName &&
          player.team.name === team.name
      )
    )
      continue;

    players.push({
      id: parseInt(item.id || "-1"),
      lastName: lastName,
      firstName: firstName,
      team: team,
      position: item.position,
      number: -1,
      experience: item.experience,
      _type: _type,
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
    } as NHLPlayer);
  }

  return hockeyCache.set(q.toLowerCase(), players);
};

export default function useGetHockey(query: string) {
  const {
    isFetching: nhlTeamIsFetching,
    isLoading: nhlTeamIsLoading,
    isError: nhlTeamIsError,
    error: nhlTeamError,
    data: nhlTeamsData,
  } = useQuery(["useGetNHLTeams"], async () => await getTeams());
  const {
    isFetching: nhlIsFetching,
    isLoading: nhlIsLoading,
    isError: nhlIsError,
    error: nhlError,
    data: nhlData,
  } = useQuery(
    ["searchNHL", query, nhlTeamsData],
    async () => await searchNHL(query.toLowerCase(), nhlTeamsData),
    {
      enabled: !!query && nhlTeamsData !== undefined,
    }
  );

  return {
    isFetching: nhlTeamIsFetching || nhlIsFetching,
    isLoading: nhlTeamIsLoading || nhlIsLoading,
    isError: nhlTeamIsError || nhlIsError,
    error: { nhlTeamError, nhlError },
    data: nhlData,
  };
}
