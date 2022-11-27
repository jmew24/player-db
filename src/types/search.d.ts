declare type SearchResultsProps = {
  query: string;
  filter: SearchFilter;
  debouncedShow: SearchShowSport;
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
  debouncedShow: SearchShowSport;
};

declare type SearchShowSport = {
  baseball: boolean;
  basketball: boolean;
  football: boolean;
  hockey: boolean;
  soccer: boolean;
};
