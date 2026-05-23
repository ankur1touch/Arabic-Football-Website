import { configureStore } from "@reduxjs/toolkit";
import newsReducer from "./features/newsSlice";
import matchesReducer from "./features/matchesSlice";
import tournamentsReducer from "./features/tournamentsSlice";
import rankingsReducer from "./features/rankingsSlice";
import teamsReducer from "./features/teamsSlice";
import playersReducer from "./features/playersSlice";
import localeReducer from "./features/localeSlice";
import fixtureReducer from "./features/fixtureSlice";
import playerDetailReducer from "./features/playerDetailSlice";
import teamDetailReducer from "./features/teamDetailSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      news: newsReducer,
      matches: matchesReducer,
      tournaments: tournamentsReducer,
      rankings: rankingsReducer,
      teams: teamsReducer,
      players: playersReducer,
      fixture: fixtureReducer,
      playerDetail: playerDetailReducer,
      teamDetail: teamDetailReducer,
      locale: localeReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
