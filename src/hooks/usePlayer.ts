import { useEffect } from "react";
import useUser from "./useUser";
import { setStatus } from "@/lib/redux/playerSlice";
import { connectPlayer, initPlayer } from "@/lib/redux/playerThunk";
import { useAppDispatch } from "@/lib/redux/store";

async function checkAuthorized() {
  const response = await fetch("/api/spotify/token");
  const json = await response.json();
  const isAuthorized = json.status === "ok";
  return isAuthorized;
}

const usePlayer = () => {
  const user = useUser();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initPlayer());
  }, []);

  useEffect(() => {
    if (user) {
      checkAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          dispatch(connectPlayer());
        } else {
          dispatch(setStatus({ status: "UNAUTHORIZED" }));
        }
      });
    } else {
      dispatch(setStatus({ status: "UNAUTHENTICATED" }));
    }
  }, [user]);
};

export default usePlayer;
