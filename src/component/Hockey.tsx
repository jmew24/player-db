import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { proxy } from "../factory/proxy";
import { hockeyCache, hockeyTeamCache } from "../factory/cache";
import ImageWithFallback from "./ImageWithFallback";

const blankTeam: NHLTeam = {
  id: -1,
  name: "Unknown",
  abbreviation: "",
  teamName: "Unknown",
  shortName: "",
};

const getTeams = async () => {
  const cached = hockeyTeamCache.get();
  if (cached.length > 0) return cached;

  const response = await proxy(`https://statsapi.web.nhl.com/api/v1/teams`);

  const teams: NHLTeam[] = [blankTeam];
  for (const item of response.teams) {
    teams.push({
      id: item.id,
      name: item.name,
      abbreviation: item.abbreviation,
      teamName: item.teamName,
      shortName: item.shortName,
    } as NHLTeam);
  }

  return hockeyTeamCache.set(teams);
};

const useGetNHLTeams = () => {
  return useQuery(["useGetNHLTeams"], () => getTeams());
};

const searchNHL = async (query: string, t: NHLTeam[] | undefined) => {
  const teams = t || ([] as NHLTeam[]);
  const q = query.trim();
  const cached = hockeyCache.get(q.toLowerCase());
  if (cached.length > 0) return cached;

  const nhlResponse = (await proxy(
    `https://suggest.svc.nhl.com/svc/suggest/v1/players/${q}/99999`
  )) as NHLPlayerResult;

  const players: NHLPlayer[] = [];
  for (const item of nhlResponse.suggestions) {
    const person = item.person;
    const position = item.position;
    const teamAbbreviation = item.team.abbreviation;
    const team = teams.find(
      (team) => team.abbreviation === teamAbbreviation
    ) || { ...blankTeam };

    players.push({
      id: parseInt(person.id || "-1"),
      lastName: person.lastName,
      firstName: person.firstName,
      team: team,
      position: position.abbreviation,
      number: parseInt(item.jerseyNumber || "-1"),
      experience: "NHL",
      _type: item.type,
      url: `https://www.nhl.com/player/${person.otherNames.slug}`,
      image: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${person.id}.jpg`,
      source: "NHL.com",
    } as NHLPlayer);
  }

  const eliteProspectsResponse = (await proxy(
    `https://autocomplete.eliteprospects.com/all?q=${q}`
  )) as EliteProspectsResult[];

  for (const item of eliteProspectsResponse) {
    const _type = item._type?.toLowerCase();
    if (_type !== "player" && _type !== "staff") continue;

    const firstName = item.fullname?.split(" ")[0] || "";
    const lastName = item.fullname.split(" ")[1] || "";
    const teamName = item.team;
    const team = teams.find(
      (team) =>
        team.name === teamName ||
        team.abbreviation === teamName ||
        team.teamName === teamName ||
        team.shortName === teamName
    ) || { ...blankTeam };

    if (
      players.find(
        (player) =>
          player.firstName === firstName &&
          player.lastName === lastName &&
          player.team.name === team.name
      )
    )
      continue;

    players.push({
      id: parseInt(item.id || "-1"),
      lastName: lastName,
      firstName: firstName,
      team: team,
      position: item.position,
      number: -1,
      experience: item.experience,
      _type: _type,
      url:
        _type === "player"
          ? `https://www.eliteprospects.com/player/${
              item.id
            }/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}`
          : `https://www.eliteprospects.com/staff/${
              item.id
            }/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}`,
      image: `https://cms.nhl.bamgrid.com/images/headshots/current/168x168/skater.jpg`,
      source: "EliteProspects.com",
    } as NHLPlayer);
  }

  return hockeyCache.set(q.toLowerCase(), players);
};

const useSearchNHL = (query: string, teams: NHLTeam[] | undefined) => {
  return useQuery(
    ["searchNHL", query, teams],
    () => searchNHL(query.toLowerCase(), teams),
    {
      enabled: !!query && teams !== undefined,
    }
  );
};

export const Hockey: FC<HockeyProps> = ({ query, setShow }) => {
  const [results, setResults] = useState<NHLPlayer[]>([]);
  const [filter, setFilter] = useState<NHLFilter>({
    position: "",
    team: "",
  });
  const {
    isFetching: nhlTeamIsFetching,
    isLoading: nhlTeamIsLoading,
    data: nhlTeamsData,
  } = useGetNHLTeams();
  const {
    isFetching: nhlIsFetching,
    isLoading: nhlIsLoading,
    data: nhlData,
  } = useSearchNHL(query, nhlTeamsData);
  const resultsRef = useRef<NHLPlayer[]>([]);
  const filteredResults = useMemo(() => {
    const teamFilter = filter.team?.toLowerCase();
    const positionFilter = filter.position;

    return results.filter((player) => {
      const team = {
        name: player.team.name?.toLowerCase(),
        abbreviation: player.team.abbreviation?.toLowerCase(),
        teamName: player.team.teamName?.toLowerCase(),
        shortName: player.team.shortName?.toLowerCase(),
      };
      const hasTeamName =
        team.name?.includes(teamFilter) ||
        team.abbreviation?.includes(teamFilter) ||
        team.teamName?.includes(teamFilter) ||
        team.shortName?.includes(teamFilter);

      if (teamFilter !== "" && positionFilter !== "")
        return hasTeamName && player.position === positionFilter;
      if (teamFilter !== "") return hasTeamName;
      if (positionFilter !== "") {
        if (positionFilter === "F")
          return (
            player.position === "C" ||
            player.position === "RW" ||
            player.position === "LW"
          );
        return player.position === positionFilter;
      }
      return true;
    });
  }, [filter.position, filter.team, results]);

  useEffect(() => {
    if (nhlData && nhlData !== resultsRef.current) {
      resultsRef.current = nhlData;
      setResults(nhlData);
      setShow((state: SearchShowSport) => ({
        ...state,
        hockey: resultsRef.current.length > 0,
      }));
    }
  }, [nhlData, setShow]);

  if (nhlTeamIsFetching || nhlIsFetching || nhlTeamIsLoading || nhlIsLoading)
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

  return resultsRef.current.length > 0 ? (
    <div className="items-center justify-center py-2">
      <div className="mt-4 w-full">
        <h1 className="text-6xl font-bold">Hockey</h1>

        <h1 className="text-lg font-bold">Filters</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/2 rounded border border-gray-300 p-2 text-gray-600"
            value={filter.position}
            onChange={(e) =>
              setFilter({
                ...filter,
                position: e.target.value as NHLPosition,
              })
            }
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
            className="mx-2 h-10 w-1/2 flex-grow rounded-l px-5 text-gray-600 outline-double outline-1 focus:outline-none focus:ring"
            type="text"
            value={filter.team}
            onChange={(e) => setFilter({ ...filter, team: e.target.value })}
            placeholder="Team"
          />
        </div>
      </div>

      {nhlIsFetching ?? nhlIsLoading ? (
        <h1 className="mt-4 text-2xl">Loading...</h1>
      ) : filteredResults.length > 0 ? (
        <ul className="mt-4 flex w-full flex-col items-center justify-center">
          {filteredResults.map((player: NHLPlayer, index: number) => {
            return (
              <li
                key={`${player.id}-${player.firstName}-${player.lastName}-${index}`}
                className="my-2 flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 text-lg"
              >
                <ImageWithFallback
                  className="justify-start rounded px-2 py-1 text-sm text-white"
                  alt={`${player.id}`}
                  width={67}
                  height={67}
                  src={player.image}
                  fallbackSrc="https://cms.nhl.bamgrid.com/images/headshots/current/168x168/skater.jpg"
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
            );
          })}
        </ul>
      ) : null}
    </div>
  ) : null;
};
