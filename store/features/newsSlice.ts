import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "@/lib/client";
import type { NewsArticle } from "@/types/news";

interface NewsState {
  articles: NewsArticle[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NewsState = {
  articles: [],
  status: "idle",
  error: null,
};

export const fetchNews = createAsyncThunk("news/fetchAll", async () => {
  const res = await axiosClient.post("/api/news");
  return res.data as { articles: NewsArticle[] };
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.articles = action.payload.articles;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch news";
      });
  },
});

export default newsSlice.reducer;
