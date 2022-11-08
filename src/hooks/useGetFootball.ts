import { useQuery } from "@tanstack/react-query";

import { proxy } from "@factory/proxy";
import { footballCache } from "@factory/cache";

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

export default function useGetFootball(query: string) {
  const { isFetching, isLoading, isError, error, data } = useQuery(
    ["searchNFL", query],
    async () => await searchNFL(query.toLowerCase()),
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
