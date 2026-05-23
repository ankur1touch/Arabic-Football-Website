import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { TeamDetailResponse, TeamInfo, SquadPlayer } from "@/types/team";
import type { Match } from "@/types/match";
import type { StandingRow } from "@/types/tournament";

interface TeamDetailState {
  team: TeamInfo | null;
  squad: SquadPlayer[];
  fixtures: Match[];
  results: Match[];
  standings: StandingRow[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TeamDetailState = {
  team: null,
  squad: [],
  fixtures: [],
  results: [],
  standings: [],
  status: "idle",
  error: null,
};

export const fetchTeamDetail = createAsyncThunk(
  "teamDetail/fetch",
  async (teamId: string) => {
    const res = await axiosClient.post(`/api/teams/${teamId}`);
    return res.data as TeamDetailResponse;
  }
);

const teamDetailSlice = createSlice({
  name: "teamDetail",
  initialState,
  reducers: {
    clearTeamDetail: (state) => {
      state.team = null;
      state.squad = [];
      state.fixtures = [];
      state.results = [];
      state.standings = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTeamDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.team = action.payload.team;
        state.squad = action.payload.squad;
        state.fixtures = action.payload.fixtures;
        state.results = action.payload.results;
        state.standings = action.payload.standings;
      })
      .addCase(fetchTeamDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to load team";
      });
  },
});

export const { clearTeamDetail } = teamDetailSlice.actions;
export default teamDetailSlice.reducer;
