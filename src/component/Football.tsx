import { memo, useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GoLinkExternal } from "react-icons/go";
import type { FootballPlayer, NFLPlayerFilter, NFLPosition } from "football";

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

const getTeamName = (player: FootballPlayer, searchType: string) => {
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
    const compare = (a: string, b: string) => {
      if (a === "National Football League") return -1;
      if (b === "National Football League") return 1;
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

    const players = footballItems.filter((player) => {
      const hasTeamName = getTeamName(player, searchType).some((name) =>
        name.toLowerCase().includes(teamFilter)
      );
      const hasLeague = player.team?.league?.toLowerCase() === leagueFilter;
      const positions: {
        [key: string]: string;
      } = {
        Quarterback: "QB",
        Center: "C",
        "Offensive Guard": "OG",
        "Full Back": "FB",
        "Half Back": "HB",
        "Wide Receiver": "WR",
        "Tight End": "TE",
        "Left Tackle": "LT",
        "Right Tackle": "RT",
        "Defensive End": "DE",
        "Offensive Tackle": "OT",
        "Defensive Tackle": "DT",
        "Middle Linebacker": "LB",
        "Right Outside Linebacker": "LB",
        "Outside Linebacker": "LB",
        "Left Outside Linebacker": "LB",
        "Right Inside Linebacker": "LB",
        "Inside Linebacker": "LB",
        "Left Inside Linebacker": "LB",
        "Right Defensive End": "DE",
        "Left Defensive End": "DE",
        "Right Defensive Tackle": "DT",
        "Left Defensive Tackle": "DT",
        "Right Cornerback": "CB",
        "Left Cornerback": "CB",
        Cornerback: "CB",
        Safety: "S",
        "Strong Safety": "S",
        "Free Safety": "S",
        Kicker: "K",
        Punter: "P",
        "Long Snapper": "LS",
        "Place Kicker": "PK",
        "Kick Returner": "KR",
        "Punt Returner": "PR",
        "Kickoff Returner": "KR",
        "Kick Return Specialist": "KR",
        "Punt Return Specialist": "PR",
        "Kickoff Return Specialist": "KR",
        "Kick Return": "KR",
        "Punt Return": "PR",
        "Kickoff Return": "KR",
      };
      const position = player.position ?? "";
      const abbreviation = positions[position] ?? "";
      const hasPosition =
        position.toLowerCase() === positionFilter.toLowerCase() ||
        abbreviation.toLowerCase() === positionFilter.toLowerCase();

      if (teamFilter === "" && positionFilter === "" && leagueFilter === "") {
        return true;
      }

      const teamCondition = teamFilter === "" || hasTeamName;
      const positionCondition = positionFilter === "" || hasPosition;
      const leagueCondition = leagueFilter === "" || hasLeague;

      return teamCondition && positionCondition && leagueCondition;
    });

    return players.sort((a: FootballPlayer, b: FootballPlayer) => {
      if (
        a.team?.league === "National Football League" &&
        b.team?.league !== "National Football League"
      )
        return -1;
      if (
        a.team?.league !== "National Football League" &&
        b.team?.league === "National Football League"
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
  }, [filter.team, filter.position, filter.league, footballItems, searchType]);
  const pages = useMemo(() => {
    return Math.ceil(filteredResults.length / playersPerPage);
  }, [filteredResults.length]);
  const pagesArray = useMemo(() => [...Array(pages).keys()], [pages]);
  const pagesDisplay = useMemo(() => {
    const NUM_PAGES_TO_DISPLAY = 4;
    const currentPage = page - 1;
    const firstPage = Math.max(0, currentPage - 1);
    const lastPage = Math.min(pages, currentPage + NUM_PAGES_TO_DISPLAY);

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
            className="mx-2 flex w-1/2 items-center justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
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

export default memo(Football);
