import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useSetAtom } from "jotai";

import { filterAtom } from "@shared/jotai";
import Search from "@component/Search";
import Baseball from "@component/Baseball";
import Basketball from "@component/Basketball";
import Football from "@component/Football";
import Hockey from "@component/Hockey";
import Soccer from "@component/Soccer";

const Home: NextPage = () => {
  const setFilter = useSetAtom(filterAtom);

  useEffect(() => {
    setFilter("all");
  }, [setFilter]);

  return (
    <div className="dark h-full max-h-screen min-h-screen w-full text-white">
      <Head>
        <title>Player DB</title>
        <meta name="description" content="Player Database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container flex min-h-screen w-full min-w-full flex-col  items-center justify-center bg-slate-900 bg-cover p-4 text-white">
        <Search>
          <div
            className={`grid h-56 w-full min-w-full auto-cols-auto grid-flow-col content-start gap-8`}
          >
            <Baseball />
            <Basketball />
            <Football />
            <Hockey />
            <Soccer />
          </div>
        </Search>
      </main>
    </div>
  );
};

export default Home;
