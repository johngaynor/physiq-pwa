let apiUserId: string | null = null;

export const setApiUserId = (id: string) => {
  apiUserId = id;
  console.log("API User ID set to:", apiUserId);
};

export const getApiUserId = () => apiUserId;
