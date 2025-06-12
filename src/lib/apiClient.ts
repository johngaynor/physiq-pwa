let token: string | null = null;
let resolveToken: ((token: string) => void) | null = null;

const tokenPromise = new Promise<string>((resolve) => {
  resolveToken = resolve;
});

export const setToken = (newToken: string | null) => {
  token = newToken;
  if (newToken && resolveToken) resolveToken(newToken);
};

export const getToken = () => token;
export const waitForToken = () =>
  token ? Promise.resolve(token) : tokenPromise;
