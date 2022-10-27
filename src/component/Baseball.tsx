import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";

export interface BaseballProps {
  query: string;
}

type BaseballSavantPosition =
  | "RHP"
  | "LHP"
  | "TWP"
  | "C"
  | "1B"
  | "2B"
  | "SS"
  | "3B"
  | "RF"
  | "CF"
  | "LF"
  | "";

type BaseballSavantResult = {
  name: string;
  id: string;
  is_player: number;
  mlb: number;
  league: string;
  first: string;
  is_prospect: number;
  parent_team: string;
  pos: BaseballSavantPosition;
  rank: string;
  last_year: string;
  name_display_club: string;
  url: string;
};

type BaseballSavantFilter = {
  position: BaseballSavantPosition;
  team: string;
};

let lastRequest = {
  query: "",
  results: [] as BaseballSavantResult[],
};
const searchBaseballSavant = async (query: string) => {
  const q = query.trim();
  if (q == lastRequest.query) return lastRequest.results;

  const res = await proxy(
    `https://baseballsavant.mlb.com/player/search-all?search=${q}`
  );
  const json = await res.json();
  for (const item of json) {
    item.url = `https://www.mlb.com/player/${item.name.replaceAll(" ", "-")}-${
      item.id
    }`.toLowerCase();
  }
  lastRequest = {
    query: q,
    results: json as BaseballSavantResult[],
  };

  return lastRequest.results;
};

const useSearchBaseballSavant = (query: string) => {
  return useQuery(
    ["searchBaseballSavant", query],
    () => searchBaseballSavant(query),
    {
      enabled: !!query,
    }
  );
};

export const Baseball: FC<BaseballProps> = ({ query }) => {
  const [results, setResults] = useState<BaseballSavantResult[]>([]);
  const [filter, setFilter] = useState<BaseballSavantFilter>({
    position: "",
    team: "",
  });
  const {
    isFetching: baseballSavantIsFetching,
    isLoading: baseballSavantIsLoading,
    data: baseballSavantData,
  } = useSearchBaseballSavant(query);
  const resultsRef = useRef<BaseballSavantResult[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((result) => {
      const teamName = result.name_display_club?.toLowerCase();
      if (teamFilter !== "" && positionFilter !== "")
        return teamName.includes(teamFilter) && result.pos === positionFilter;
      if (teamFilter !== "") return teamName.includes(teamFilter);
      if (positionFilter !== "") return result.pos === positionFilter;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (baseballSavantData && baseballSavantData !== resultsRef.current) {
      resultsRef.current = baseballSavantData;
      setResults(baseballSavantData);
    }
  }, [baseballSavantData]);

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
                position: e.target.value as BaseballSavantPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="RHP">RHP</option>
            <option value="LHP">LHP</option>
            <option value="TWP">TWP</option>
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

      {baseballSavantIsFetching ?? baseballSavantIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((result: BaseballSavantResult) => (
            <li
              key={result.id}
              className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
            >
              <span className="rounded bg-gray-500 px-2 py-1 text-sm text-white">
                {result.pos}
              </span>
              <a href={result.url} target="_blank" rel="noreferrer">
                <p>
                  <label className="font-bold">Name: </label>
                  {result.name}
                </p>
                <p>
                  <label className="font-bold">Team: </label>{" "}
                  {result.name_display_club}
                </p>
              </a>
              {result.league !== "" ? (
                <span className="rounded bg-gray-500 px-2 py-1 text-sm text-white">
                  {result.league}
                </span>
              ) : (
                <span className="rounded px-2 py-1 text-sm text-white"></span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  ) : null;
};
