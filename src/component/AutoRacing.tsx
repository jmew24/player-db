import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import { AutoRacingPlayer, AutoRacingPlayerFilter } from "autoRacing";

import useGetAutoRacing from "@hook/useGetAutoRacing";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  searchTypeAtom,
  autoRacingItemsAtom,
  autoRacingTeamAtom,
  autoRacingLeagueAtom,
  autoRacingPositionAtom,
} from "@shared/jotai";

const getTeamName = (player: AutoRacingPlayer, searchType: string) => {
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

const AutoRacing = () => {
  const query = useAtomValue(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const autoRacingItems = useAtomValue(autoRacingItemsAtom);
  const setAutoRacingItems = useSetAtom(autoRacingItemsAtom);
  const autoRacingTeam = useAtomValue(autoRacingTeamAtom);
  const setAutoRacingTeam = useSetAtom(autoRacingTeamAtom);
  const autoRacingPosition = useAtomValue(autoRacingPositionAtom);
  const setAutoRacingPosition = useSetAtom(autoRacingPositionAtom);
  const autoRacingLeague = useAtomValue(autoRacingLeagueAtom);
  const setAutoRacingLeague = useSetAtom(autoRacingLeagueAtom);
  const [filter, setFilter] = useState<AutoRacingPlayerFilter>({
    position: autoRacingPosition,
    team: autoRacingTeam,
    league: autoRacingLeague,
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<AutoRacingPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetAutoRacing(query, searchType);
  const leagueFilters = useMemo(() => {
    const compare = (a: string, b: string) => {
      if (a === "Formula1") return -1;
      if (b === "Formula1") return 1;
      if (a === "Unknown") return 1;
      if (b === "Unknown") return -1;
      return a.localeCompare(b);
    };
    const leagues = new Set<string>();

    data?.forEach((player) => leagues.add(player.team.fullName));

    return Array.from(leagues).sort(compare);
  }, [data]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const leagueFilter = filter.league?.toLowerCase();

    const players = autoRacingItems.filter((player) => {
      const hasTeamName = getTeamName(player, searchType).some((name) =>
        name.toLowerCase().includes(teamFilter)
      );
      const hasLeague =
        player.team?.fullName?.toLowerCase() === leagueFilter.toLowerCase();

      if (teamFilter === "" && leagueFilter === "") {
        return true;
      }

      const teamCondition = teamFilter === "" || hasTeamName;
      const leagueCondition = leagueFilter === "" || hasLeague;

      return teamCondition && leagueCondition;
    });

    return players.sort((a: AutoRacingPlayer, b: AutoRacingPlayer) => {
      if (a.team?.fullName === "Formula1" && b.team?.fullName !== "Formula1")
        return -1;
      if (a.team?.fullName !== "Formula1" && b.team?.fullName === "Formula1")
        return 1;
      if (a.source === "formula1.com" && b.source !== "formula1.com") return -1;
      if (a.source !== "formula1.com" && b.source === "formula1.com") return 1;
      // If both players are from the same source, compare their teams
      if (a.source === b.source) {
        // If both players are from the same team, compare their positions
        if (a.team?.fullName === b.team?.fullName) {
          const aPos = parseInt(a.position, 10);
          const bPos = parseInt(b.position, 10);
          return aPos < bPos ? -1 : aPos > bPos ? 1 : 0;
        }
        return a.team?.fullName.localeCompare(b.team?.fullName);
      }
      if (a.team?.fullName === "Unknown" && b.team?.fullName !== "Unknown")
        return 1;
      if (a.team?.fullName !== "Unknown" && b.team?.fullName === "Unknown")
        return -1;
      // If both players are from different sources, compare their sources
      if (a.team?.fullName !== b.team?.fullName)
        return a.team?.fullName.localeCompare(b.team?.fullName);
      // If both players are from the same source and league, sort by full name
      return a.fullName.localeCompare(b.fullName);
    });
  }, [filter.league, filter.team, searchType, autoRacingItems]);
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
      setAutoRacingTeam(filter.team);
    } else {
      setAutoRacingTeam("");
    }
  }, [filter.team, setAutoRacingTeam]);

  useEffect(() => {
    if (filter.position) {
      setAutoRacingPosition(filter.position);
    } else {
      setAutoRacingPosition("");
    }
  }, [filter.position, setAutoRacingPosition]);

  useEffect(() => {
    if (filter.league) {
      setAutoRacingLeague(filter.league);
    } else {
      setAutoRacingLeague("");
    }
  }, [filter.league, setAutoRacingLeague]);

  useEffect(() => {
    if (data && data !== autoRacingItems) {
      setAutoRacingItems(data);
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [data, autoRacingItems, filter.league, leagueFilters, setAutoRacingItems]);

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
          <h1 className="text-6xl font-bold">AutoRacing</h1>
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
          <h1 className="text-6xl font-bold">AutoRacing</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">AutoRacing</h1>

        {searchType === "player" && (
          <>
            <h1 className="text-lg font-bold">Filters</h1>
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
          </>
        )}
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
            {pagePlayers.map((player: AutoRacingPlayer, index: number) => (
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
                    (player.team.fullName && `${player.team.fullName}`) ?? ""
                  }
                >
                  {player.team.fullName && `${player.team.fullName}`}
                </p>
                <ImageWithFallback
                  className="justify-start rounded px-2 py-1 text-sm text-white"
                  alt={`${player.fullName} image`}
                  width={67}
                  height={67}
                  src={player.image}
                  fallbackSrc="https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:67:current.png/w_426,q_auto:best/v1/people/1/headshot/67/current.jpg"
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
                  title={player.position}
                >
                  <label className="px-1 font-bold">Rank: </label>
                  {player?.position ?? "Unknown"}
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player?.number.toString() ?? ""}
                >
                  <label className="x-1 mx-1 font-bold">Points: </label>
                  {player?.number.toLocaleString() ?? "Unknown"}
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

export default memo(AutoRacing);
