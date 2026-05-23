import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Locale = "ar" | "en";

interface LocaleState {
  locale: Locale;
  dir: "rtl" | "ltr";
}

const initialState: LocaleState = {
  locale: "ar",
  dir: "rtl",
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
      state.dir = action.payload === "ar" ? "rtl" : "ltr";
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
