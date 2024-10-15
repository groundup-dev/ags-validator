import { configureStore } from "@reduxjs/toolkit";
import { agsSlice } from "./ags";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ags: agsSlice.reducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
