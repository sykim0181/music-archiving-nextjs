import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { fetchAccessToken } from "@/lib/redux/spotify";
import { AppDispatch, useTypedSelector } from "@/lib/redux/store";

const useSpotifyAccessToken = () => {
  const accessToken = useTypedSelector((state) => state.spotify.accessToken);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (accessToken === null) {
      dispatch(fetchAccessToken());
    }
  }, [accessToken, dispatch]);

  return { accessToken };
};

export default useSpotifyAccessToken;
