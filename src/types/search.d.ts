declare type SearchResultsProps = {
  query: string;
  filter: SearchFilter;
  setShowSport: Dispatch<SetStateAction<SearchShowSport>>;
};

declare type SearchFilter = {
  baseball: boolean;
  basketball: boolean;
  football: boolean;
  hockey: boolean;
  soccer: boolean;
};

declare type SearchFilterProps = {
  setFilter: Dispatch<SetStateAction<SearchFilter>>;
};

declare type SearchShowSport =
  | "all"
  | "baseball"
  | "basketball"
  | "football"
  | "hockey"
  | "soccer";
