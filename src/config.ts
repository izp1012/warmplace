const getApiUrl = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL_PROD || '';
  }
  return import.meta.env.VITE_API_URL_DEV || '';
};

export const API_BASE_URL = getApiUrl();
