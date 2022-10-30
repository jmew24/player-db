import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { footballCache } from "../factory/cache";
import ImageWithFallback from "./ImageWithFallback";

const teams: NFLTeam[] = [
  { name: "Arizona Cardinals", abbreviation: "ARI", teamName: "Cardinals" },
  { name: "Atlanta Falcons", abbreviation: "ATL", teamName: "Falcons" },
  { name: "Baltimore Ravens", abbreviation: "BAL", teamName: "Ravens" },
  { name: "Buffalo Bills", abbreviation: "BUF", teamName: "Bills" },
  { name: "Carolina Panthers", abbreviation: "CAR", teamName: "Panthers" },
  { name: "Chicago Bears", abbreviation: "CHI", teamName: "Bears" },
  { name: "Cincinnati Bengals", abbreviation: "CIN", teamName: "Bengals" },
  { name: "Cleveland Browns", abbreviation: "CLE", teamName: "Browns" },
  { name: "Dallas Cowboys", abbreviation: "DAL", teamName: "Cowboys" },
  { name: "Denver Broncos", abbreviation: "DEN", teamName: "Broncos" },
  { name: "Detroit Lions", abbreviation: "DET", teamName: "Lions" },
  { name: "Green Bay Packers", abbreviation: "GB", teamName: "Packers" },
  { name: "Houston Texans", abbreviation: "HOU", teamName: "Texans" },
  { name: "Indianapolis Colts", abbreviation: "IND", teamName: "Colts" },
  { name: "Jacksonville Jaguars", abbreviation: "JAX", teamName: "Jaguars" },
  { name: "Kansas City Chiefs", abbreviation: "KC", teamName: "Chiefs" },
  { name: "Las Vegas Raiders", abbreviation: "LV", teamName: "Raiders" },
  { name: "Los Angeles Chargers", abbreviation: "LAC", teamName: "Chargers" },
  { name: "Los Angeles Rams", abbreviation: "LAR", teamName: "Rams" },
  { name: "Miami Dolphins", abbreviation: "MIA", teamName: "Dolphins" },
  { name: "Minnesota Vikings", abbreviation: "MIN", teamName: "Vikings" },
  { name: "New England Patriots", abbreviation: "NE", teamName: "Patriots" },
  { name: "New Orleans Saints", abbreviation: "NO", teamName: "Saints" },
  { name: "New York Giants", abbreviation: "NYG", teamName: "Giants" },
  { name: "New York Jets", abbreviation: "NYJ", teamName: "Jets" },
  { name: "Philadelphia Eagles", abbreviation: "PHI", teamName: "Eagles" },
  { name: "Pittsburgh Steelers", abbreviation: "PIT", teamName: "Steelers" },
  { name: "San Francisco 49ers", abbreviation: "SF", teamName: "49ers" },
  { name: "Seattle Seahawks", abbreviation: "SEA", teamName: "Seahawks" },
  { name: "Tampa Bay Buccaneers", abbreviation: "TB", teamName: "Buccaneers" },
  { name: "Tennessee Titans", abbreviation: "TEN", teamName: "Titans" },
  {
    name: "Washington Commanders",
    abbreviation: "WAS",
    teamName: "Commanders",
  },
];

const searchNFL = async (query: string) => {
  const q = query.trim();
  const cached = footballCache.get(q.toLowerCase());
  if (cached.length > 0)
    return cached.filter((player) =>
      player.fullNameForSearch.toLowerCase().includes(q)
    );

  const response = (await proxy(
    `https://ratings-api.ea.com/v2/entities/m23-ratings?filter=((fullNameForSearch%3A*${q}*))&sort=firstName%3AASC`
  )) as NFLPlayerRequest;

  const players: NFLPlayer[] = [];
  for (const player of response.docs) {
    const teamName = player.team.toLowerCase();
    const team = teams.find((t) => t.teamName.toLowerCase() === teamName);
    players.push({
      id: player.primaryKey,
      assetname: player.plyrAssetname,
      fullNameForSearch: player.fullNameForSearch,
      firstName: player.firstName,
      lastName: player.lastName,
      jerseyNum: player.jerseyNum,
      position: player.position,
      portraitId: player.plyrPortrait,
      team: team,
      url: `https://www.ea.com/games/madden-nfl/player-ratings/player-name/${player.firstName}%20${player.lastName}/${player.primaryKey}`,
      image: `https://madden-assets-cdn.pulse.ea.com/madden23/portraits/64/${player.plyrPortrait}.png`,
      source: "EA.com",
    } as NFLPlayer);
  }

  return footballCache
    .set(q.toLowerCase(), players)
    .filter((player) => player.fullNameForSearch.toLowerCase().includes(q));
};

const useSearchNFL = (query: string) => {
  return useQuery(["searchNFL", query], () => searchNFL(query.toLowerCase()), {
    enabled: !!query,
  });
};

export const Football: FC<FootballProps> = ({ query, setShow }) => {
  const [results, setResults] = useState<NFLPlayer[]>([]);
  const [filter, setFilter] = useState<NFLPlayerFilter>({
    position: "",
    team: "",
  });
  const {
    isFetching: nflIsFetching,
    isLoading: nflIsLoading,
    data: nflData,
  } = useSearchNFL(query);
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
    if (nflData && nflData !== resultsRef.current) {
      resultsRef.current = nflData;
      setResults(nflData);
      setShow((state: SearchShowSport) => ({
        ...state,
        football: resultsRef.current.length > 0,
      }));
    }
  }, [nflData, setShow]);

  if (nflIsFetching || nflIsLoading)
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

      {nflIsFetching ?? nflIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
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
