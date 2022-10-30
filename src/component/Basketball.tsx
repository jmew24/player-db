import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { basketballCache } from "../factory/cache";
import ImageWithFallback from "./ImageWithFallback";

const searchNBA = async (query: string) => {
  const q = query.trim().toLowerCase();
  const cached = basketballCache.get("NBA");
  if (cached.length > 0)
    return cached.filter((player) =>
      player.displayName.toLowerCase().includes(q)
    );

  const response = (await proxy(
    `https://ca.global.nba.com/stats2/league/playerlist.json?locale=en`
  )) as NBAPlayerRequest;

  const players: NBAPlayer[] = [];
  for (const item of response.payload.players) {
    const player = item.playerProfile;
    players.push({
      id: player.playerId,
      code: player.code,
      displayName: player.displayName,
      firstName: player.firstName,
      lastName: player.lastName,
      jerseyNo: player.jerseyNo,
      position: player.position,
      team: item.teamProfile,
      url: `https://ca.global.nba.com/players/#!/${player.code}`,
      image: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.playerId}.png`,
      source: "NBA.com",
    } as NBAPlayer);
  }

  return basketballCache
    .set("NBA", players)
    .filter((player) => player.displayName.toLowerCase().includes(q));
};

export const Basketball: FC<BasketballProps> = ({ query, setShow }) => {
  const [results, setResults] = useState<NBAPlayer[]>([]);
  const [filter, setFilter] = useState<NBAPlayerFilter>({
    position: "",
    team: "",
  });
  const {
    isFetching: nbaIsFetching,
    isLoading: nbaIsLoading,
    data: nbaData,
  } = useQuery(
    ["searchNBA", query],
    async () => await searchNBA(query.toLowerCase()),
    {
      enabled: !!query,
    }
  );
  const resultsRef = useRef<NBAPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((player) => {
      const team = {
        name: player.team.name?.toLowerCase(),
        abbreviation: player.team.abbreviation?.toLowerCase(),
        city: player.team.city?.toLowerCase(),
      };
      const hasTeamName =
        team.name?.includes(teamFilter) ||
        team.abbreviation?.includes(teamFilter) ||
        team.city?.includes(teamFilter);
      const hasPosition = player.position === positionFilter;

      if (teamFilter !== "" && positionFilter !== "")
        return hasTeamName && hasPosition;
      if (teamFilter !== "") return hasTeamName;
      if (positionFilter !== "") return hasPosition;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (nbaData && nbaData !== resultsRef.current) {
      resultsRef.current = nbaData;
      setResults(nbaData);
      setShow((state: SearchShowSport) => ({
        ...state,
        basketball: resultsRef.current.length > 0,
      }));
    }
  }, [nbaData, setShow]);

  if (nbaIsFetching || nbaIsLoading)
    return (
      <div className="items-center justify-center py-2">
        <div className="mt-4 w-full">
          <h1 className="text-6xl font-bold">Basketball</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Basketball</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 rounded border border-gray-300 p-2 text-gray-600"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as NBAPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="C">Center</option>
            <option value="F">Forward</option>
            <option value="C-F">Center-Forward</option>
            <option value="F-C">Forward-Center</option>
            <option value="G">Guard</option>
            <option value="F-G">Forward-Guard</option>
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

      {nbaIsFetching ?? nbaIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((player: NBAPlayer, index: number) => (
            <li
              key={`${player.id}-${player.code}-${index}`}
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
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player.displayName}
                >
                  <label className="px-1 font-bold">Name: </label>
                  <span className="capitalize">{player.displayName}</span>
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={`${player.team.city} ${player.team.name}`}
                >
                  <label className="px-1 font-bold">Team: </label>
                  {player.team.city} {player.team.name}
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1 text-sm"
                  title={player.source}
                >
                  <label className="px-1 font-bold">Source: </label>
                  {player.source}
                </p>
              </a>
              <span
                className="flex justify-end rounded bg-gray-500 px-2 py-1 text-sm text-white"
                title={player.position}
              >
                {player.position}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  ) : null;
};
