import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import type { SoccerPlayer, SoccerPlayerFilter, SoccerPosition } from "soccer";

import useGetSoccer from "@hook/useGetSoccer";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  searchTypeAtom,
  soccerItemsAtom,
  soccerTeamAtom,
  soccerPositionAtom,
  soccerLeagueAtom,
} from "@shared/jotai";

const getTeamName = (player: SoccerPlayer, searchType: string) => {
  if (searchType === "player") {
    return [
      player.team.fullName?.toLowerCase(),
      player.team.abbreviation?.toLowerCase(),
      player.team.city?.toLowerCase(),
      player.team.shortName?.toLowerCase(),
    ];
  }
  return [
    player.fullName?.toLowerCase(),
    player.firstName?.toLowerCase(),
    player.lastName?.toLowerCase(),
    player.firstName?.toLowerCase(),
  ];
};

const Soccer = () => {
  const query = useAtomValue(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const soccerItems = useAtomValue(soccerItemsAtom);
  const setSoccerItems = useSetAtom(soccerItemsAtom);
  const soccerTeam = useAtomValue(soccerTeamAtom);
  const setSoccerTeam = useSetAtom(soccerTeamAtom);
  const soccerPosition = useAtomValue(soccerPositionAtom);
  const setSoccerPosition = useSetAtom(soccerPositionAtom);
  const soccerLeague = useAtomValue(soccerLeagueAtom);
  const setSoccerLeague = useSetAtom(soccerLeagueAtom);
  const [filter, setFilter] = useState<SoccerPlayerFilter>({
    position: soccerPosition,
    team: soccerTeam,
    league: soccerLeague,
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<SoccerPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetSoccer(query, searchType);
  const leagueFilters = useMemo(() => {
    const compare = (a: string, b: string) => {
      if (a === "English Premier League") return -1;
      if (b === "English Premier League") return 1;
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return a.localeCompare(b);
    };
    const leagues = new Set<string>();

    data?.forEach((player) => leagues.add(player.team.league));

    return Array.from(leagues).sort(compare);
  }, [data]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position?.toLowerCase();
    const leagueFilter = filter.league?.toLowerCase();

    const players = soccerItems.filter((player) => {
      const hasTeamName = getTeamName(player, searchType).some((name) =>
        name.toLowerCase().includes(teamFilter)
      );
      const hasPosition = player.position?.toLowerCase() === positionFilter;
      const hasLeague = player.team?.league?.toLowerCase() === leagueFilter;

      if (teamFilter === "" && positionFilter === "" && leagueFilter === "") {
        return true;
      }

      const teamCondition = teamFilter === "" || hasTeamName;
      const positionCondition = positionFilter === "" || hasPosition;
      const leagueCondition = leagueFilter === "" || hasLeague;

      return teamCondition && positionCondition && leagueCondition;
    });

    return players.sort((a: SoccerPlayer, b: SoccerPlayer) => {
      if (
        a.team?.league === "English Premier League" &&
        b.team?.league !== "English Premier League"
      )
        return -1;
      if (
        a.team?.league !== "English Premier League" &&
        b.team?.league === "English Premier League"
      )
        return 1;
      if (a.source === "ESPN.com" && b.source !== "ESPN.com") return -1;
      if (a.source !== "ESPN.com" && b.source === "ESPN.com") return 1;
      if (a.team?.league === "Unknown" && b.team?.league !== "Unknown")
        return 1;
      if (a.team?.league !== "Unknown" && b.team?.league === "Unknown")
        return -1;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [filter.team, filter.position, filter.league, soccerItems, searchType]);
  const pages = useMemo(() => {
    return Math.ceil(filteredResults.length / playersPerPage);
  }, [filteredResults.length]);
  const pagesArray = useMemo(() => [...Array(pages).keys()], [pages]);
  const pagesDisplay = useMemo(() => {
    const selectedPage = page - 1;
    const firstPage = Math.max(selectedPage - 1, 0);
    const lastPage = Math.min(selectedPage + 4, pages - 1);

    return pagesArray.slice(firstPage, lastPage + 1);
  }, [pages, pagesArray, page]);

  useEffect(() => {
    if (filter.team) {
      setSoccerTeam(filter.team);
    } else {
      setSoccerTeam("");
    }
  }, [filter.team, setSoccerTeam]);

  useEffect(() => {
    if (filter.position) {
      setSoccerPosition(filter.position);
    } else {
      setSoccerPosition("");
    }
  }, [filter.position, setSoccerPosition]);

  useEffect(() => {
    if (filter.league) {
      setSoccerLeague(filter.league);
    } else {
      setSoccerLeague("");
    }
  }, [filter.league, setSoccerLeague]);

  useEffect(() => {
    if (data && data !== soccerItems) {
      setSoccerItems(data);
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [data, filter.league, leagueFilters, soccerItems, setSoccerItems]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

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

  if (query === "")
    return (
      <div className="items-center justify-center py-2">
        <div className="mt-4 w-full">
          <h1 className="text-6xl font-bold">Soccer</h1>
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
          <h1 className="text-6xl font-bold">Soccer</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Soccer</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 flex w-1/2 items-center justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as SoccerPosition,
              })
            }
          >
            <option value="">All Positions</option>
            <option value="Forward">Forward</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
            <option value="Goalkeeper">Goalkeeper</option>
          </select>
          <input
            className="mx-2 h-10 w-1/2 flex-grow rounded border-gray-500 bg-gray-700 px-5 text-gray-200 outline-double outline-1 outline-gray-500 focus:outline-none focus:ring"
            type="text"
            value={filter.team}
            onChange={(e) => setFilter({ ...filter, team: e.target.value })}
            placeholder={searchType === "player" ? "Team" : "Name"}
          />
        </div>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 flex w-full items-center justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
            value={filter.league}
            onChange={(e) =>
              setFilter({ ...filter, league: e.target.value as string })
            }
            title="League Filter"
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
            {pagePlayers.map((player: SoccerPlayer, index: number) => (
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
                  fallbackSrc="https://d2zywfiolv4f83.cloudfront.net/img/comparision_player.png"
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
                    title="Last Checked"
                  >
                    {`Last Checked: ${GetLocal(player.updatedAt)}`}
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

export default memo(Soccer);
