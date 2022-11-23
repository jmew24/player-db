import { useQuery } from "@tanstack/react-query";
import { Team } from "@prisma/client";
import { BasketballResponse, BasketballPlayer } from "basketball";

import { fetchRequest } from "@factory/fetchRequest";
import { basketballTeamCache, basketballCache } from "@factory/cache";

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

const searchBasketball = async (query: string) => {
  const q = query.trim();
  const teams = basketballTeamCache.get();
  const players = basketballCache.get(q);
  if (players.length > 0) return players;

  if (teams.length <= 0) {
    const teamResponse = (await fetchRequest(
      "/api/teams?sport=basketball"
    )) as Team[];

    for (const team of teamResponse) {
      teams.push(team);
      basketballTeamCache.add(team);
    }
  }

  const response = (await fetchRequest(
    `/api/players?sport=basketball&query=${q}`
  )) as BasketballResponse[];

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
    } as BasketballPlayer);
  }

  return basketballCache.set(q, players);
};

export default function useGetBasketball(query: string) {
  const { isFetching, isLoading, isError, error, data } = useQuery(
    ["searchBasketball", query],
    async () => await searchBasketball(query.toLowerCase()),
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
