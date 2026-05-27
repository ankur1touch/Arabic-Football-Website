import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { Match } from "@/types/match";

interface MatchesState {
  matches: Match[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  status: "idle",
  error: null,
};

export const fetchMatches = createAsyncThunk("matches/fetchAll", async () => {
  const res = await axiosClient.post("/api/matches");
  return res.data as { matches: Match[] };
});

export const fetchLiveScores = createAsyncThunk("matches/fetchLive", async () => {
  const res = await axiosClient.get("/api/live-scores");
  return res.data as { matches: Match[] };
});

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    hydrateMatches: (state, action: PayloadAction<Match[]>) => {
      state.matches = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matches = action.payload.matches;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch matches";
      })
      .addCase(fetchLiveScores.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.matches = action.payload.matches;
      });
  },
});

export const { hydrateMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
