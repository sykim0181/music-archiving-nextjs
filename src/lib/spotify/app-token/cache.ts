export type AppToken = {
  token: string;
  expiresAt: number;
};

let cache: AppToken | undefined = undefined;

export function getCachedAppToken() {
  return cache;
}

export function setCachedAppToken(appToken: AppToken) {
  cache = appToken;
}

export function clearCachedAppToken() {
  cache = undefined;
}
