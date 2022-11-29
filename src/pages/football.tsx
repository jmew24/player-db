import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useSetAtom } from "jotai";

import { filterAtom } from "@shared/jotai";
import SearchablePage from "@component/SearchablePage";
import Football from "@component/Football";

const FootballPage: NextPage = () => {
  const setFilter = useSetAtom(filterAtom);

  useEffect(() => {
    setFilter("football");
  }, [setFilter]);

  return (
    <div className="dark h-full max-h-screen min-h-screen w-full text-white">
      <Head>
        <title>Player DB - Football</title>
        <meta name="description" content="Player Database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchablePage>
        <Football />
      </SearchablePage>
    </div>
  );
};

export default FootballPage;
