import { FC, memo, useState, useEffect, useRef, useMemo } from "react";

import useGetSoccer from "@hook/useGetSoccer";
import ImageWithFallback from "@component/ImageWithFallback";

const Soccer: FC<SoccerProps> = ({ query, setShow }) => {
  const [results, setResults] = useState<SoccerPlayer[]>([]);
  const [filter, setFilter] = useState<SoccerPlayerFilter>({
    position: "",
    team: "",
  });
  const { isFetching, isLoading, data } = useGetSoccer(query);
  const resultsRef = useRef<SoccerPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((player) => {
      const team = {
        name: player.teamName?.toLowerCase(),
        city: player.teamRegionName?.toLowerCase(),
      };
      const hasTeamName =
        team.name?.includes(teamFilter) || team.city?.includes(teamFilter);
      const hasPosition =
        player.playedPositions
          .split("-")
          .find(
            (value: string) =>
              value.trim().toLowerCase() === positionFilter.toLowerCase()
          ) !== undefined ||
        player.positionText === positionFilter ||
        player.playedPositionsShort === positionFilter;

      if (teamFilter !== "" && positionFilter !== "")
        return hasTeamName && hasPosition;
      if (teamFilter !== "") return hasTeamName;
      if (positionFilter !== "") return hasPosition;
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (data && data !== resultsRef.current) {
      resultsRef.current = data;
      setResults(data);
      setShow((state: SearchShowSport) => ({
        ...state,
        soccer: resultsRef.current.length > 0,
      }));
    }
  }, [data, setShow]);

  if (isFetching || isLoading)
    return (
      <div className="items-center justify-center py-2">
        <div className="mt-4 w-full">
          <h1 className="text-6xl font-bold">Soccer</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Soccer</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 rounded border border-gray-300 p-2 text-gray-600"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as SoccerPosition,
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

      {filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((player: SoccerPlayer, index: number) => (
            <li
              key={`${player.id}-${player.name}-${index}`}
              className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
            >
              <ImageWithFallback
                className="justify-start rounded px-2 py-1 text-sm text-white"
                alt={`${player.id}`}
                width={67}
                height={67}
                src={player.image}
                fallbackSrc="https://d2zywfiolv4f83.cloudfront.net/img/comparision_player.png"
              />
              <a href={player.url} target="_blank" rel="noreferrer">
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player.name}
                >
                  <label className="px-1 font-bold">Name: </label>
                  <span className="capitalize">{player.name}</span>
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={`${player.teamRegionName} ${player.teamName}`}
                >
                  <label className="px-1 font-bold">Team: </label>
                  {player.teamRegionName} {player.teamName}
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
                title={player.playedPositions}
              >
                {player.playedPositions}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  ) : null;
};

export default memo(Soccer);
