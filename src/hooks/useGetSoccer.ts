import { useQuery } from "@tanstack/react-query";

import { proxy } from "@factory/proxy";
import { soccerCache } from "@factory/cache";

const searchSoccer = async (query: string) => {
  const q = query.trim().toLowerCase();
  const cached = soccerCache.get("Soccer");
  if (cached.length > 0)
    return cached.filter((player) => player.name.toLowerCase().includes(q));

  const response = (await proxy(
    `https://www.whoscored.com/StatisticsFeed/1/GetPlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=false&playerId=&teamIds=&age=&ageComparisonType=&appearances=&appearancesComparisonType=&field=Overall&nationality=&positionOptions=&isMinApp=false&page=&includeZeroValues=&numberOfPlayersToPick=10000`
  )) as SoccerPlayerRequest;

  const players: SoccerPlayer[] = [];
  for (const player of response.playerTableStats) {
    players.push({
      id: player.playerId,
      name: player.name,
      firstName: player.firstName,
      lastName: player.lastName,
      playedPositions: player.playedPositions,
      playedPositionsShort: player.playedPositionsShort,
      positionText: player.positionText,
      teamRegionName: player.teamRegionName,
      regionCode: player.regionCode,
      teamId: player.teamId,
      teamName: player.teamName,
      url: `https://www.whoscored.com/Players/${player.playerId}/Show`,
      image: `https://d2zywfiolv4f83.cloudfront.net/img/players/${player.playerId}.jpg`,
      source: "whoscored.com",
    } as SoccerPlayer);
  }

  return soccerCache
    .set("Soccer", players)
    .filter((player) => player.name.toLowerCase().includes(q));
};

export default function useGetSoccer(query: string) {
  const { isFetching, isLoading, isError, error, data } = useQuery(
    ["searchSoccer", query],
    async () => await searchSoccer(query.toLowerCase()),
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
