import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import { FootballResponse, FootballPlayer, NFLPlayerRequest } from "football";

import { fetchRequest } from "@factory/fetchRequest";
import { proxy } from "@factory/proxy";
import { footballTeamCache, footballCache } from "@factory/cache";

const blankTeam: Team = {
  id: "-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  identifier: "-1",
  fullName: "Unknown",
  city: "Unknown",
  shortName: "Unknown",
  abbreviation: "Unknown",
  league: "Unknown",
  source: "Unknown",
  sportId: "-1",
};

const searchFootball = async (query: string) => {
  const q = query.trim();
  const teams = footballTeamCache.get();
  const players = footballCache.get(q);
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=football"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
      footballTeamCache.add(team);
    }
  }

  const response = (await fetchRequest(
    `/api/players?sport=football&query=${q}`
  )) as FootballResponse[];

  for (const item of response) {
    const team =
      teams.find((team) => team.identifier === item.team.identifier) ||
      item.team ||
      blankTeam;

    players.push({
      id: item.id,
      updatedAt: item.updatedAt,
      fullName: item.fullName,
      firstName: item.firstName,
      lastName: item.lastName,
      number: item.number,
      team: team,
      position: item.position,
      isPlayer: true,
      url: item.linkUrl,
      image: item.headshotUrl,
      source: item.source,
      sport: item.sport,
    } as FootballPlayer);
  }

  const EAResponse = (await proxy(
    `https://ratings-api.ea.com/v2/entities/m23-ratings?filter=((fullNameForSearch%3A*${q}*))&sort=firstName%3AASC`
  )) as NFLPlayerRequest;

  const queryFirstName = q.split(" ")[0] || "";
  const queryLastName = q.split(" ")[1] || "";
  for (const item of EAResponse.docs) {
    const teamName = item.team.toLowerCase();
    const team =
      teams.find(
        (team) =>
          team.abbreviation.toLowerCase() === teamName.toLowerCase() ||
          team.fullName.toLowerCase() === teamName.toLowerCase() ||
          team.shortName.toLowerCase() === teamName.toLowerCase() ||
          team.city.toLowerCase() === teamName.toLowerCase()
      ) || blankTeam;

    if (
      players.find(
        (player) =>
          (player.fullName.toLowerCase() ===
            item.fullNameForSearch.toLowerCase() ||
            (player.firstName === item.firstName &&
              player.lastName === item.lastName)) &&
          player.team.id === team.id
      )
    )
      continue;

    if (
      queryFirstName !== "" &&
      queryLastName !== "" &&
      (!item.firstName.toLowerCase().includes(queryFirstName.toLowerCase()) ||
        !item.lastName.toLowerCase().includes(queryLastName.toLowerCase()))
    )
      continue;

    players.push({
      id: item.primaryKey,
      updatedAt: null,
      fullName: item.fullNameForSearch,
      firstName: item.firstName,
      lastName: item.lastName,
      number: item.jerseyNum,
      team: team,
      position: item.position,
      isPlayer: true,
      url: `https://www.ea.com/games/madden-nfl/player-ratings/player-name/${item.firstName}%20${item.lastName}/${item.primaryKey}`,
      image: `https://madden-assets-cdn.pulse.ea.com/madden23/portraits/64/${item.plyrPortrait}.png`,
      source: "EA.com",
    } as FootballPlayer);
  }

  return footballCache.set(q, players);
};

export default function useGetFootball(query: string) {
  const { isFetching, isLoading, isError, error, data } = useQuery(
    ["searchFootball", query],
    async () => await searchFootball(query.toLowerCase()),
    { enabled: !!query }
  );

  return {
    isFetching,
    isLoading,
    isError,
    error,
    data,
  };
}
