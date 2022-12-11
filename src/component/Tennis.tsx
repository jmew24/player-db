import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import { TennisPlayer, TennisPlayerFilter } from "tennis";

import useGetTennis from "@hook/useGetTennis";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  searchTypeAtom,
  tennisItemsAtom,
  tennisTeamAtom,
  tennisLeagueAtom,
  tennisPositionAtom,
} from "@shared/jotai";

const Tennis = () => {
  const query = useAtomValue(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const tennisItems = useAtomValue(tennisItemsAtom);
  const setTennisItems = useSetAtom(tennisItemsAtom);
  const tennisTeam = useAtomValue(tennisTeamAtom);
  const setTennisTeam = useSetAtom(tennisTeamAtom);
  const tennisPosition = useAtomValue(tennisPositionAtom);
  const setTennisPosition = useSetAtom(tennisPositionAtom);
  const tennisLeague = useAtomValue(tennisLeagueAtom);
  const setTennisLeague = useSetAtom(tennisLeagueAtom);
  const [filter, setFilter] = useState<TennisPlayerFilter>({
    position: tennisPosition,
    team: tennisTeam,
    league: tennisLeague,
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<TennisPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetTennis(query, searchType);
  const leagueFilters = useMemo(() => {
    const leagues: string[] = [];

    data?.forEach((player) => {
      const league = player.team.fullName;
      if (!leagues.includes(league)) leagues.push(league);
    });

    return leagues;
  }, [data]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const leagueFilter = filter.league;

    return tennisItems.filter((player) => {
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
  }, [filter.league, filter.team, searchType, tennisItems]);
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
      setTennisTeam(filter.team);
    } else {
      setTennisTeam("");
    }
  }, [filter.team, setTennisTeam]);

  useEffect(() => {
    if (filter.position) {
      setTennisPosition(filter.position);
    } else {
      setTennisPosition("");
    }
  }, [filter.position, setTennisPosition]);

  useEffect(() => {
    if (filter.league) {
      setTennisLeague(filter.league);
    } else {
      setTennisLeague("");
    }
  }, [filter.league, setTennisLeague]);

  useEffect(() => {
    if (data && data !== tennisItems) {
      setTennisItems(data);
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [data, tennisItems, filter.league, leagueFilters, setTennisItems]);

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
          <h1 className="text-6xl font-bold">Tennis</h1>
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
          <h1 className="text-6xl font-bold">Tennis</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Tennis</h1>

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
            {pagePlayers.map((player: TennisPlayer, index: number) => (
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
                  fallbackSrc="https://pga-tour-res.cloudinary.com/image/upload/c_fill,d_headshots_default.png,dpr_2.0,f_auto,g_face:center,h_64,q_auto,w_64/headshots_1.png"
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

export default memo(Tennis);
