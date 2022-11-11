const makeQueryClient = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchMap = new Map<string, Promise<any>>();

  return function queryClient<QueryResult>(
    name: string,
    query: () => Promise<QueryResult>
  ): Promise<QueryResult> {
    if (!fetchMap.has(name)) {
      fetchMap.set(name, query());
    }

    return Promise.resolve(fetchMap.get(name));
  };
};

export const queryClient = makeQueryClient();
