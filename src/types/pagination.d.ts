declare interface PaginationProps {
  selected: number;
  pages: number;
  pagesArray: number[];
  pagesDisplay: number[];
  setPage: Dispatch<SetStateAction<P>>;
  data: {
    count: number;
    start: number;
    end: number;
  };
}
