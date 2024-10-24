import { configureStore } from "@reduxjs/toolkit";
import { agsSlice } from "./ags";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ags: agsSlice.reducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware({
    //     serializableCheck: false,
    //     immutableCheck: false,
    //     actionCreatorCheck: false,
    //   }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
