import { useState, useCallback } from "react";
import Head from "next/head";

import { Baseball } from "./Baseball";
import { Basketball } from "./Basketball";
import { Football } from "./Football";
import { Hockey } from "./Hockey";

export const Search = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [showSport, setShowSport] = useState<SearchShowSport>({
    baseball: true,
    basketball: true,
    football: true,
    hockey: true,
  });
  const [filter, setFilter] = useState<SearchFilter>("All");
  const searchQuery = useCallback(() => {
    setShowSport({
      baseball: true,
      basketball: true,
      football: true,
      hockey: true,
    });
    setQuery(search);
  }, [search]);

  const leagueDisplay = useCallback(() => {
    if (!query) return null;

    switch (filter) {
      case "Baseball":
        return (
          <div className="grid h-56 grid-cols-1 content-start gap-8">
            <Baseball query={query} setShow={setShowSport} />
          </div>
        );
      case "Basketball":
        return (
          <div className="grid h-56 grid-cols-1 content-start gap-8">
            <Basketball query={query} setShow={setShowSport} />
          </div>
        );
      case "Football":
        return (
          <div className="grid h-56 grid-cols-1 content-start gap-8">
            <Football query={query} setShow={setShowSport} />
          </div>
        );
      case "Hockey":
        return (
          <div className="grid h-56 grid-cols-1 content-start gap-8">
            <Hockey query={query} setShow={setShowSport} />
          </div>
        );
      default:
        if (
          showSport.baseball &&
          showSport.basketball &&
          showSport.football &&
          showSport.hockey
        ) {
          return (
            <div className="grid h-56 grid-cols-4 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Basketball query={query} setShow={setShowSport} />
              <Football query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (
          showSport.baseball &&
          showSport.basketball &&
          showSport.football
        ) {
          return (
            <div className="grid h-56 grid-cols-3 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Basketball query={query} setShow={setShowSport} />
              <Football query={query} setShow={setShowSport} />
            </div>
          );
        } else if (
          showSport.baseball &&
          showSport.basketball &&
          showSport.hockey
        ) {
          return (
            <div className="grid h-56 grid-cols-3 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Basketball query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (
          showSport.baseball &&
          showSport.football &&
          showSport.hockey
        ) {
          return (
            <div className="grid h-56 grid-cols-3 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Football query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (
          showSport.basketball &&
          showSport.football &&
          showSport.hockey
        ) {
          return (
            <div className="grid h-56 grid-cols-3 content-start gap-8">
              <Basketball query={query} setShow={setShowSport} />
              <Football query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.baseball && showSport.basketball) {
          return (
            <div className="grid h-56 grid-cols-2 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Basketball query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.baseball && showSport.football) {
          return (
            <div className="grid h-56 grid-cols-2 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Football query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.baseball && showSport.hockey) {
          return (
            <div className="grid h-56 grid-cols-2 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.basketball && showSport.football) {
          return (
            <div className="grid h-56 grid-cols-2 content-start gap-8">
              <Basketball query={query} setShow={setShowSport} />
              <Football query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.basketball && showSport.hockey) {
          return (
            <div className="grid h-56 grid-cols-2 content-start gap-8">
              <Basketball query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.football && showSport.hockey) {
          return (
            <div className="grid h-56 grid-cols-2 content-start gap-8">
              <Football query={query} setShow={setShowSport} />
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.baseball) {
          return (
            <div className="grid h-56 grid-cols-1 content-start gap-8">
              <Baseball query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.basketball) {
          return (
            <div className="grid h-56 grid-cols-1 content-start gap-8">
              <Basketball query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.football) {
          return (
            <div className="grid h-56 grid-cols-1 content-start gap-8">
              <Football query={query} setShow={setShowSport} />
            </div>
          );
        } else if (showSport.hockey) {
          return (
            <div className="grid h-56 grid-cols-1 content-start gap-8">
              <Hockey query={query} setShow={setShowSport} />
            </div>
          );
        } else {
          return null;
        }
    }
  }, [filter, query, showSport]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Player-DB Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center px-5 text-center">
        <h1 className="text-6xl font-bold">Search For Person</h1>
        <div className="mt-4 flex w-full">
          <select
            className="mx-2 w-1/3 rounded border border-gray-300 p-2 text-gray-600"
            value={filter}
            onChange={(e) => setFilter(e.target.value as SearchFilter)}
          >
            <option value="All">All</option>
            <option value="Baseball">Baseball</option>
            <option value="Basketball">Basketball</option>
            <option value="Football">Football</option>
            <option value="Hockey">Hockey</option>
          </select>
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

        {leagueDisplay()}
      </main>
    </div>
  );
};
