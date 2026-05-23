import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { PlayerDetailResponse, PlayerInfo, PlayerStatistics } from "@/types/player";
import type { Match } from "@/types/match";

interface PlayerDetailState {
  player: PlayerInfo | null;
  statistics: PlayerStatistics[];
  fixtures: Match[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PlayerDetailState = {
  player: null,
  statistics: [],
  fixtures: [],
  status: "idle",
  error: null,
};

export const fetchPlayerDetail = createAsyncThunk(
  "playerDetail/fetch",
  async (playerId: string) => {
    const res = await axiosClient.post(`/api/players/${playerId}`);
    return res.data as PlayerDetailResponse;
  }
);

const playerDetailSlice = createSlice({
  name: "playerDetail",
  initialState,
  reducers: {
    clearPlayerDetail: (state) => {
      state.player = null;
      state.statistics = [];
      state.fixtures = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayerDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlayerDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.player = action.payload.player;
        state.statistics = action.payload.statistics;
        state.fixtures = action.payload.recentFixtures;
      })
      .addCase(fetchPlayerDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load player";
      });
  },
});

export const { clearPlayerDetail } = playerDetailSlice.actions;
export default playerDetailSlice.reducer;
