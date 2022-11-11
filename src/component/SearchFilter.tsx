import { FC, memo, useState, useCallback, useEffect } from "react";

const SearchFilter: FC<SearchFilterProps> = ({ filter, setFilter }) => {
  const [showAll, setShowAll] = useState<boolean>(true);
  const updateShowAll = useCallback(
    (value: boolean) => {
      setFilter((oldState: SearchFilter) => ({
        ...oldState,
        baseball: value,
        basketball: value,
        football: value,
        hockey: value,
        soccer: value,
      }));
      setShowAll(value);
    },
    [setFilter]
  );

  useEffect(() => {
    setShowAll(
      filter.baseball &&
        filter.basketball &&
        filter.football &&
        filter.hockey &&
        filter.soccer
    );
  }, [filter]);

  return (
    <ul className="w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:flex">
      <li className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r">
        <div className="flex cursor-pointer items-center pl-3">
          <input
            id="all-checkbox-list"
            type="checkbox"
            checked={showAll}
            onChange={(e) => updateShowAll(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600  dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
          />
          <label
            htmlFor="all-checkbox-list"
            className="ml-2 w-full cursor-pointer py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            All Filters
          </label>
        </div>
      </li>
      {Object.keys(filter).map((key: string) => (
        <li
          key={key}
          className="w-full border-b border-gray-200 dark:border-gray-600 sm:border-b-0 sm:border-r"
        >
          <div className="flex cursor-pointer items-center pl-3">
            <input
              id={`${key}-checkbox-list`}
              type="checkbox"
              checked={filter[key as keyof SearchFilter]}
              onChange={(e) =>
                setFilter((oldState: SearchFilter) => ({
                  ...oldState,
                  [key]: e.target.checked,
                }))
              }
              className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100 text-blue-600  dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
            />
            <label
              htmlFor={`${key}-checkbox-list`}
              className="ml-2 w-full cursor-pointer py-3 text-sm font-medium capitalize text-gray-900 dark:text-gray-300"
            >
              {key}
            </label>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default memo(SearchFilter);
