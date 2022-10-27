import { useState, useCallback } from "react";
import Head from "next/head";

import { Hockey } from "./Hockey";
import { Baseball } from "./Baseball";

export const Search = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const searchQuery = useCallback(() => {
    setQuery(search);
  }, [search]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Athlete/Coach Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center px-5 text-center">
        <h1 className="text-6xl font-bold">Search For Athlete/Coach</h1>
        <div className="mt-4 flex w-full">
          <input
            type="text"
            value={search}
            placeholder="Enter a name here..."
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 flex-grow rounded-l px-5 outline-double outline-1 focus:outline-none focus:ring"
          />
          <button
            onClick={() => searchQuery()}
            className="rounded-r bg-blue-500 px-8 py-2 text-white hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {query && (
          <div className="grid h-56 grid-cols-2 content-start gap-8">
            <Hockey query={query} />
            <Baseball query={query} />
          </div>
        )}
      </main>
    </div>
  );
};
