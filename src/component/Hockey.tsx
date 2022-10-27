import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

import { proxy } from "../factory/proxy";

export interface HockeyProps {
  query: string;
}

type EliteProspectPosition = "F" | "D" | "G" | "Staff" | "";

type EliteProspectTypes = "team" | "player" | "staff" | "";

type EliteProspectsResult = {
  age: string;
  country: string;
  fullname: string;
  id: string;
  matches: [number, number][];
  position: EliteProspectPosition;
  season: string;
  team: string;
  verified: string;
  verifiedHidden: string;
  league: string;
  _type: EliteProspectTypes;
  url: string;
};

type EliteProspectsFilter = {
  position: EliteProspectPosition;
  team: string;
};

let lastRequest = {
  query: "",
  results: [] as EliteProspectsResult[],
};
const searchEliteProspects = async (query: string) => {
  const q = query.trim();
  if (q == lastRequest.query) return lastRequest.results;

  const res = await proxy(`https://autocomplete.eliteprospects.com/all?q=${q}`);
  const json = await res.json();
  const results: EliteProspectsResult[] = [];
  for (const item of json) {
    let newItem = { ...(item as EliteProspectsResult) };
    if (item._type?.toLowerCase() === "team") {
      newItem = {
        age: "",
        country: item.country,
        fullname: item.fullteam,
        id: item.id,
        matches: item.matches,
        position: "",
        season: "",
        team: item.fullteam,
        verified: "",
        verifiedHidden: "",
        league: item.league,
        _type: item._type,
        url: `https://www.eliteprospects.com/team.php?team=${item.id}`,
      };
    } else if (item.type?.toLowerCase() === "staff") {
      newItem = {
        ...item,
        url: `https://www.eliteprospects.com/staff.php?staff=${item.id}`,
        league: "",
      };
    } else {
      newItem = {
        ...item,
        url: `https://www.eliteprospects.com/player.php?player=${item.id}`,
        league: "",
      };
    }

    results.push(newItem);
  }
  lastRequest = {
    query: q,
    results: results,
  };

  return lastRequest.results;
};

const useSearchEliteProspects = (query: string) => {
  return useQuery(
    ["searchEliteProspects", query],
    () => searchEliteProspects(query),
    {
      enabled: !!query,
    }
  );
};

export const Hockey: FC<HockeyProps> = ({ query }) => {
  const [results, setResults] = useState<EliteProspectsResult[]>([]);
  const [filter, setFilter] = useState<EliteProspectsFilter>({
    position: "",
    team: "",
  });
  const {
    isFetching: eliteProspectsIsFetching,
    isLoading: eliteProspectsIsLoading,
    data: eliteProspectsData,
  } = useSearchEliteProspects(query);
  const resultsRef = useRef<EliteProspectsResult[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((result) => {
      if (result._type?.toLowerCase() === "team") {
        const teamName = result.team?.toLowerCase();
        if (teamFilter !== "" && positionFilter !== "") return false;
        if (teamFilter !== "") return teamName.includes(teamFilter);
        if (positionFilter !== "") return false;

        return true;
      }
      const teamName = result.team?.toLowerCase();
      if (teamFilter !== "" && positionFilter !== "")
        return (
          teamName.includes(teamFilter) && result.position === positionFilter
        );
      if (teamFilter !== "") return teamName.includes(teamFilter);
      if (positionFilter !== "") return result.position === positionFilter;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (eliteProspectsData && eliteProspectsData !== resultsRef.current) {
      resultsRef.current = eliteProspectsData;
      setResults(eliteProspectsData);
    }
  }, [eliteProspectsData]);

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Hockey</h1>

        <h1 className="text-3xl font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="w-1/4 rounded border border-gray-300 p-2"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as EliteProspectPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="F">Forward</option>
            <option value="D">Defense</option>
            <option value="G">Goalie</option>
            <option value="Staff">Staff</option>
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

      {eliteProspectsIsFetching ?? eliteProspectsIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((result: EliteProspectsResult) => (
            <li
              key={result.id}
              className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
            >
              {result._type === "team" ? (
                <>
                  <a href={result.url} target="_blank" rel="noreferrer">
                    <p>
                      <label className="font-bold">Team: </label>
                      {result.team}
                    </p>
                    <p>
                      <label className="font-bold">League: </label>{" "}
                      {result.league}
                    </p>
                  </a>
                  <Image
                    className="rounded px-2 py-1 text-sm text-white"
                    src={`https://files.eliteprospects.com/layout/flagsmedium/${result.country}.png`}
                    alt={result.country}
                    width={30}
                    height={30}
                  />
                </>
              ) : (
                <>
                  <span className="rounded bg-gray-500 px-2 py-1 text-sm text-white">
                    {result.position}
                  </span>
                  <a href={result.url} target="_blank" rel="noreferrer">
                    <p>
                      <label className="font-bold">Name: </label>
                      {result.fullname}
                    </p>
                    <p>
                      <label className="font-bold">Team: </label> {result.team}
                    </p>
                  </a>
                  <Image
                    className="rounded px-2 py-1 text-sm text-white"
                    src={`https://files.eliteprospects.com/layout/flagsmedium/${result.country}.png`}
                    alt={result.country}
                    width={30}
                    height={30}
                  />
                </>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  ) : null;
};
