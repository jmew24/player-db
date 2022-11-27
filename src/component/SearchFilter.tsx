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

  useEffect(() => {
    if (selectedFilter === "baseball" && itemCount.baseball === 0) {
      setSelectedFilter("all");
    } else if (selectedFilter === "basketball" && itemCount.basketball === 0) {
      setSelectedFilter("all");
    } else if (selectedFilter === "football" && itemCount.football === 0) {
      setSelectedFilter("all");
    } else if (selectedFilter === "hockey" && itemCount.hockey === 0) {
      setSelectedFilter("all");
    } else if (selectedFilter === "soccer" && itemCount.soccer === 0) {
      setSelectedFilter("all");
    }
  }, [itemCount, selectedFilter]);

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
            Filter: [All]
          </option>
          <option
            className={`bg-gray-700 text-gray-200`}
            value="baseball"
            disabled={itemCount.baseball === 0}
          >
            Filter: Baseball [{itemCount.baseball}]
          </option>
          <option
            className={`bg-gray-700 text-gray-200`}
            value="basketball"
            disabled={itemCount.basketball === 0}
          >
            Filter: Basketball [{itemCount.basketball}]
          </option>
          <option
            className={`bg-gray-700 text-gray-200`}
            value="football"
            disabled={itemCount.football === 0}
          >
            Filter: Football [{itemCount.football}]
          </option>
          <option
            className={`bg-gray-700 text-gray-200`}
            value="hockey"
            disabled={itemCount.hockey === 0}
          >
            Filter: Hockey [{itemCount.hockey}]
          </option>
          <option
            className={`bg-gray-700 text-gray-200`}
            value="soccer"
            disabled={itemCount.soccer === 0}
          >
            Filter: Soccer [{itemCount.soccer}]
          </option>
        </select>
      </div>
    </div>
  );
};

export default memo(SearchFilter);
