declare interface HockeyProps {
  query: string;
}

declare type EliteProspectPosition = "F" | "D" | "G" | "Staff" | "";

declare type EliteProspectTypes = "team" | "player" | "staff" | "";

declare type EliteProspectsResult = {
  age: string;
  country: string;
  fullname: string;
  id: string;
  matches: [number, number][];
  position: EliteProspectPosition;
  season: string;
  team: string;
  verified: string;
  verifiedHidden: string;
  league: string;
  _type: EliteProspectTypes;
  url: string;
};

declare type EliteProspectsFilter = {
  position: EliteProspectPosition;
  team: string;
};
