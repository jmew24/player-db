import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { baseballCache, baseballTeamCache } from "../factory/cache";
import ImageWithFallback from "./ImageWithFallback";

const getTeams = async () => {
  const cached = baseballTeamCache.get();
  if (cached !== null) return cached;

  const response = await proxy(`https://statsapi.mlb.com/api/v1/teams/`);

  const teams: MLBTeam[] = [];
  for (const item of response.teams) {
    const newTeam: MLBTeam = {
      allStarStatus: item.allStarStatus,
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
      active: item.active,
    };
    teams.push(newTeam);
  }

  return baseballTeamCache.set(teams);
};

const useGetTeams = () => {
  return useQuery(["useGetTeams"], () => getTeams());
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
    `https://statsapi.mlb.com/api/v1/sports/1/players`
  );

  const players: MLBPlayer[] = [];
  for (const item of response.people) {
    const newPlayer: MLBPlayer = {
      id: item.id,
      fullName: item.fullName,
      link: item.link,
      firstName: item.firstName,
      lastName: item.lastName,
      primaryNumber: item.primaryNumber,
      currentAge: item.currentAge,
      birthCity: item.birthCity,
      birthStateProvince: item.birthStateProvince,
      birthCountry: item.birthCountry,
      active: item.active,
      currentTeam: {
        id: item.currentTeam.id,
        link: item.currentTeam.link,
        name: teams.find((team) => team.id === item.currentTeam.id)?.name || "",
      },
      primaryPosition: {
        name: item.primaryPosition.name,
        abbreviation: item.primaryPosition.abbreviation,
      },
      isPlayer: item.isPlayer,
      url: `https://www.mlb.com/player/${item.id}`,
      image: `https://securea.mlb.com/mlb/images/players/head_shot/${item.id}.jpg`,
    };
    players.push(newPlayer);
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

export const Baseball: FC<BaseballProps> = ({ query }) => {
  const [results, setResults] = useState<MLBPlayer[]>([]);
  const [filter, setFilter] = useState<MLBPlayerFilter>({
    position: "",
    team: "",
  });
  const { data: mlbTeamsData } = useGetTeams();
  const {
    isFetching: mlbIsFetching,
    isLoading: mlbIsLoading,
    data: mlbData,
  } = useSearchMLB(query, mlbTeamsData);
  const resultsRef = useRef<MLBPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((result) => {
      const teamName = result.currentTeam.name.toLowerCase();
      if (teamFilter !== "" && positionFilter !== "")
        return (
          teamName.includes(teamFilter) &&
          result.primaryPosition.abbreviation === positionFilter
        );
      if (teamFilter !== "") return teamName.includes(teamFilter);
      if (positionFilter !== "")
        return result.primaryPosition.abbreviation === positionFilter;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (mlbData && mlbData !== resultsRef.current) {
      resultsRef.current = mlbData;
      setResults(mlbData);
    }
  }, [mlbData]);

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Baseball</h1>

        <h1 className="text-3xl font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="w-1/4 rounded border border-gray-300 p-2"
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
            type="text"
            value={filter.team}
            onChange={(e) => setFilter({ ...filter, team: e.target.value })}
            placeholder="Team"
            className="h-10 flex-grow rounded-l px-5 outline-double outline-1 focus:outline-none focus:ring"
          />
        </div>
      </div>

      {mlbIsFetching ?? mlbIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((player: MLBPlayer) => (
            <li
              key={player.id}
              className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
            >
              <ImageWithFallback
                className="justify-start rounded px-2 py-1 text-sm text-white"
                alt={`${player.id}`}
                width={67}
                height={67}
                src={`https://img.mlbstatic.com/mlb-photos/image/upload/v1/people/${player.id}/headshot/67/current.jpg`}
                fallbackSrc="https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_426,q_auto:best/v1/people/1/headshot/67/current.jpg"
              />
              <a href={player.url} target="_blank" rel="noreferrer">
                <p className="w-fill m-1 flex items-center justify-center py-2 px-1">
                  <label className="px-1 font-bold">Name: </label>
                  {player.fullName}
                </p>
                <p className="w-fill m-1 flex items-center justify-center py-2 px-1">
                  <label className="px-1 font-bold">Team: </label>
                  {player.currentTeam.name}
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
