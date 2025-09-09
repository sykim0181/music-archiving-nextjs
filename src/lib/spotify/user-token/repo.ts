import { UserToken } from "@/types/spotify";
import { Tables } from "@/types/supabase";
import { createAdminClient } from "@/utils/supabase/admin";

type SpotifyTokenRow = Tables<"spotify-token">;

export async function saveToken(
  userId: string,
  token: UserToken,
  expiresAt: Date
) {
  const supabase = createAdminClient();

  const { access_token, token_type, scope, refresh_token } = token;

  const { error } = await supabase.from("spotify-token").upsert({
    user_id: userId,
    token_type,
    scope,
    access_token,
    refresh_token,
    expires_at: expiresAt.toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to save token: ${error.message}`);
  }

  return;
}

export async function getToken(
  userId: string
): Promise<SpotifyTokenRow | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("spotify-token")
    .select()
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to fetch user's token: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return data[0] as SpotifyTokenRow;
}
