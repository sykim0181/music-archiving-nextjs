import { PlayerStatus } from "@/lib/redux/playerSlice";
import { useTypedSelector } from "@/lib/redux/store";
import { getAuthorizationCodeUrl } from "@/utils/spotifyUtils";
import { useRouter } from "next/navigation";

const message: Record<PlayerStatus, string> = {
  UNAUTHENTICATED: "로그인이 필요한 기능입니다.",
  UNAUTHORIZED: "Spotify 권한 승인이 필요합니다.",
  PLAYER_INITIALIZATION_ERROR: "플레이어 초기화 과정에서 문제가 발생했습니다.",
  PLAYBACK_ERROR: "플레이어 재생 문제가 발생했습니다.",
  INVALID_TOKEN: "Spotify 권한에 문제가 있습니다.",
  NOT_PREMIUM_ACCOUNT: "Spotify 프리미엄 요금제가 필요합니다.",
  UNKNOWN_ERROR: "플레이어에 문제가 발생했습니다."
};

const PlayerOverlay = () => {
  const status = useTypedSelector((state) => state.player.status);
  const router = useRouter();

  if (!status) {
    return <></>;
  }

  return (
    <div className="player-overlay">
      <p>{message[status]}</p>

      {status === "UNAUTHORIZED" && (
        <button
          className="bg_black action-button"
          onClick={() => router.push(getAuthorizationCodeUrl())}
        >
          연동하기
        </button>
      )}
    </div>
  );
};

export default PlayerOverlay;
