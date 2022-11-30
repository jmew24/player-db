import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import { FootballPlayer, NFLPlayerFilter, NFLPosition } from "football";

import useGetFootball from "@hook/useGetFootball";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  searchTypeAtom,
  footballItemsAtom,
  footballTeamAtom,
  footballPositionAtom,
  footballLeagueAtom,
} from "@shared/jotai";

const Football = () => {
  const query = useAtomValue(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const footballItems = useAtomValue(footballItemsAtom);
  const setFootballItems = useSetAtom(footballItemsAtom);
  const footballTeam = useAtomValue(footballTeamAtom);
  const setFootballTeam = useSetAtom(footballTeamAtom);
  const footballPosition = useAtomValue(footballPositionAtom);
  const setFootballPosition = useSetAtom(footballPositionAtom);
  const footballLeague = useAtomValue(footballLeagueAtom);
  const setFootballLeague = useSetAtom(footballLeagueAtom);
  const [filter, setFilter] = useState<NFLPlayerFilter>({
    position: footballPosition,
    team: footballTeam,
    league: footballLeague,
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<FootballPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetFootball(query, searchType);
  const leagueFilters = useMemo(() => {
    const leagues: string[] = [];

    data?.forEach((player) => {
      if (!leagues.includes(player.team.league))
        leagues.push(player.team.league);
    });

    return leagues;
  }, [data]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;
    const leagueFilter = filter.league;

    return footballItems.filter((player) => {
      const team = {
        name: player.team.fullName?.toLowerCase(),
        abbreviation: player.team.abbreviation?.toLowerCase(),
        city: player.team.city?.toLowerCase(),
        shortName: player.team.shortName?.toLowerCase(),
      };
      const hasTeamName =
        team.name?.includes(teamFilter) ||
        team.abbreviation?.includes(teamFilter) ||
        team.city?.includes(teamFilter) ||
        team.shortName?.includes(teamFilter);
      let position = player.position ?? "";
      switch (player.position) {
        case "Quarterback":
          position = "QB";
          break;
        case "Center":
          position = "C";
          break;
        case "Offensive Guard":
          position = "OG";
          break;
        case "Full Back":
          position = "FB";
          break;
        case "Half Back":
          position = "HB";
          break;
        case "Wide Receiver":
          position = "WR";
          break;
        case "Tight End":
          position = "TE";
          break;
        case "Left Tackle":
          position = "LT";
          break;
        case "Right Tackle":
          position = "RT";
          break;
        case "Defensive End":
          position = "DE";
          break;
        case "Offensive Tackle":
          position = "OT";
          break;
        case "Defensive Tackle":
          position = "DT";
          break;
        case "Middle Linebacker":
          position = "LB";
          break;
        case "Right Outside Linebacker":
          position = "LB";
          break;
        case "Outside Linebacker":
          position = "LB";
          break;
        case "Left Outside Linebacker":
          position = "LB";
          break;
        case "Cornerback":
          position = "CB";
          break;
        case "Safety":
          position = "S";
          break;
        case "Strong Safety":
          position = "S";
          break;
        case "Free Safety":
          position = "S";
          break;
        case "Kicker":
          position = "K";
          break;
        case "Punter":
          position = "P";
          break;
        default:
          position = player.position ?? "";
          break;
      }
      const hasPosition =
        position.toLowerCase() === positionFilter.toLowerCase();
      const hasLeague =
        player.team?.league?.toLowerCase() === leagueFilter.toLowerCase();

      if (teamFilter !== "" && positionFilter !== "" && leagueFilter !== "")
        return hasTeamName && hasPosition && hasLeague;
      if (teamFilter !== "" && positionFilter !== "")
        return hasTeamName && hasPosition;
      if (teamFilter !== "" && leagueFilter !== "")
        return hasTeamName && hasLeague;
      if (positionFilter !== "" && leagueFilter !== "")
        return hasPosition && hasLeague;
      if (teamFilter !== "") return hasTeamName;
      if (positionFilter !== "") return hasPosition;
      if (leagueFilter !== "") return hasLeague;
      return true;
    });
  }, [filter.team, filter.position, filter.league, footballItems]);
  const pages = useMemo(
    () => Math.ceil(filteredResults.length / playersPerPage),
    [filteredResults.length]
  );
  const pagesArray = useMemo(() => Array.from(Array(pages).keys()), [pages]);
  const pagesDisplay = useMemo(() => {
    const selectedPage = page - 1;
    const firstPage = selectedPage - 1 < 0 ? 0 : selectedPage - 1;
    const lastPage = selectedPage + 4 >= pages ? pages : selectedPage + 4;

    return pagesArray.slice(firstPage, lastPage);
  }, [pages, pagesArray, page]);

  useEffect(() => {
    if (filter.team) {
      setFootballTeam(filter.team);
    } else {
      setFootballTeam("");
    }
  }, [filter.team, setFootballTeam]);

  useEffect(() => {
    if (filter.position) {
      setFootballPosition(filter.position);
    } else {
      setFootballPosition("");
    }
  }, [filter.position, setFootballPosition]);

  useEffect(() => {
    if (filter.league) {
      setFootballLeague(filter.league);
    } else {
      setFootballLeague("");
    }
  }, [filter.league, setFootballLeague]);

  useEffect(() => {
    if (data && data !== footballItems) {
      setFootballItems(data);
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [data, filter.league, leagueFilters, footballItems, setFootballItems]);

  useEffect(() => {
    if (filteredResults.length > 0) {
      const start = page * playersPerPage;
      const end = start + playersPerPage;
      setPaginationData({ start, end });
      setPagePlayers(filteredResults.slice(start, end));
    } else {
      setPagePlayers([]);
    }
  }, [page, filteredResults]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  if (query === "")
    return (
      <div className="items-center justify-center py-2">
        <div className="mt-4 w-full">
          <h1 className="text-6xl font-bold">Football</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">{`Enter a ${searchType} name to search...`}</h1>
        </div>
      </div>
    );

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

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Football</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 justify-center  rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as NFLPosition,
              })
            }
            disabled={data?.length === 0}
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
            <option value="OT">Offensive Tackle</option>
            <option value="DT">Defensive Tackle</option>
            <option value="LB">Linebacker</option>
            <option value="CB">Cornerback</option>
            <option value="S">Safety</option>
            <option value="K">Kicker</option>
            <option value="P">Punter</option>
          </select>
          <input
            className="mx-2 h-10 w-1/2 flex-grow rounded border-gray-500 bg-gray-700 px-5 text-gray-200 outline-double outline-1 outline-gray-500 focus:outline-none focus:ring"
            type="text"
            value={filter.team}
            onChange={(e) => setFilter({ ...filter, team: e.target.value })}
            placeholder="Team"
            disabled={data?.length === 0}
          />
        </div>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-full justify-center  rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
            value={filter.league}
            onChange={(e) =>
              setFilter({ ...filter, league: e.target.value as string })
            }
            title="League Filter"
            disabled={data?.length === 0}
          >
            <option value="">All Leagues</option>
            {leagueFilters.map((league) => (
              <option key={`leagueFilter-${league}`} value={league}>
                {league}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex w-full flex-col items-center justify-center">
        <Pagination
          selected={page}
          pages={pages}
          pagesArray={pagesArray}
          pagesDisplay={pagesDisplay}
          setPage={setPage}
          data={{
            count: filteredResults.length,
            start: paginationData.start,
            end: paginationData.end,
          }}
        />
        {pagePlayers.length > 0 ? (
          <ul className="mt-4 flex w-full flex-col items-center justify-center">
            {pagePlayers.map((player: FootballPlayer, index: number) => (
              <li
                key={`${player.id}-${player.fullName.replaceAll(
                  " ",
                  "-"
                )}-${index}`}
                className="my-2 block w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
              >
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1 text-xs text-gray-400"
                  title={
                    (player.team.league && `League: ${player.team.league}`) ??
                    ""
                  }
                >
                  {player.team.league && `League: ${player.team.league}`}
                </p>
                <ImageWithFallback
                  className="justify-start rounded px-2 py-1 text-sm text-white"
                  alt={`${player.id}`}
                  width={67}
                  height={67}
                  src={player.image}
                  fallbackSrc="https://madden-assets-cdn.pulse.ea.com/madden23/portraits/64/0.png"
                />
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player.fullName}
                >
                  <label className="px-1 font-bold">Name: </label>
                  <span className="capitalize">{player.fullName}</span>
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player.team.fullName}
                >
                  <label className="px-1 font-bold">Team: </label>
                  {player.team.fullName}
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player?.position ?? ""}
                >
                  <label className="x-1 mx-1 font-bold">Position: </label>
                  {player?.position ?? "Unknown"}
                </p>
                <a href={player.url} target="_blank" rel="noreferrer">
                  <div className="flex items-center justify-center">
                    <p
                      className="w-fill m-1 mx-1 flex items-center justify-center py-2 px-1 text-sm"
                      title={player.source}
                    >
                      <GoLinkExternal className="mx-1" />
                      <label className="x-1 mx-1 font-bold">Source: </label>
                      {player.source}
                    </p>
                  </div>
                </a>
                {player.updatedAt && (
                  <span
                    className="flex justify-center rounded bg-gray-500 px-2 py-1 text-sm text-white"
                    title={player.position}
                  >
                    {`Updated At: ${GetLocal(player.updatedAt)}`}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Football);
