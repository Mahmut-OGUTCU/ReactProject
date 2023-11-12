// appAxios.js
import axios from "axios";

export const appAxios = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

async function getToken() {
  const localStorageToken = localStorage.getItem("token");
  if (localStorageToken) {
    return localStorageToken;
  } else {
    return "";
  }
}

appAxios.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.token = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
