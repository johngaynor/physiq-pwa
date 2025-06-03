import axios from "axios";
import { getToken } from "./apiClient";

type methodType = "get" | "post" | "put" | "patch" | "delete" | "options";

function caller<T>(obj: ApiObj<T>, method: methodType) {
  return async (dispatch: any): Promise<T> => {
    const { route, data, fetchArr, loadArr, onFailArr, error, success, empty } =
      obj.state;

    fetchArr.forEach((fn) => dispatch(typeof fn === "function" ? fn() : fn));

    try {
      const token = getToken();

      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const url =
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://physiq-api.onrender.com") + route;

      const res = await apiCall<T>(method, url, {
        credentials: "include",
        headers,
        ...(Array.isArray(data) || typeof data === "string" ? { data } : data),
      });

      if (loadArr.length) {
        loadArr.forEach((load) => {
          if (typeof load === "function") dispatch(load(res));
          else if (typeof load === "object") dispatch({ ...load, data: res });
          else dispatch({ type: load, data: res });
        });
      }

      if (empty && (!res || (Array.isArray(res) && res.length === 0))) {
        // dispatch(setFlash(empty, 'yellow'));
      }

      if (success) console.log("success", success);

      return res;
    } catch (err: any) {
      if (!onFailArr.length && loadArr.length) {
        loadArr.forEach((load) =>
          dispatch(typeof load === "function" ? load([{}] as T) : load)
        );
      }

      onFailArr.forEach((fail) =>
        dispatch(typeof fail === "function" ? fail() : fail)
      );

      console.log(JSON.stringify(err, null, 2));

      console.error("API call failed:", (error as Error).message || error, err);
      throw err;
    }
  };
}

async function apiCall<T>(
  method: methodType,
  path: string,
  data?: any
): Promise<T> {
  try {
    const response = await axios[method](path, data);
    if ([242].includes(response.status)) {
      return Promise.reject({
        status: response.status,
        warning: response.data,
      });
    }
    return response.data as T;
  } catch (err: any) {
    const error = new Error(err.response?.data?.error || "Unknown API error");
    // Optionally handle Sentry here
    throw error;
  }
}

type LoadFunction<T> = (data: T) => any;

interface ApiObjState<T> {
  route: string;
  error: string | Error;
  success?: string;
  empty?: string;
  fetchArr: Array<any>;
  loadArr: Array<LoadFunction<T> | object | string>;
  onFailArr: Array<() => any | object | string>;
  data?: any;
}

class ApiObj<T = any> {
  state: ApiObjState<T>;

  constructor(route: string) {
    this.state = {
      route,
      error: "",
      fetchArr: [],
      loadArr: [],
      onFailArr: [],
    };
  }

  fetch(fn: any) {
    this.state.fetchArr.push(fn);
    return this;
  }

  load(fn: LoadFunction<T> | object | string) {
    this.state.loadArr.push(fn);
    return this;
  }

  onFail(fn: any) {
    this.state.onFailArr.push(fn);
    return this;
  }

  data(data: any) {
    this.state.data = data;
    return this;
  }

  error(error: string | Error) {
    this.state.error = error;
    return this;
  }

  success(message: string) {
    this.state.success = message;
    return this;
  }

  empty(message: string) {
    this.state.empty = message;
    return this;
  }

  get() {
    return caller<T>(this, "get");
  }

  post() {
    return caller<T>(this, "post");
  }
}

export const api = {
  route: <T = any>(path: string) => new ApiObj<T>(path),
};
