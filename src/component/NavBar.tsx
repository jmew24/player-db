import { memo, useState } from "react";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import Link from "next/link";
import { useAtomValue } from "jotai";

import { filterAtom } from "@shared/jotai";

const MoreFilter = () => {
  const filter = useAtomValue(filterAtom);

  return (
    <div className="z-10 flex w-full min-w-full flex-1 flex-col items-center justify-center text-center">
      <div className="mt-2 flex w-full min-w-full">
        <nav className="flex w-full min-w-full flex-wrap items-center rounded border border-gray-500 bg-gray-800 p-3 text-gray-200">
          <div className="flex w-full transform flex-col items-start">
            <Link href="/soccer">
              <a
                className={`${
                  filter === "soccer" ? "outline-double outline-gray-500" : ""
                } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                title="Soccer"
              >
                Soccer
              </a>
            </Link>
            <Link href="/tennis">
              <a
                className={`${
                  filter === "tennis" ? "outline-double outline-gray-500" : ""
                } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
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
                } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                title="AutoRacing"
              >
                AutoRacing
              </a>
            </Link>
            <Link href="/golf">
              <a
                className={`${
                  filter === "golf" ? "outline-double outline-gray-500" : ""
                } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                title="Golf"
              >
                Golf
              </a>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavBar = () => {
  const filter = useAtomValue(filterAtom);
  const [active, setActive] = useState({ main: false, more: false });
  const isFilterUnderMore = ["soccer", "tennis", "autoracing", "golf"].includes(
    filter.toLowerCase()
  );

  const handleMainClick = (activeType = "main" || "more") => {
    if (activeType === "main")
      setActive((oldState) => ({
        ...oldState,
        main: !oldState.main,
        more: false,
      }));
    if (activeType === "more")
      setActive((oldState) => ({ ...oldState, more: !oldState.more }));
  };

  return (
    <div className="flex w-full min-w-full flex-1 flex-col items-center justify-center text-center">
      <div className="mt-4 flex w-full min-w-full">
        <nav className="flex w-full min-w-full flex-wrap items-center rounded border border-gray-500 bg-gray-800 p-3 text-gray-200">
          <div className="inline-flex w-3/4 lg:hidden">
            <h1 className="text-2xl font-bold uppercase">Filter: {filter}</h1>
          </div>
          <button
            data-dropdown-toggle="main"
            className="ml-auto inline-flex rounded p-3 text-white outline-none hover:cursor-pointer hover:bg-gray-700 hover:text-white lg:hidden"
            onClick={() => handleMainClick("main")}
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
              active.main ? "" : "hidden"
            } w-full lg:inline-flex lg:flex-grow`}
            id="main"
          >
            <div className="flex w-full transform flex-col items-start lg:ml-auto lg:inline-flex lg:h-auto lg:flex-row lg:items-center">
              <Link href="/">
                <a
                  className={`${
                    filter === "all" ? "outline-double outline-gray-500" : ""
                  } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Baseball/Basketball/Football/Hockey"
                >
                  Main
                </a>
              </Link>
              <Link href="/baseball">
                <a
                  className={`${
                    filter === "baseball"
                      ? "outline-double outline-gray-500"
                      : ""
                  } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
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
                  } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
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
                  } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Football"
                >
                  Football
                </a>
              </Link>
              <Link href="/hockey">
                <a
                  className={`${
                    filter === "hockey" ? "outline-double outline-gray-500" : ""
                  } mx-1 my-1 w-full items-center justify-center rounded px-3 py-2 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500 lg:inline-flex `}
                  title="Hockey"
                >
                  Hockey
                </a>
              </Link>
              <div className="my-1 w-full items-center justify-center">
                <button
                  id="moreDropdownButton"
                  data-dropdown-toggle="moreDropdown"
                  data-dropdown-placement="right-start"
                  type="button"
                  className={`${
                    isFilterUnderMore ? "outline-double outline-gray-500" : ""
                  } mx-1 my-1 flex w-full items-center justify-center rounded py-2 px-4 text-xl font-bold text-white outline-1 filter transition-colors duration-150 hover:cursor-pointer hover:bg-gray-700 hover:text-white hover:outline-double hover:outline-gray-500`}
                  onClick={() => handleMainClick("more")}
                >
                  More
                  {active.more ? (
                    <GoChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <GoChevronDown className="ml-2 h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div
        className={`${
          active.more ? "" : "hidden"
        } z-10 inline-flex w-full flex-grow`}
      >
        {MoreFilter()}
      </div>
    </div>
  );
};

export default memo(NavBar);
