import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { Player } from "@/types/player";

interface PlayersState {
  players: Player[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PlayersState = {
  players: [],
  status: "idle",
  error: null,
};

export const fetchPlayers = createAsyncThunk("players/fetchAll", async () => {
  const res = await axiosClient.post("/api/players");
  return res.data as { players: Player[] };
});

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlayers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.players = action.payload.players;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch players";
      });
  },
});

export default playersSlice.reducer;
