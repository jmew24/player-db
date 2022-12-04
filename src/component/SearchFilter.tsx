import { memo, useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";

import { filterAtom } from "@shared/jotai";

const SearchFilter = () => {
  const filter = useAtomValue(filterAtom);
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className="flex w-full min-w-full flex-1 flex-col items-center justify-center text-center">
      <div className="mt-4 flex w-full min-w-full">
        <nav className="flex w-full min-w-full flex-wrap items-center rounded border border-gray-500 bg-gray-800 p-3 text-gray-200">
          <div className="inline-flex w-3/4 lg:hidden">
            <h1 className="text-2xl font-bold uppercase">Filter: {filter}</h1>
          </div>
          <button
            className="ml-auto inline-flex rounded p-3 text-white outline-none hover:cursor-pointer hover:bg-gray-700 hover:text-white lg:hidden"
            onClick={handleClick}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div
            className={`${
              active ? "" : "hidden"
            }  w-full lg:inline-flex lg:flex-grow`}
          >
            <div className="flex w-full transform flex-col items-start lg:ml-auto lg:inline-flex lg:h-auto lg:flex-row lg:items-center">
              <Link href="/">
                <a
                  className={`${
                    filter === "all" ? "outline-double outline-gray-500" : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Baseball/Basketball/Football/Hockey"
                >
                  All*
                </a>
              </Link>
              <Link href="/baseball">
                <a
                  className={`${
                    filter === "baseball"
                      ? "outline-double outline-gray-500"
                      : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Baseball"
                >
                  Baseball
                </a>
              </Link>
              <Link href="/basketball">
                <a
                  className={`${
                    filter === "basketball"
                      ? "outline-double outline-gray-500"
                      : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Basketball"
                >
                  Basketball
                </a>
              </Link>
              <Link href="/football">
                <a
                  className={`${
                    filter === "football"
                      ? "outline-double outline-gray-500"
                      : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Football"
                >
                  Football
                </a>
              </Link>
              <Link href="/hockey">
                <a
                  className={`${
                    filter === "hockey" ? "outline-double outline-gray-500" : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Hockey"
                >
                  Hockey
                </a>
              </Link>
              <Link href="/soccer">
                <a
                  className={`${
                    filter === "soccer" ? "outline-double outline-gray-500" : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Soccer"
                >
                  Soccer
                </a>
              </Link>
              <Link href="/tennis">
                <a
                  className={`${
                    filter === "tennis" ? "outline-double outline-gray-500" : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Tennis"
                >
                  Tennis
                </a>
              </Link>
              <Link href="/autoRacing">
                <a
                  className={`${
                    filter === "autoRacing"
                      ? "outline-double outline-gray-500"
                      : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="AutoRacing"
                >
                  AutoRacing
                </a>
              </Link>
              <Link href="/golf">
                <a
                  className={`${
                    filter === "golf" ? "outline-double outline-gray-500" : ""
                  } w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Golf"
                >
                  Golf
                </a>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default memo(SearchFilter);
