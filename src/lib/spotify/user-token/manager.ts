import { fetchTokenByRefreshToken } from "./fetch";
import { getToken, saveToken } from "./repo";

export async function getUserAccessToken(userId: string) {
  const row = await getToken(userId);

  // 토큰 발급받은 적 없는 사용자
  if (!row) {
    return null;
  }

  const { access_token, refresh_token, expires_at } = row;

  const exp = new Date(expires_at).getTime();
  const now = Date.now();

  if (exp > now + 1000) {
    return access_token;
  }

  // 만료 -> refresh
  const { token, expiresAt } = await fetchTokenByRefreshToken(refresh_token);
  await saveToken(userId, token, expiresAt);

  return token.access_token;
}
