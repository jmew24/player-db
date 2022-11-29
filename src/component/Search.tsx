import { FC, useState, useCallback, useMemo, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";

import {
  filterAtom,
  showAtom,
  queryAtom,
  debouncedShowAtom,
} from "@shared/jotai";

import SearchFilter from "@component/SearchFilter";
import Baseball from "@component/Baseball";
import Basketball from "@component/Basketball";
import Football from "@component/Football";
import Hockey from "@component/Hockey";
import Soccer from "@component/Soccer";
import useDebounce from "@hook/useDebounce";

type SearchProps = {
  children?: JSX.Element | JSX.Element[] | string | string[];
};

export const Search: FC<SearchProps> = ({ children }) => {
  const [search, setSearch] = useState("");
  const setQuery = useSetAtom(queryAtom);
  const showSport = useAtomValue(showAtom);
  const setShowSport = useSetAtom(showAtom);
  const setDebouncedShow = useSetAtom(debouncedShowAtom);
  const debouncedShow: SearchShowSport = useDebounce<SearchShowSport>(
    showSport,
    500
  );

  const searchQuery = useCallback(() => {
    setShowSport({
      baseball: true,
      basketball: true,
      football: true,
      hockey: true,
      soccer: true,
    });
    setQuery(search);
  }, [search, setQuery, setShowSport]);

  useEffect(() => {
    setDebouncedShow(debouncedShow);
  }, [debouncedShow, setDebouncedShow]);

  return (
    <div className="flex min-h-screen w-full min-w-full flex-col items-center justify-center py-2">
      <main className="flex w-full min-w-full flex-1 flex-col items-center px-5 text-center">
        <h1 className="text-6xl font-bold">Search For Person</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchQuery();
          }}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="mt-4 flex w-full min-w-full">
            <input
              type="text"
              value={search}
              placeholder="Enter a name here..."
              onChange={(e) => setSearch(e.target.value)}
              className="mx-2 h-10 flex-grow justify-center rounded border-gray-500 bg-gray-700 px-5 text-center text-xl  text-gray-200 outline-double outline-1 outline-gray-500 focus:outline-none focus:ring"
            />
            <button
              onClick={() => searchQuery()}
              className="mx-2 rounded-r bg-blue-500 px-8 py-2 text-white hover:bg-blue-600"
            >
              Search
            </button>
          </div>
          <SearchFilter />
        </form>

        {children ?? null}
      </main>
    </div>
  );
};

export const SearchResults = () => {
  const query = useAtomValue(queryAtom);
  const filter = useAtomValue(filterAtom);
  const debouncedShow = useAtomValue(debouncedShowAtom);

  const displayBaseball = useMemo(
    () => query.trim() !== "" && filter.baseball && debouncedShow.baseball,
    [query, filter.baseball, debouncedShow.baseball]
  );
  const displayBasketball = useMemo(
    () => query.trim() !== "" && filter.basketball && debouncedShow.basketball,
    [query, filter.basketball, debouncedShow.basketball]
  );
  const displayFootball = useMemo(
    () => query.trim() !== "" && filter.football && debouncedShow.football,
    [query, filter.football, debouncedShow.football]
  );
  const displayHockey = useMemo(
    () => query.trim() !== "" && filter.hockey && debouncedShow.hockey,
    [query, filter.hockey, debouncedShow.hockey]
  );
  const displaySoccer = useMemo(
    () => query.trim() !== "" && filter.soccer && debouncedShow.soccer,
    [query, filter.soccer, debouncedShow.soccer]
  );

  return (
    <div
      className={`grid h-56 w-full min-w-full auto-cols-auto grid-flow-col content-start gap-8`}
    >
      {displayBaseball && <Baseball />}
      {displayBasketball && <Basketball />}
      {displayFootball && <Football />}
      {displayHockey && <Hockey />}
      {displaySoccer && <Soccer />}
    </div>
  );
};
