import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlayerStatus =
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED"
  | "PLAYER_INITIALIZATION_ERROR"
  | "INVALID_TOKEN"
  | "NOT_PREMIUM_ACCOUNT"
  | "PLAYBACK_ERROR"
  | "UNKNOWN_ERROR";

type PlaybackContext = { type: "none" } | { type: "album"; id: string };

type Track = {
  id: string;
};

interface PlayerState {
  deviceId?: string;
  isReady: boolean;
  status?: PlayerStatus;
  context: PlaybackContext;
  isPlaying: boolean;
  track?: Track;
}

const initialState: PlayerState = {
  isReady: false,
  context: { type: "none" },
  isPlaying: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    ready: (state, action: PayloadAction<{ deviceId: string }>) => {
      state.deviceId = action.payload.deviceId;
      state.isReady = true;
    },
    notReady: (state) => {
      state.isReady = false;
    },
    setStatus: (state, action: PayloadAction<{ status: PlayerStatus }>) => {
      state.status = action.payload.status;
    },
    clearStatus: (state) => {
      state.status = undefined;
    },
    setContext: (state, action: PayloadAction<PlaybackContext>) => {
      state.context = action.payload;
    },
    clearContext: (state) => {
      state.context = { type: "none" };
    },
    turnOn: (state) => {
      state.isPlaying = true;
    },
    turnOff: (state) => {
      state.isPlaying = false;
    },
    setTrack: (state, action: PayloadAction<Track>) => {
      state.track = action.payload;
    },
  },
});

export const {
  ready,
  notReady,
  setStatus,
  clearStatus,
  setContext,
  clearContext,
  turnOn,
  turnOff,
  setTrack,
} = playerSlice.actions;

export default playerSlice;
