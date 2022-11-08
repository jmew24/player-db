import { useQuery } from "@tanstack/react-query";

import { proxy } from "@factory/proxy";
import { basketballCache } from "@factory/cache";

const searchNBA = async (query: string) => {
  const q = query.trim().toLowerCase();
  const cached = basketballCache.get("NBA");
  if (cached.length > 0)
    return cached.filter((player) =>
      player.displayName.toLowerCase().includes(q)
    );

  const response = (await proxy(
    `https://ca.global.nba.com/stats2/league/playerlist.json?locale=en`
  )) as NBAPlayerRequest;

  const players: NBAPlayer[] = [];
  for (const item of response.payload.players) {
    const player = item.playerProfile;
    players.push({
      id: player.playerId,
      code: player.code,
      displayName: player.displayName,
      firstName: player.firstName,
      lastName: player.lastName,
      jerseyNo: player.jerseyNo,
      position: player.position,
      team: item.teamProfile,
      url: `https://ca.global.nba.com/players/#!/${player.code}`,
      image: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.playerId}.png`,
      source: "NBA.com",
    } as NBAPlayer);
  }

  return basketballCache
    .set("NBA", players)
    .filter((player) => player.displayName.toLowerCase().includes(q));
};

export default function useGetBasketball(query: string) {
  const { isFetching, isLoading, isError, error, data } = useQuery(
    ["searchNBA", query],
    async () => await searchNBA(query.toLowerCase()),
    {
      enabled: !!query,
    }
  );

  return {
    isFetching,
    isLoading,
    isError,
    error,
    data,
  };
}
