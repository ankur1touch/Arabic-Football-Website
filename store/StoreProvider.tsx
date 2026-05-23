"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./index";
import { setLocale, type Locale } from "./features/localeSlice";

export function StoreProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const storeRef = useRef(makeStore());

  useEffect(() => {
    storeRef.current.dispatch(setLocale(locale));
  }, [locale]);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
