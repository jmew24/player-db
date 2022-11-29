import { FC, memo } from "react";
import Search from "./Search";

export type SearchablePageProps = {
  children?: React.ReactNode;
};

const SearchablePage: FC<SearchablePageProps> = ({ children }) => {
  return (
    <main className="container flex min-h-screen w-full min-w-full flex-col  items-center justify-center bg-slate-900 bg-cover p-4 text-white">
      <Search>
        <div
          className={`grid h-56 w-full min-w-full auto-cols-auto grid-flow-col content-start gap-8`}
        >
          {children}
        </div>
      </Search>
    </main>
  );
};

export default memo(SearchablePage);
