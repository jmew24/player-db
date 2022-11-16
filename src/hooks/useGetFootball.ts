import { useQuery } from "@tanstack/react-query";

import { proxy } from "@factory/proxy";
import { footballCache } from "@factory/cache";

const blankTeam: NFLTeam = {
  name: "Unknown",
  abbreviation: "",
  teamName: "Unknown",
};

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

  const players: NFLPlayer[] = [];
  const cbsResponse = (await proxy(
    `https://www.cbssports.com/search/football/players/xhr/?last_name_begins=${query}&leagueAbbreviation=NFL&page=1l&resultsOnly=true`
  )) as NFLCBSRequest;
  for (const item of cbsResponse.results) {
    const teamAbbr = item.teamAbbreviation;
    const team = teams.find(
      (team) =>
        team.abbreviation.toLowerCase() === teamAbbr.toLowerCase() ||
        team.teamName.toLowerCase() === teamAbbr.toLowerCase()
    ) || { ...blankTeam };
    players.push({
      id: item.playerId,
      assetname: item.playerSlug,
      fullNameForSearch: `${item.playerFirstName} ${item.playerLastName}`,
      firstName: item.playerFirstName,
      lastName: item.playerLastName,
      jerseyNum: -1,
      position: item.playerPosition,
      portraitId: item.playerId,
      team: team,
      url: `https://www.cbssports.com/nfl/players/${item.playerId}/${item.playerSlug}/`,
      image: `https://sportshub.cbsistatic.com/i/sports/player/headshot/${item.playerId}.png?width=160`,
      source: "CBS Sports",
    });
  }

  const response = (await proxy(
    `https://ratings-api.ea.com/v2/entities/m23-ratings?filter=((fullNameForSearch%3A*${q}*))&sort=firstName%3AASC`
  )) as NFLPlayerRequest;

  for (const item of response.docs) {
    const teamName = item.team.toLowerCase();
    const team = teams.find(
      (team) =>
        team.abbreviation.toLowerCase() === teamName ||
        team.teamName.toLowerCase() === teamName.toLowerCase()
    ) || {
      ...blankTeam,
    };

    if (
      players.find(
        (player) =>
          player.firstName === item.firstName &&
          player.lastName === item.lastName &&
          player.team.name === team.name
      )
    )
      continue;

    players.push({
      id: item.primaryKey,
      assetname: item.plyrAssetname,
      fullNameForSearch: item.fullNameForSearch,
      firstName: item.firstName,
      lastName: item.lastName,
      jerseyNum: item.jerseyNum,
      position: item.position,
      portraitId: item.plyrPortrait,
      team: team,
      url: `https://www.ea.com/games/madden-nfl/player-ratings/player-name/${item.firstName}%20${item.lastName}/${item.primaryKey}`,
      image: `https://madden-assets-cdn.pulse.ea.com/madden23/portraits/64/${item.plyrPortrait}.png`,
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
