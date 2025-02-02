import Axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
const instance = Axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.defaults.timeout = 30000;

export const axios = instance;
