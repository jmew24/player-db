import type { NextPage } from "next";
import Head from "next/head";

import { Search } from "@component/Search";

const Home: NextPage = () => {
  return (
    <div className="min-w-screen dark mx-auto h-full max-h-screen min-h-screen w-full text-white">
      <Head>
        <title>Player DB</title>
        <meta name="description" content="Player Database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-w-screen container mx-auto flex min-h-screen flex-col  items-center justify-center bg-slate-900 bg-cover p-4 text-white">
        <Search />
      </main>
    </div>
  );
};

export default Home;
