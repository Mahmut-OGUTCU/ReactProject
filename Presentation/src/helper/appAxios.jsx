// appAxios.js
import axios from "axios";
import { message } from "antd";

export const appAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL + "/api/",
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

appAxios.interceptors.response.use(
  (response) => {
    if (response.data.message !== "Kayıt(lar) listelendi.") {
      message.success(response.data.message);
    }
    return response;
  },
  (error) => {
    message.error(error.response.data.message);
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("kullanici");
      localStorage.removeItem("email");
      localStorage.removeItem("admin");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
