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
    const leagues: string[] = [];

    data?.forEach((player) => {
      if (!leagues.includes(player.team.fullName))
        leagues.push(player.team.fullName);
    });

    return leagues;
  }, [data]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const leagueFilter = filter.league;

    return autoRacingItems.filter((player) => {
      const team =
        searchType === "player"
          ? {
              name: player.team.fullName?.toLowerCase(),
              abbreviation: player.team.abbreviation?.toLowerCase(),
              city: player.team.city?.toLowerCase(),
              shortName: player.team.shortName?.toLowerCase(),
            }
          : {
              name: player.fullName?.toLowerCase(),
              abbreviation: player.firstName?.toLowerCase(),
              city: player.lastName?.toLowerCase(),
              shortName: player.firstName?.toLowerCase(),
            };
      const hasTeamName =
        team.name?.includes(teamFilter) ||
        team.abbreviation?.includes(teamFilter) ||
        team.city?.includes(teamFilter) ||
        team.shortName?.includes(teamFilter);
      const hasLeague =
        player.team?.fullName?.toLowerCase() === leagueFilter.toLowerCase();

      if (teamFilter !== "" && leagueFilter !== "")
        return hasTeamName && hasLeague;
      if (teamFilter !== "") return hasTeamName;
      if (leagueFilter !== "") return hasLeague;
      return true;
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
      setPagePlayers(
        filteredResults
          .sort((a, b) => parseInt(a.position) - parseInt(b.position))
          .slice(start, end)
      );
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
                className="mx-2 w-full justify-center  rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
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
                  alt={`${player.id}`}
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

export default memo(AutoRacing);
