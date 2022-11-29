import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useSetAtom } from "jotai";

import { filterAtom } from "@shared/jotai";
import SearchablePage from "@component/SearchablePage";
import Basketball from "@component/Basketball";

const BasketballPage: NextPage = () => {
  const setFilter = useSetAtom(filterAtom);

  useEffect(() => {
    setFilter("basketball");
  }, [setFilter]);

  return (
    <div className="min-w-screen dark mx-auto h-full max-h-screen min-h-screen w-full text-white">
      <Head>
        <title>Player DB - Basketball</title>
        <meta name="description" content="Player Database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchablePage>
        <Basketball />
      </SearchablePage>
    </div>
  );
};

export default BasketballPage;
