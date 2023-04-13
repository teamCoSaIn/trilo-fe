import {
  useQueries as useQueriesBase,
  useQueryErrorResetBoundary,
} from '@tanstack/react-query';

/*
  useQueries 사용 시 error boundary 에서 reset 을 시도하면 무한 refetch 요청을 보내는 오류가 발생
  Tanstack/query 의 해당 Issue 에 대한 quick fix 코드임.
*/
// @ts-ignore
const useQueries2: typeof useQueriesBase = options => {
  const errorResetBoundary = useQueryErrorResetBoundary();
  return useQueriesBase({
    ...options,
    queries: options.queries.map(query => ({
      retryOnMount: errorResetBoundary.isReset(),
      ...query,
    })),
  });
};

export default useQueries2;
