import { FC, memo, useState, useEffect } from "react";

const SearchFilter: FC<SearchFilterProps> = ({ setFilter, debouncedShow }) => {
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
          className="w-full min-w-full justify-center rounded border border-gray-300 p-2 text-center text-lg text-gray-600"
          id="filter"
          title="Filter by sport"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">Filter: [All]</option>
          <option value="baseball" disabled={!debouncedShow.baseball}>
            Filter: [Baseball]
          </option>
          <option value="basketball" disabled={!debouncedShow.basketball}>
            Filter: [Basketball]
          </option>
          <option value="football" disabled={!debouncedShow.football}>
            Filter: [Football]
          </option>
          <option value="hockey" disabled={!debouncedShow.hockey}>
            Filter: [Hockey]
          </option>
          <option value="soccer" disabled={!debouncedShow.soccer}>
            Filter: [Soccer]
          </option>
        </select>
      </div>
    </div>
  );
};

export default memo(SearchFilter);
