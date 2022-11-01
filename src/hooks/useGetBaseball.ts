import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { baseballCache, baseballTeamCache } from "../factory/cache";

const blankTeam: MLBTeam = {
  id: -1,
  name: "Unknown",
  teamCode: "",
  fileCode: "",
  abbreviation: "",
  teamName: "Unknown",
  locationName: "",
  shortName: "",
  franchiseName: "",
  clubName: "",
};

const getTeams = async () => {
  const cached = baseballTeamCache.get();
  if (cached.length > 0) return cached;

  const response = (await proxy(
    `https://statsapi.mlb.com/api/v1/teams/`
  )) as MLBTeamRequest;

  const teams: MLBTeam[] = [blankTeam];
  for (const item of response.teams) {
    teams.push({
      id: item.id,
      name: item.name,
      teamCode: item.teamCode,
      fileCode: item.fileCode,
      abbreviation: item.abbreviation,
      teamName: item.teamName,
      locationName: item.locationName,
      shortName: item.shortName,
      franchiseName: item.franchiseName,
      clubName: item.clubName,
    } as MLBTeam);
  }

  return baseballTeamCache.set(teams);
};

const searchMLB = async (query: string, t: MLBTeam[] | undefined) => {
  const teams = t || ([] as MLBTeam[]);
  const q = query.trim();
  const { lastQuery, mlbResults, baseballSavantResults } = baseballCache.get(
    q.toLowerCase()
  );

  if (mlbResults.length === 0 && lastQuery !== q.toLowerCase().trim()) {
    const response = (await proxy(
      `https://statsapi.mlb.com/api/v1/sports/1/players?fields=people,id,fullName,firstName,lastName,primaryNumber,currentTeam,primaryPosition,name,abbreviation,isPlayer`
    )) as MLBPlayerRequest;

    for (const item of response.people) {
      const team = teams.find((team) => team.id === item.currentTeam.id) || {
        ...blankTeam,
      };

      mlbResults.push({
        id: item.id,
        fullName: item.fullName,
        firstName: item.firstName,
        lastName: item.lastName,
        primaryNumber: item.primaryNumber,
        team: team,
        primaryPosition: item.primaryPosition,
        isPlayer: item.isPlayer,
        url: `https://www.mlb.com/player/${item.id}`,
        image: `https://securea.mlb.com/mlb/images/players/head_shot/${item.id}.jpg`,
        source: "MLB.com",
      } as MLBPlayer);
    }
  }

  if (
    baseballSavantResults.length === 0 &&
    lastQuery !== q.toLowerCase().trim()
  ) {
    const baseballSavantResponse = (await proxy(
      `https://baseballsavant.mlb.com/player/search-all?search=${q}`
    )) as BaseballSavantRequest;

    for (const item of baseballSavantResponse) {
      const firstName = item.name?.split(" ")[0] || "";
      const lastName = item.name.split(" ")[1] || "";
      const position =
        item.pos == "LHP"
          ? "P"
          : item.pos == "RHP"
          ? "P"
          : item.pos == "TWP"
          ? "P"
          : item.pos;
      const team = teams.find(
        (team) =>
          team.teamCode === item.name_display_club ||
          team.name === item.name_display_club ||
          team.abbreviation === item.name_display_club ||
          team.teamName === item.name_display_club ||
          team.shortName === item.name_display_club ||
          team.franchiseName === item.name_display_club ||
          team.clubName === item.name_display_club
      ) || { ...blankTeam };

      if (
        mlbResults.find(
          (player) =>
            player.fullName === item.name && player.team.name === team.name
        )
      )
        continue;

      baseballSavantResults.push({
        id: parseInt(item.id),
        fullName: `${firstName} ${lastName}`,
        firstName: firstName,
        lastName: lastName,
        primaryNumber: "-1",
        team: team,
        primaryPosition: {
          name: item.pos,
          abbreviation: position,
        },
        isPlayer: !!item.is_player,
        url: `https://baseballsavant.mlb.com/savant-player/${firstName}-${lastName}-${item.id}`,
        image: `https://img.mlbstatic.com/mlb-photos/image/upload/w_67,q_100/v1/people/${item.id}/headshot/silo/current.jpg`,
        source: "BaseballSavant.mlb.com",
      } as MLBPlayer);
    }
  }

  return baseballCache
    .set(q.toLowerCase(), mlbResults, baseballSavantResults)
    .filter((player) => player.fullName.toLowerCase().includes(query));
};

export default function useGetBaseball(query: string) {
  const {
    isFetching: mlbTeamIsFetching,
    isLoading: mlbTeamIsLoading,
    isError: mlbTeamIsError,
    error: mlbTeamError,
    data: mlbTeamsData,
  } = useQuery(["useGetMLBTeams"], async () => await getTeams());
  const {
    isFetching: mlbIsFetching,
    isLoading: mlbIsLoading,
    isError: mlbIsError,
    error: mlbError,
    data: mlbData,
  } = useQuery(
    ["searchMLB", query, mlbTeamsData],
    async () => await searchMLB(query.toLowerCase(), mlbTeamsData),
    {
      enabled: !!query && mlbTeamsData !== undefined,
    }
  );

  return {
    isFetching: mlbTeamIsFetching || mlbIsFetching,
    isLoading: mlbTeamIsLoading || mlbIsLoading,
    isError: mlbTeamIsError || mlbIsError,
    error: { mlbTeamError, mlbError },
    data: mlbData,
  };
}
