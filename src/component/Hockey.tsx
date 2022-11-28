import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import { HockeyPlayer, NHLPlayerFilter, NHLPosition } from "hockey";

import useGetHockey from "@hook/useGetHockey";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  showAtom,
  hockeyItemsAtom,
  setHockeyItemsAtom,
} from "@shared/jotai";

const Hockey = () => {
  const query = useAtomValue(queryAtom);
  const setShow = useSetAtom(showAtom);
  const hockeyItems = useAtomValue(hockeyItemsAtom);
  const setHockeyItems = useSetAtom(setHockeyItemsAtom);
  const [filter, setFilter] = useState<NHLPlayerFilter>({
    position: "",
    team: "",
    league: "",
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<HockeyPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetHockey(query);
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

    return hockeyItems.filter((player) => {
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
      const hasPosition =
        player.position?.toLowerCase() === positionFilter.toLowerCase();
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
      if (positionFilter !== "") {
        if (positionFilter === "F")
          return (
            player.position === "C" ||
            player.position === "RW" ||
            player.position === "LW"
          );
        return hasPosition;
      }
      if (leagueFilter !== "") return hasLeague;
      return true;
    });
  }, [filter.team, filter.position, filter.league, hockeyItems]);
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
    if (data && data !== hockeyItems) {
      setHockeyItems(data);
      setShow({ hockey: data.length > 0 });
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [
    data,
    setShow,
    filter.league,
    leagueFilters,
    hockeyItems,
    setHockeyItems,
  ]);

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

  if (isFetching || isLoading)
    return (
      <div className="items-center justify-center py-2">
        <div className="mt-4 w-full">
          <h1 className="text-6xl font-bold">Hockey</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Hockey</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 justify-center  rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as NHLPosition,
              })
            }
            disabled={data?.length === 0}
          >
            <option value="">All Positions</option>
            <option value="F">Forward</option>
            <option value="C">Center</option>
            <option value="RW">Right Wing</option>
            <option value="LW">Left Wing</option>
            <option value="D">Defense</option>
            <option value="G">Goalie</option>
            <option value="Staff">Staff</option>
          </select>
          <input
            className="mx-2 h-10 w-1/2 flex-grow rounded border-gray-500 bg-gray-700 px-5 text-gray-200 outline-double outline-1 focus:outline-none focus:ring"
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
            {pagePlayers.map((player: HockeyPlayer, index: number) => {
              return (
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
                    fallbackSrc="https://cms.nhl.bamgrid.com/images/headshots/current/168x168/skater.jpg"
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
              );
            })}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Hockey);
