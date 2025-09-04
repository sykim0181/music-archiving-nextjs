import axios from "axios";
import { getAppAccessToken } from "./manager";

export const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

spotifyAPI.interceptors.request.use(async (config) => {
  const token = await getAppAccessToken();
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});
