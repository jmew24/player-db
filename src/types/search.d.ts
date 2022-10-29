declare type SearchFilter =
  | "All"
  | "Baseball"
  | "Basketball"
  | "Football"
  | "Hockey";

declare type SearchShowSport = {
  baseball: boolean;
  basketball: boolean;
  football: boolean;
  hockey: boolean;
};
