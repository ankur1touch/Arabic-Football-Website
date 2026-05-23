import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { FixtureDetail } from "@/types/fixture-detail";

interface FixtureState {
  detail: FixtureDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FixtureState = {
  detail: null,
  status: "idle",
  error: null,
};

export const fetchFixtureDetail = createAsyncThunk(
  "fixture/fetchDetail",
  async (matchId: number | string) => {
    const res = await axiosClient.post(`/api/matches/${matchId}`);
    return res.data as FixtureDetail;
  }
);

const fixtureSlice = createSlice({
  name: "fixture",
  initialState,
  reducers: {
    clearFixture: (state) => {
      state.detail = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFixtureDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFixtureDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchFixtureDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load fixture";
      });
  },
});

export const { clearFixture } = fixtureSlice.actions;
export default fixtureSlice.reducer;
