import { FC, useState, useCallback, memo } from "react";
import { useSetAtom, useAtomValue } from "jotai";

import { queryAtom, searchTypeAtom } from "@shared/jotai";

import SearchFilter from "@component/SearchFilter";

type SearchProps = {
  children?: JSX.Element | JSX.Element[] | string | string[];
};

const Search: FC<SearchProps> = ({ children }) => {
  const query = useAtomValue(queryAtom);
  const setQuery = useSetAtom(queryAtom);
  const searchType = useAtomValue(searchTypeAtom);
  const setSearchType = useSetAtom(searchTypeAtom);
  const [search, setSearch] = useState(query || "");

  const searchQuery = useCallback(() => {
    setQuery(search);
  }, [search, setQuery]);

  const handleSearchType = useCallback(
    (value: string) => {
      setQuery("");
      setSearch("");
      setSearchType(value as "player" | "team");
    },
    [setQuery, setSearchType]
  );

  return (
    <div className="flex min-h-screen w-full min-w-full flex-col items-center justify-center py-2">
      <main className="flex w-full min-w-full flex-1 flex-col items-center px-5 text-center">
        <h1 className="text-6xl font-bold">
          {searchType === "player" ? "Search For Players" : "Search For Teams"}
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchQuery();
          }}
          className="flex w-full flex-col items-center justify-center"
        >
          <div className="mt-4 flex w-full min-w-full">
            <SearchFilter />
          </div>
          <div className="mt-6 mb-6 flex w-full min-w-full">
            <select
              className="mx-2 w-1/6 justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
              value={searchType}
              onChange={(e) => handleSearchType(e.target.value)}
              title="Search Type"
            >
              <option value="player">Player</option>
              <option value="team">Team</option>
            </select>
            <input
              title="Search"
              type="text"
              value={search}
              placeholder={`Enter a ${searchType} name here...`}
              onChange={(e) => setSearch(e.target.value)}
              className="mx-2 h-10 flex-grow justify-center rounded border-gray-500 bg-gray-700 px-5 text-center text-xl font-bold  text-gray-200 outline-double outline-1 outline-gray-500 focus:outline-none focus:ring"
            />
            <button
              title="Search Button"
              type="button"
              onClick={() => searchQuery()}
              className="mx-2 w-1/6 rounded-r bg-blue-500 px-8 py-2 text-white hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>

        {children ?? null}
      </main>
    </div>
  );
};

export default memo(Search);
