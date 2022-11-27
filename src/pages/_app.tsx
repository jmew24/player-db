import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppType } from "next/dist/shared/lib/utils";
import { Provider } from "jotai";

import "@style/globals.css";
import ErrorBoundary from "@component/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </Provider>
    </QueryClientProvider>
  );
};

export default MyApp;
