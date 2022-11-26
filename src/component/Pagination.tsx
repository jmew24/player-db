import { FC, useMemo, memo } from "react";

const Pagination: FC<PaginationProps> = ({
  selected,
  pages,
  pagesArray,
  pagesDisplay,
  setPage,
  data,
}) => {
  const endCount = useMemo(
    () => (data.count <= data.end ? data.count : data.end),
    [data.count, data.end]
  );

  return (
    <nav aria-label="Page navigation" className="w-full">
      <p className="text-center text-gray-200">
        Showing Results {data.start + 1}-{endCount} of {data.count}
      </p>
      {pagesDisplay.length > 1 && (
        <ul className="inline-flex">
          <li className={`${selected === 0 && "disabled"}`}>
            <button
              className={`${
                selected > 0
                  ? "focus:shadow-outline h-10 rounded-l-lg border border-r-0 border-gray-500 bg-gray-600 px-5 text-white transition-colors duration-150 hover:bg-gray-500"
                  : "h-10 cursor-not-allowed rounded-l-lg border border-r-0 border-gray-500  bg-gray-600 px-5 text-white opacity-50 transition-colors duration-150 hover:bg-gray-500"
              }`}
              onClick={() => selected > 0 && setPage(0)}
              disabled={selected === 0 ? true : false}
            >
              &laquo;
            </button>
          </li>
          <li className={`${selected === 0 && "disabled"}`}>
            <button
              className={`${
                selected > 0
                  ? "focus:shadow-outline h-10 border border-gray-500 bg-gray-600 px-5 text-white transition-colors duration-150 hover:bg-gray-500"
                  : "h-10 cursor-not-allowed border border-gray-500  bg-gray-600 px-5 text-white opacity-50 transition-colors duration-150 hover:bg-gray-500"
              }`}
              onClick={() =>
                selected > 0 && setPage(selected - 1 < 0 ? 0 : selected - 1)
              }
              disabled={selected === 0 ? true : false}
            >
              {"<"}
            </button>
          </li>
          <li key={`page-${selected}`}>
            <button
              className={`focus:shadow-outline h-10 cursor-not-allowed border border-r-0 border-gray-500 bg-gray-600 px-5 text-white opacity-50 transition-colors duration-150 hover:bg-gray-500`}
              disabled={true}
            >
              {selected + 1}
            </button>
          </li>
          {/*pagesDisplay.map((page) => (
        <li key={`page-${page}`}>
          <button
            className={`focus:shadow-outline h-10 border border-r-0 border-gray-500 ${
              selected === page
                ? "bg-white text-gray-600"
                : "bg-gray-600 text-white"
            } px-5 transition-colors duration-150`}
            onClick={() => setPage(page)}
          >
            {page + 1}
          </button>
        </li>
          ))*/}
          <li>
            <button
              className={`${
                selected < pages - 1
                  ? "focus:shadow-outline h-10 border border-gray-500 bg-gray-600 px-5 text-white transition-colors duration-150 hover:bg-gray-500"
                  : "h-10 cursor-not-allowed border border-gray-500  bg-gray-600 px-5 text-white opacity-50 transition-colors duration-150 hover:bg-gray-500"
              }`}
              onClick={() => selected < pages - 1 && setPage(selected + 1)}
            >
              {">"}
            </button>
          </li>
          <li>
            <button
              className={`${
                selected < pages - 1
                  ? "focus:shadow-outline h-10 rounded-r-lg border border-gray-500 bg-gray-600 px-5 text-white transition-colors duration-150 hover:bg-gray-500"
                  : "h-10 cursor-not-allowed rounded-r-lg border border-gray-500  bg-gray-600 px-5 text-white opacity-50 transition-colors duration-150 hover:bg-gray-500"
              }`}
              onClick={() =>
                selected < pages - 1 &&
                setPage(pagesArray[pagesArray.length - 1])
              }
            >
              &raquo;
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default memo(Pagination);
