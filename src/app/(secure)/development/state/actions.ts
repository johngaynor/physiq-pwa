import { FETCH_TEST_QUERY, LOAD_TEST_QUERY } from "@/app/store/actionTypes";
import { api } from "@/lib/api";

export const getTestData = (query: string) => {
  return api
    .route(query)
    .fetch(() => ({ type: FETCH_TEST_QUERY }))
    .load((data: any) => ({
      type: LOAD_TEST_QUERY,
      data,
    }))
    .error("Error fetching test query")
    .get();
};
