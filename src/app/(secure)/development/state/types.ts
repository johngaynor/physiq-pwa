import { FETCH_TEST_QUERY, LOAD_TEST_QUERY } from "@/app/store/actionTypes";

export interface DevelopmentState {
  testData: any;
  testDataLoading: boolean;
}

export type Action =
  | { type: typeof FETCH_TEST_QUERY }
  | { type: typeof LOAD_TEST_QUERY; data: any };
