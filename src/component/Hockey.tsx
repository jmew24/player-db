import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { hockeyCache } from "../factory/cache";
import ImageWithFallback from "./ImageWithFallback";

const searchNHL = async (query: string) => {
  const q = query.trim();
  const cached = hockeyCache.get(q);
  if (cached !== null) return cached;

  const response = await proxy(
    `https://suggest.svc.nhl.com/svc/suggest/v1/minplayers/${q}/99999`
  );

  const players: NHLPlayer[] = [];
  for (const item of response.suggestions) {
    // 8479318|Matthews|Auston|1|0|6' 3"|208|San Ramon|CA|USA|1997-09-17|TOR|C|34|auston-matthews-8479318
    const data = item.toString().split("|");
    const newPlayer: NHLPlayer = {
      id: parseInt(data[0]?.toString() || "-1"),
      first_name: data[1]?.toString() || "",
      last_name: data[2]?.toString() || "",
      birthplace: data[7]?.toString() || "",
      birth_state: data[8]?.toString() || "",
      birth_country: data[9]?.toString() || "",
      birth_date: data[10]?.toString() || "",
      team: data[11]?.toString() || "",
      position: data[12]?.toString() || "",
      number: parseInt(data[13]?.toString() || "-1"),
      url: `https://www.nhl.com/player/${data[14]}`,
      image: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${data[0]}.jpg`,
    };
    players.push(newPlayer);
  }

  return hockeyCache.set(q, players);
};

const useSearchNHL = (query: string) => {
  return useQuery(["searchNHL", query], () => searchNHL(query.toLowerCase()), {
    enabled: !!query,
  });
};

export const Hockey: FC<HockeyProps> = ({ query }) => {
  const [results, setResults] = useState<NHLPlayer[]>([]);
  const [filter, setFilter] = useState<NHLFilter>({
    position: "",
    team: "",
  });
  const {
    isFetching: nhlIsFetching,
    isLoading: nhlIsLoading,
    data: nhlData,
  } = useSearchNHL(query);
  const resultsRef = useRef<NHLPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((player) => {
      const teamName = player.team?.toLowerCase();
      if (teamFilter !== "" && positionFilter !== "")
        return (
          teamName.includes(teamFilter) && player.position === positionFilter
        );
      if (teamFilter !== "") return teamName.includes(teamFilter);
      if (positionFilter !== "") return player.position === positionFilter;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (nhlData && nhlData !== resultsRef.current) {
      resultsRef.current = nhlData;
      setResults(nhlData);
    }
  }, [nhlData]);

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
                position: e.target.value as NHLPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="C">Center</option>
            <option value="R">Right Wing</option>
            <option value="L">Left Wing</option>
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

      {nhlIsFetching ?? nhlIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((player: NHLPlayer) => {
            return (
              <li
                key={player.id}
                className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
              >
                <ImageWithFallback
                  className="justify-start rounded px-2 py-1 text-sm text-white"
                  alt={`${player.id}`}
                  width={67}
                  height={67}
                  src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${player.id}.jpg`}
                  fallbackSrc="https://cms.nhl.bamgrid.com/images/headshots/current/168x168/skater.jpg"
                />
                <a href={player.url} target="_blank" rel="noreferrer">
                  <p className="w-fill m-1 flex items-center justify-center py-2 px-1">
                    <label className="px-1 font-bold">Name: </label>
                    {player.first_name} {player.last_name}
                  </p>
                  <p className="w-fill m-1 flex items-center justify-center py-2 px-1">
                    <label className="px-1 font-bold">Team: </label>
                    {player.team}
                  </p>
                </a>
                <span className="flex justify-end rounded bg-gray-500 px-2 py-1 text-sm text-white">
                  {player.position}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  ) : null;
};
