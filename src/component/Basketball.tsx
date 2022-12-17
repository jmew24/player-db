import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import type {
  BasketballPlayer,
  NBAPlayerFilter,
  NBAPosition,
} from "basketball";

import useGetBasketball from "@hook/useGetBasketball";
import ImageWithFallback from "@component/ImageWithFallback";
import Pagination from "@component/Pagination";
import { GetLocal } from "@shared/utils";
import {
  queryAtom,
  searchTypeAtom,
  basketballItemsAtom,
  basketballTeamAtom,
  basketballLeagueAtom,
  basketballPositionAtom,
} from "@shared/jotai";

const getTeamName = (player: BasketballPlayer, searchType: string) => {
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

const Basketball = () => {
  const query = useAtomValue(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const basketballItems = useAtomValue(basketballItemsAtom);
  const setBasketballItems = useSetAtom(basketballItemsAtom);
  const basketballTeam = useAtomValue(basketballTeamAtom);
  const setBasketballTeam = useSetAtom(basketballTeamAtom);
  const basketballPosition = useAtomValue(basketballPositionAtom);
  const setBasketballPosition = useSetAtom(basketballPositionAtom);
  const basketballLeague = useAtomValue(basketballLeagueAtom);
  const setBasketballLeague = useSetAtom(basketballLeagueAtom);
  const [filter, setFilter] = useState<NBAPlayerFilter>({
    position: basketballPosition,
    team: basketballTeam,
    league: basketballLeague,
  });
  const [page, setPage] = useState<number>(0);
  const [paginationData, setPaginationData] = useState({
    start: 0,
    end: 0,
  });
  const [pagePlayers, setPagePlayers] = useState<BasketballPlayer[]>([]);
  const playersPerPage = 10;
  const { isFetching, isLoading, data } = useGetBasketball(query, searchType);
  const leagueFilters = useMemo(() => {
    const compare = (a: string, b: string) => {
      if (a === "National Basketball Association") return -1;
      if (b === "National Basketball Association") return 1;
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

    const players = basketballItems.filter((player) => {
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

    return players.sort((a: BasketballPlayer, b: BasketballPlayer) => {
      if (
        a.team?.league === "National Basketball Association" &&
        b.team?.league !== "National Basketball Association"
      )
        return -1;
      if (
        a.team?.league !== "National Basketball Association" &&
        b.team?.league === "National Basketball Association"
      )
        return 1;
      if (a.source === "NBA.com" && b.source !== "NBA.com") return -1;
      if (a.source !== "NBA.com" && b.source === "NBA.com") return 1;
      if (a.team?.league === "Unknown" && b.team?.league !== "Unknown")
        return 1;
      if (a.team?.league !== "Unknown" && b.team?.league === "Unknown")
        return -1;
      return a.fullName.localeCompare(b.fullName);
    });
  }, [
    filter.team,
    filter.position,
    filter.league,
    basketballItems,
    searchType,
  ]);
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
      setBasketballTeam(filter.team);
    } else {
      setBasketballTeam("");
    }
  }, [filter.team, setBasketballTeam]);

  useEffect(() => {
    if (filter.position) {
      setBasketballPosition(filter.position);
    } else {
      setBasketballPosition("");
    }
  }, [filter.position, setBasketballPosition]);

  useEffect(() => {
    if (filter.league) {
      setBasketballLeague(filter.league);
    } else {
      setBasketballLeague("");
    }
  }, [filter.league, setBasketballLeague]);

  useEffect(() => {
    if (data && data !== basketballItems) {
      setBasketballItems(data);
      if (leagueFilters.length > 0 && leagueFilters.indexOf(filter.league) < 0)
        setFilter((state) => ({ ...state, league: "" }));
      setPage(0);
    }
  }, [data, basketballItems, filter.league, leagueFilters, setBasketballItems]);

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
          <h1 className="text-6xl font-bold">Basketball</h1>
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
          <h1 className="text-6xl font-bold">Basketball</h1>
        </div>
        <div className="mt-4 w-full">
          <h1 className="mt-4 text-2xl">Loading...</h1>
        </div>
      </div>
    );

  return (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Basketball</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 flex w-1/2 items-center justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
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
            {pagePlayers.map((player: BasketballPlayer, index: number) => (
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

export default memo(Basketball);
