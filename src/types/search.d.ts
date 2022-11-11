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
  //soccer: boolean;
};

declare type SearchFilterProps = {
  filter: SearchFilter;
  setFilter: Dispatch<SetStateAction<SearchFilter>>;
};

declare type SearchShowSport = {
  baseball: boolean;
  basketball: boolean;
  football: boolean;
  hockey: boolean;
  //soccer: boolean;
};
