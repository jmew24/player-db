import { FC, useState, useEffect, useRef, useMemo } from "react";

import useGetFootball from "@hook/useGetFootball";
import ImageWithFallback from "@component/ImageWithFallback";

export const Football: FC<FootballProps> = ({ query, setShow }) => {
  const [results, setResults] = useState<NFLPlayer[]>([]);
  const [filter, setFilter] = useState<NFLPlayerFilter>({
    position: "",
    team: "",
  });
  const { isFetching, isLoading, data } = useGetFootball(query);
  const resultsRef = useRef<NFLPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((player) => {
      const team = {
        name: player.team.name?.toLowerCase(),
        abbreviation: player.team.abbreviation?.toLowerCase(),
        teamName: player.team.teamName?.toLowerCase(),
      };
      const hasTeamName =
        team.name?.includes(teamFilter) ||
        team.abbreviation?.includes(teamFilter) ||
        team.teamName?.includes(teamFilter);
      const hasPosition = player.position === positionFilter;

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
        football: resultsRef.current.length > 0,
      }));
    }
  }, [data, setShow]);

  if (isFetching || isLoading)
    return (
      <div className="items-center justify-center py-2">
        <div className="mt-4 w-full">
          <h1 className="text-6xl font-bold">Football</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Football</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 rounded border border-gray-300 p-2 text-gray-600"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as NFLPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="QB">Quarterback</option>
            <option value="C">Center</option>
            <option value="OG">Offensive Guard</option>
            <option value="FB">Full Back</option>
            <option value="HB">Half Back</option>
            <option value="WR">Wide Receiver</option>
            <option value="TE">Tight End</option>
            <option value="LT">Left Tackle</option>
            <option value="RT">Right Tackle</option>
            <option value="DE">Defensive End</option>
            <option value="DT">Defensive Tackle</option>
            <option value="MLB">Middle Linebacker</option>
            <option value="ROLB">Right Outside Linebacker</option>
            <option value="OLB">Outside Linebacker</option>
            <option value="LOLB">Left Outside Linebacker</option>
            <option value="CB">Cornerback</option>
            <option value="FS">Free Safety</option>
            <option value="SS">Strong Safety</option>
            <option value="K">Kicker</option>
            <option value="P">Punter</option>
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
          {filteredResults.map((player: NFLPlayer, index: number) => (
            <li
              key={`${player.assetname}-${index}`}
              className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
            >
              <ImageWithFallback
                className="justify-start rounded px-2 py-1 text-sm text-white"
                alt={`${player.id}`}
                width={67}
                height={67}
                src={player.image}
                fallbackSrc="https://madden-assets-cdn.pulse.ea.com/madden23/portraits/64/0.png"
              />
              <a href={player.url} target="_blank" rel="noreferrer">
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={`${player.firstName} ${player.lastName}`}
                >
                  <label className="px-1 font-bold">Name: </label>
                  <span className="capitalize">
                    {player.firstName} {player.lastName}
                  </span>
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player.team.name}
                >
                  <label className="px-1 font-bold">Team: </label>
                  {player.team.name}
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
