import { FC, memo } from "react";
import Search from "./Search";

export type SearchablePageProps = {
  children?: React.ReactNode;
};

const SearchablePage: FC<SearchablePageProps> = ({ children }) => {
  return (
    <main className="min-w-screen container mx-auto flex min-h-screen flex-col items-center justify-center bg-slate-900 bg-cover p-4 text-white">
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
