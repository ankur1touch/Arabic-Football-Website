import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { RankingEntry } from "@/types/ranking";

interface RankingsState {
  men: RankingEntry[];
  women: RankingEntry[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: RankingsState = {
  men: [],
  women: [],
  status: "idle",
  error: null,
};

export const fetchRankings = createAsyncThunk("rankings/fetchAll", async () => {
  const res = await axiosClient.post("/api/rankings");
  return res.data as { men: RankingEntry[]; women: RankingEntry[] };
});

const rankingsSlice = createSlice({
  name: "rankings",
  initialState,
  reducers: {
    hydrateRankings: (
      state,
      action: PayloadAction<{ men: RankingEntry[]; women: RankingEntry[] }>
    ) => {
      state.men = action.payload.men;
      state.women = action.payload.women;
      state.status = "succeeded";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRankings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRankings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.men = action.payload.men;
        state.women = action.payload.women;
      })
      .addCase(fetchRankings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch rankings";
      });
  },
});

export const { hydrateRankings } = rankingsSlice.actions;
export default rankingsSlice.reducer;
