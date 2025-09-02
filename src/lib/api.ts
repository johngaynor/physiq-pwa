import axios, { AxiosRequestConfig, Method } from "axios";
import { waitForToken } from "./apiClient";
import { toast } from "sonner";

type MethodType = "get" | "post" | "put" | "patch" | "delete" | "options";

async function apiCall<T>(
  method: MethodType,
  path: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await axios.request<T>({
      method: method.toUpperCase() as Method,
      url: path,
      ...config,
    });

    if ([242].includes(response.status)) {
      return Promise.reject({
        status: response.status,
        warning: response.data,
      });
    }

    return response.data;
  } catch (err: any) {
    let errorMessage = "An error occurred while processing your request.";

    if (err?.response?.status === 403) {
      // probably app access denied
      errorMessage = "You are not authorized to access this route.";
    } else if (err?.response?.data?.error) {
      errorMessage = err.response.data.error;
    }

    toast.error(errorMessage);
    throw err;
  }
}

function caller<T>(obj: ApiObj<T>, method: MethodType) {
  return async (dispatch: (action: any) => void): Promise<T> => {
    const { route, data, fetchArr, loadArr, onFailArr, error, success, empty } =
      obj.state;

    fetchArr.forEach((fn) => dispatch(typeof fn === "function" ? fn() : fn));

    try {
      const token = await waitForToken();

      const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const url =
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://api.physiq.app") + route;

      const config: AxiosRequestConfig = {
        headers,
        withCredentials: true,
        ...(Array.isArray(data) || typeof data === "string"
          ? { data }
          : { data }),
      };

      const res = await apiCall<T>(method, url, config);

      loadArr.forEach((load) => {
        if (typeof load === "function") dispatch(load(res));
        else if (typeof load === "object") dispatch({ ...load, data: res });
        else dispatch({ type: load, data: res });
      });

      if (empty && (!res || (Array.isArray(res) && res.length === 0))) {
        // dispatch(setFlash(empty, 'yellow'));
      }

      if (success) console.log("success", success);

      return res;
    } catch (err) {
      if (!onFailArr.length && loadArr.length) {
        loadArr.forEach((load) =>
          dispatch(typeof load === "function" ? load([{}] as T) : load)
        );
      }

      onFailArr.forEach((fail) =>
        dispatch(typeof fail === "function" ? fail() : fail)
      );

      console.error("API call failed:", error);
      throw err;
    }
  };
}

type LoadFunction<T> = (data: T) => any;
type Dispatchable = { type: string; data?: any } | (() => any);

interface ApiObjState<T> {
  route: string;
  error: string | Error;
  success?: string;
  empty?: string;
  fetchArr: Dispatchable[];
  loadArr: Array<LoadFunction<T> | { type: string; data?: any } | string>;
  onFailArr: Dispatchable[];
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

  fetch(fn: Dispatchable) {
    this.state.fetchArr.push(fn);
    return this;
  }

  load(fn: LoadFunction<T> | { type: string; data?: any } | string) {
    this.state.loadArr.push(fn);
    return this;
  }

  onFail(fn: Dispatchable) {
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

  delete() {
    return caller<T>(this, "delete");
  }
}

export const api = {
  route: <T = any>(path: string) => new ApiObj<T>(path),
};
