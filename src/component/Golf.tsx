import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import { GolfPlayer, GolfPlayerFilter } from "golf";

import useGetGolf from "@hook/useGetGolf";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  searchTypeAtom,
  golfItemsAtom,
  golfTeamAtom,
  golfLeagueAtom,
  golfPositionAtom,
} from "@shared/jotai";

const Golf = () => {
  const query = useAtomValue(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const golfItems = useAtomValue(golfItemsAtom);
  const setGolfItems = useSetAtom(golfItemsAtom);
  const golfTeam = useAtomValue(golfTeamAtom);
  const setGolfTeam = useSetAtom(golfTeamAtom);
  const golfPosition = useAtomValue(golfPositionAtom);
  const setGolfPosition = useSetAtom(golfPositionAtom);
  const golfLeague = useAtomValue(golfLeagueAtom);
  const setGolfLeague = useSetAtom(golfLeagueAtom);
  const [filter, setFilter] = useState<GolfPlayerFilter>({
    position: golfPosition,
    team: golfTeam,
    league: golfLeague,
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<GolfPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetGolf(query, searchType);
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
    const positionFilter = filter.position?.toLowerCase();
    const leagueFilter = filter.league?.toLowerCase();

    return golfItems.filter((player) => {
      const team = player.position?.toLowerCase();
      const hasTeamName = team.includes(teamFilter);
      const hasPosition =
        positionFilter === "all" ||
        (positionFilter === "active" && player?.number >= 1) ||
        (positionFilter === "inactive" && player?.number === 0);
      const hasLeague =
        player.team?.fullName?.toLowerCase() === leagueFilter.toLowerCase();

      return (
        (teamFilter !== "" &&
          positionFilter !== "" &&
          leagueFilter !== "" &&
          hasTeamName &&
          hasPosition &&
          hasLeague) ||
        (teamFilter !== "" &&
          positionFilter !== "" &&
          hasTeamName &&
          hasPosition) ||
        (teamFilter !== "" &&
          leagueFilter !== "" &&
          hasTeamName &&
          hasLeague) ||
        (positionFilter !== "" &&
          leagueFilter !== "" &&
          hasPosition &&
          hasLeague) ||
        (teamFilter !== "" && hasTeamName) ||
        (positionFilter !== "" && hasPosition) ||
        (leagueFilter !== "" && hasLeague) ||
        (teamFilter === "" && positionFilter === "" && leagueFilter === "")
      );
    });
  }, [filter.team, filter.position, filter.league, golfItems]);
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
      setGolfTeam(filter.team);
    } else {
      setGolfTeam("");
    }
  }, [filter.team, setGolfTeam]);

  useEffect(() => {
    if (filter.position) {
      setGolfPosition(filter.position);
    } else {
      setGolfPosition("");
    }
  }, [filter.position, setGolfPosition]);

  useEffect(() => {
    if (filter.league) {
      setGolfLeague(filter.league);
    } else {
      setGolfLeague("");
    }
  }, [filter.league, setGolfLeague]);

  useEffect(() => {
    if (data && data !== golfItems) {
      setGolfItems(data);
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [data, golfItems, filter.league, leagueFilters, setGolfItems]);

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
          <h1 className="text-6xl font-bold">Golf</h1>
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
          <h1 className="text-6xl font-bold">Golf</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Golf</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 flex w-1/2 items-center justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value,
              })
            }
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            className="mx-2 h-10 w-1/2 flex-grow rounded border-gray-500 bg-gray-700 px-5 text-gray-200 outline-double outline-1 outline-gray-500 focus:outline-none focus:ring"
            type="text"
            value={filter.team}
            onChange={(e) => setFilter({ ...filter, team: e.target.value })}
            placeholder={"Country"}
          />
        </div>
        {searchType === "player" && (
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
            {pagePlayers.map((player: GolfPlayer, index: number) => (
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
                  <label className="px-1 font-bold">Country: </label>
                  {player?.position ?? "Unknown"}
                </p>
                <p
                  className="w-fill m-1 flex items-center justify-center py-2 px-1"
                  title={player?.number.toString() ?? ""}
                >
                  <label className="x-1 mx-1 font-bold">Active: </label>
                  {player?.number ? "Yes" : "No"}
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

export default memo(Golf);
