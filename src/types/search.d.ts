declare type SearchFilter = {
  baseball: boolean;
  basketball: boolean;
  football: boolean;
  hockey: boolean;
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
};
