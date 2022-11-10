import { useState, useCallback } from "react";
import Head from "next/head";

import SearchFilter from "@component/SearchFilter";
import Baseball from "@component/Baseball";
import Basketball from "@component/Basketball";
import Football from "@component/Football";
import Hockey from "@component/Hockey";
import Soccer from "@component/Soccer";
import useDebounce from "@hook/useDebounce";

export const Search = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [showSport, setShowSport] = useState<SearchShowSport>({
    baseball: true,
    basketball: true,
    football: true,
    hockey: true,
    soccer: true,
  });
  const [filter, setFilter] = useState<SearchFilter>({
    baseball: true,
    basketball: true,
    football: true,
    hockey: true,
    soccer: true,
  });
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
  }, [search]);

  const leagueDisplay = useCallback(() => {
    if (!query) return null;

    const displayBaseball = filter.baseball && debouncedShow.baseball;
    const displayBasketball = filter.basketball && debouncedShow.basketball;
    const displayFootball = filter.football && debouncedShow.football;
    const displayHockey = filter.hockey && debouncedShow.hockey;
    const displaySoccer = filter.soccer && debouncedShow.soccer;

    let girdColumns = 0;
    if (displayBaseball) girdColumns++;
    if (displayBasketball) girdColumns++;
    if (displayFootball) girdColumns++;
    if (displayHockey) girdColumns++;
    if (displaySoccer) girdColumns++;
    if (girdColumns == 0) girdColumns = 1;
    if (girdColumns == 2) girdColumns = 3; // Fix odd display bug on 2 columns

    return (
      <div
        className={`grid h-56 w-full min-w-full grid-cols-${girdColumns} content-start gap-8`}
      >
        {displayBaseball && <Baseball query={query} setShow={setShowSport} />}
        {displayBasketball && (
          <Basketball query={query} setShow={setShowSport} />
        )}
        {displayFootball && <Football query={query} setShow={setShowSport} />}
        {displayHockey && <Hockey query={query} setShow={setShowSport} />}
        {displaySoccer && <Soccer query={query} setShow={setShowSport} />}
      </div>
    );
  }, [query, filter, debouncedShow]);

  return (
    <div className="flex min-h-screen w-full min-w-full flex-col items-center justify-center py-2">
      <Head>
        <title>Player-DB Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
              className="mx-2 h-10 flex-grow rounded-l px-5 text-gray-600 outline-double outline-1 focus:outline-none focus:ring"
            />
            <button
              onClick={() => searchQuery()}
              className="mx-2 rounded-r bg-blue-500 px-8 py-2 text-white hover:bg-blue-600"
            >
              Search
            </button>
          </div>
          <div className="mt-4 flex w-full">
            <SearchFilter filter={filter} setFilter={setFilter} />
          </div>
        </form>

        {leagueDisplay()}
      </main>
    </div>
  );
};
