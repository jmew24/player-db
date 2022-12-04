import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useSetAtom } from "jotai";

import { filterAtom } from "@shared/jotai";
import SearchablePage from "@component/SearchablePage";
import Golf from "@component/Golf";

const GolfPage: NextPage = () => {
  const setFilter = useSetAtom(filterAtom);

  useEffect(() => {
    setFilter("golf");
  }, [setFilter]);

  return (
    <div className="dark h-full max-h-screen min-h-screen w-full text-white">
      <Head>
        <title>Player DB - Golf</title>
        <meta name="description" content="Player Database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchablePage>
        <Golf />
      </SearchablePage>
    </div>
  );
};

export default GolfPage;
