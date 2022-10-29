import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { baseballCache, baseballTeamCache } from "../factory/cache";
import ImageWithFallback from "./ImageWithFallback";

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
  if (cached !== null) return cached;

  const response = await proxy(`https://statsapi.mlb.com/api/v1/teams/`);

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

const useGetMLBTeams = () => {
  return useQuery(["useGetMLBTeams"], () => getTeams());
};

const searchMLB = async (query: string, t: MLBTeam[] | undefined) => {
  const teams = t || ([] as MLBTeam[]);
  const q = query.trim();
  const cached = baseballCache.get(q);
  if (cached !== null)
    return cached.filter((player) =>
      player.fullName.toLowerCase().includes(query)
    );

  const response = await proxy(
    `https://statsapi.mlb.com/api/v1/sports/1/players?fields=people,id,fullName,firstName,lastName,primaryNumber,currentTeam,primaryPosition,name,abbreviation,isPlayer`
  );

  const players: MLBPlayer[] = [];
  for (const item of response.people) {
    const team = teams.find((team) => team.id === item.currentTeam.id) || {
      ...blankTeam,
    };

    players.push({
      id: item.id,
      fullName: item.fullName,
      firstName: item.firstName,
      lastName: item.lastName,
      primaryNumber: item.primaryNumber,
      team: team,
      primaryPosition: {
        name: item.primaryPosition.name,
        abbreviation: item.primaryPosition.abbreviation,
      },
      isPlayer: item.isPlayer,
      url: `https://www.mlb.com/player/${item.id}`,
      image: `https://securea.mlb.com/mlb/images/players/head_shot/${item.id}.jpg`,
      source: "MLB.com",
    } as MLBPlayer);
  }

  const baseballSavantResponse = (await proxy(
    `https://baseballsavant.mlb.com/player/search-all?search=${q}`
  )) as BaseballSavantResult[];

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
      players.find(
        (player) =>
          player.fullName === item.name && player.team.name === team.name
      )
    )
      continue;

    players.push({
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

  return baseballCache
    .set(q, players)
    .filter((player) => player.fullName.toLowerCase().includes(query));
};

const useSearchMLB = (query: string, teams: MLBTeam[] | undefined) => {
  return useQuery(
    ["searchMLB", query, teams],
    () => searchMLB(query.toLowerCase(), teams),
    {
      enabled: !!query && teams !== undefined,
    }
  );
};

export const Baseball: FC<BaseballProps> = ({ query, setShow }) => {
  const [results, setResults] = useState<MLBPlayer[]>([]);
  const [filter, setFilter] = useState<MLBPlayerFilter>({
    position: "",
    team: "",
  });
  const { data: mlbTeamsData } = useGetMLBTeams();
  const {
    isFetching: mlbIsFetching,
    isLoading: mlbIsLoading,
    data: mlbData,
  } = useSearchMLB(query, mlbTeamsData);
  const resultsRef = useRef<MLBPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((player) => {
      const team = {
        name: player.team.name?.toLowerCase(),
        abbreviation: player.team.abbreviation?.toLowerCase(),
        teamName: player.team.teamName?.toLowerCase(),
        shortName: player.team.shortName?.toLowerCase(),
      };
      const hasTeamName =
        team.name?.includes(teamFilter) ||
        team.abbreviation?.includes(teamFilter) ||
        team.teamName?.includes(teamFilter) ||
        team.shortName?.includes(teamFilter);
      const hasPosition =
        player.primaryPosition.name === positionFilter ||
        player.primaryPosition.abbreviation === positionFilter;

      if (teamFilter !== "" && positionFilter !== "")
        return hasTeamName && hasPosition;
      if (teamFilter !== "") return hasTeamName;
      if (positionFilter !== "") return hasPosition;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (mlbData && mlbData !== resultsRef.current) {
      resultsRef.current = mlbData;
      setResults(mlbData);
      setShow((state: SearchShowSport) => ({
        ...state,
        baseball: resultsRef.current.length > 0,
      }));
    }
  }, [mlbData, setShow]);

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Baseball</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 rounded border border-gray-300 p-2 text-gray-600"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as MLBPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="P">P</option>
            <option value="C">C</option>
            <option value="1B">1B</option>
            <option value="2B">2B</option>
            <option value="SS">SS</option>
            <option value="3B">3B</option>
            <option value="RF">RF</option>
            <option value="CF">CF</option>
            <option value="LF">LF</option>
          </select>
          <input
            className="mx-2 h-10 w-1/2 flex-grow rounded-l px-5 text-gray-600 outline-double outline-1 focus:outline-none focus:ring"
            type="text"
            value={filter.team}
            onChange={(e) => setFilter({ ...filter, team: e.target.value })}
            placeholder="Team"
          />
        </div>
      </div>

      {mlbIsFetching ?? mlbIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center ">
          {filteredResults.map((player: MLBPlayer, index: number) => (
            <li
              key={`${player.id}-${player.fullName.replaceAll(
                " ",
                "-"
              )}-${index}`}
              className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
            >
              <ImageWithFallback
                className="justify-start rounded px-2 py-1 text-sm text-white"
                alt={`${player.id}`}
                width={67}
                height={67}
                src={player.image}
                fallbackSrc="https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_426,q_auto:best/v1/people/1/headshot/67/current.jpg"
              />
              <a href={player.url} target="_blank" rel="noreferrer">
                <p className="w-fill m-1 flex items-center justify-center py-2 px-1">
                  <label className="px-1 font-bold">Name: </label>
                  <span className="capitalize">{player.fullName}</span>
                </p>
                <p className="w-fill m-1 flex items-center justify-center py-2 px-1">
                  <label className="px-1 font-bold">Team: </label>
                  {player.team.name}
                </p>
                <p className="w-fill m-1 flex items-center justify-center py-2 px-1 text-sm">
                  <label className="px-1 font-bold">Source: </label>
                  {player.source}
                </p>
              </a>
              <span
                className="flex justify-end rounded bg-gray-500 px-2 py-1 text-sm text-white"
                title={player.primaryPosition.name}
              >
                {player.primaryPosition.abbreviation}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  ) : null;
};
