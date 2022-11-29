import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useSetAtom } from "jotai";

import { filterAtom } from "@shared/jotai";
import SearchablePage from "@component/SearchablePage";
import Baseball from "@component/Baseball";

const BaseballPage: NextPage = () => {
  const setFilter = useSetAtom(filterAtom);

  useEffect(() => {
    setFilter("baseball");
  }, [setFilter]);

  return (
    <div className="dark h-full max-h-screen min-h-screen w-full text-white">
      <Head>
        <title>Player DB - Baseball</title>
        <meta name="description" content="Player Database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchablePage>
        <Baseball />
      </SearchablePage>
    </div>
  );
};

export default BaseballPage;
