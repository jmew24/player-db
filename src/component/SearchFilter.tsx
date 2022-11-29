import { memo, useState, useEffect } from "react";
import { useSetAtom, useAtomValue } from "jotai";

import { filterAtom, debouncedShowAtom, itemCountAtom } from "@shared/jotai";

const SearchFilter = () => {
  const setFilter = useSetAtom(filterAtom);
  const debouncedShow = useAtomValue(debouncedShowAtom);
  const itemCount = useAtomValue(itemCountAtom);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  useEffect(() => {
    switch (selectedFilter) {
      case "all":
        setFilter({
          baseball: true,
          basketball: true,
          football: true,
          hockey: true,
          soccer: true,
        });
        break;
      case "baseball":
        setFilter({
          baseball: true,
          basketball: false,
          football: false,
          hockey: false,
          soccer: false,
        });
        break;
      case "basketball":
        setFilter({
          baseball: false,
          basketball: true,
          football: false,
          hockey: false,
          soccer: false,
        });
        break;
      case "football":
        setFilter({
          baseball: false,
          basketball: false,
          football: true,
          hockey: false,
          soccer: false,
        });
        break;
      case "hockey":
        setFilter({
          baseball: false,
          basketball: false,
          football: false,
          hockey: true,
          soccer: false,
        });
        break;
      case "soccer":
        setFilter({
          baseball: false,
          basketball: false,
          football: false,
          hockey: false,
          soccer: true,
        });
        break;
      default:
        setFilter({
          baseball: false,
          basketball: false,
          football: false,
          hockey: false,
          soccer: false,
        });
        break;
    }
  }, [selectedFilter, setFilter]);

  useEffect(() => {
    if (!debouncedShow.baseball && selectedFilter === "baseball") {
      setSelectedFilter("all");
    } else if (!debouncedShow.basketball && selectedFilter === "basketball") {
      setSelectedFilter("all");
    } else if (!debouncedShow.football && selectedFilter === "football") {
      setSelectedFilter("all");
    } else if (!debouncedShow.hockey && selectedFilter === "hockey") {
      setSelectedFilter("all");
    } else if (!debouncedShow.soccer && selectedFilter === "soccer") {
      setSelectedFilter("all");
    }
  }, [debouncedShow, selectedFilter]);

  return (
    <div className="flex w-full min-w-full flex-1 flex-col items-center text-center">
      <div className="mt-4 flex w-full min-w-full">
        <select
          className="w-full min-w-full justify-center rounded border border-gray-500 bg-gray-700 p-2 text-center text-lg text-gray-200"
          id="filter"
          title="Filter by sport"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option className={`bg-gray-700 text-gray-200`} value="all">
            Filter: All
          </option>
          <option className={`bg-gray-700 text-gray-200`} value="baseball">
            Filter:{" "}
            {selectedFilter === "baseball"
              ? `Baseball [${itemCount.baseball}]`
              : `Baseball`}
          </option>
          <option className={`bg-gray-700 text-gray-200`} value="basketball">
            Filter:{" "}
            {selectedFilter === "basketball"
              ? `Basketball [${itemCount.basketball}]`
              : `Basketball`}
          </option>
          <option className={`bg-gray-700 text-gray-200`} value="football">
            Filter:{" "}
            {selectedFilter === "football"
              ? `Football [${itemCount.football}]`
              : `Football`}
          </option>
          <option className={`bg-gray-700 text-gray-200`} value="hockey">
            Filter:{" "}
            {selectedFilter === "hockey"
              ? `Hockey [${itemCount.hockey}]`
              : `Hockey`}
          </option>
          <option className={`bg-gray-700 text-gray-200`} value="soccer">
            Filter:{" "}
            {selectedFilter === "soccer"
              ? `Soccer [${itemCount.soccer}]`
              : `Soccer`}
          </option>
        </select>
      </div>
    </div>
  );
};

export default memo(SearchFilter);
