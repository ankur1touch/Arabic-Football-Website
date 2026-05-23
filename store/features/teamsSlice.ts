import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { Team } from "@/types/team";

interface TeamsState {
  teams: Team[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TeamsState = {
  teams: [],
  status: "idle",
  error: null,
};

export const fetchTeams = createAsyncThunk("teams/fetchAll", async () => {
  const res = await axiosClient.post("/api/teams");
  return res.data as { teams: Team[] };
});

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.teams = action.payload.teams;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch teams";
      });
  },
});

export default teamsSlice.reducer;
