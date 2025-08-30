import { getAccessToken } from "@/utils/spotify";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SpotifyState {
  accessToken: string | null;
}

export const fetchAccessToken = createAsyncThunk(
  "spotify/fetchAccessToken",
  async () => {
    try {
      const token = await getAccessToken();
      return token;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
);

const spotify = createSlice({
  name: "spotify",
  initialState: () => {
    const state: SpotifyState = {
      accessToken: null,
    };
    return state;
  },
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    clearAccessToken: (state) => {
      state.accessToken = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccessToken.fulfilled, (state, action) => {
      state.accessToken = action.payload;
    });
  },
});

export const { setAccessToken, clearAccessToken } = spotify.actions;

export default spotify;
