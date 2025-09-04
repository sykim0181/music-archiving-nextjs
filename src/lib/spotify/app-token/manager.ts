import {
  clearCachedAppToken,
  getCachedAppToken,
  setCachedAppToken,
} from "./cache";
import { fetchAppAccessToken } from "./fetch";

export async function getAppAccessToken() {
  const cachedToken = getCachedAppToken();
  const now = Date.now();

  // 만료 시간이 1분 넘게 남은 토큰이 캐시되어있으면
  if (cachedToken && cachedToken.expiresAt > now + 60 * 1000) {
    return cachedToken.token;
  }

  const { token, expiresAt } = await fetchAppAccessToken();
  setCachedAppToken({ token, expiresAt });
  return token;
}

export function invalidateAppAccessToken() {
  clearCachedAppToken();
}
