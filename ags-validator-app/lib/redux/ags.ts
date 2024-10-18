import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AgsError, HeadingRaw, RowRaw } from "@groundup/ags";

export interface GroupRawNormalized {
  name: string;
  headings: HeadingRaw[];
  rows: Record<number, RowRaw<this["headings"]>>;
  lineNumber: number;
}

type AgsRawNormalized = {
  [label: string]: GroupRawNormalized;
};

type AgsState = {
  rawData: string;
  errors: AgsError[];
  parsedAgsNormalized: AgsRawNormalized | undefined;
};

interface SetRowDataPayload {
  group: string;
  lineNumber: number;
  update: Record<string, string>;
}

const initialState: AgsState = {
  rawData: "",
  errors: [],
  parsedAgsNormalized: undefined,
};

export const applySetRowDataEffect = createAsyncThunk<
  { rawData?: string; errors?: AgsError[] },
  undefined,
  { state: { ags: AgsState } }
>("ags/applySetRowDataEffect", async (_, { getState }) => {
  const parsedAgsNormalized = getState().ags.parsedAgsNormalized;
  if (!parsedAgsNormalized) {
    return {};
  }

  // Create a new Web Worker
  const worker = new Worker(
    new URL("../../workers/validateRowUpdateWorker.js", import.meta.url)
  );

  // Return a promise that resolves when the worker sends back the result
  return new Promise<{ rawData?: string; errors?: AgsError[] }>((resolve) => {
    worker.onmessage = (event) => {
      const { rawData, errors } = event.data;
      resolve({ rawData, errors });
    };

    // Post the normalized AGS data to the worker for background processing
    worker.postMessage(parsedAgsNormalized);
  });
});

export const applySetRawDataEffect = createAsyncThunk<
  { errors?: AgsError[]; parsedAgsNormalized?: AgsRawNormalized },
  undefined,
  { state: { ags: AgsState } }
>("ags/applySetRawDataEffect", async (_, { getState }) => {
  // Create a new Web Worker
  const worker = new Worker(
    new URL("../../workers/validateRawUpdateWorker.js", import.meta.url)
  );

  const rawData = getState().ags.rawData;

  // Return a promise that resolves when the worker sends back the result
  return new Promise<{
    parsedAgsNormalized?: AgsRawNormalized;
    errors?: AgsError[];
  }>((resolve) => {
    worker.onmessage = (event) => {
      const { parsedAgsNormalized, errors } = event.data;

      resolve({ parsedAgsNormalized, errors });
    };

    // Post the normalized AGS data to the worker for background processing
    worker.postMessage(rawData);
  });
});

export const agsSlice = createSlice({
  name: "ags",
  initialState,
  reducers: {
    setRawData: (state, action: PayloadAction<string>) => {
      state.rawData = action.payload;
    },

    setRowsData: (state, action: PayloadAction<SetRowDataPayload[]>) => {
      action.payload.forEach((payload) => {
        const { group, lineNumber, update } = payload;

        if (state.parsedAgsNormalized) {
          state.parsedAgsNormalized[group].rows[lineNumber].data = {
            ...state.parsedAgsNormalized[group].rows[lineNumber].data,
            ...update,
          };
        }
      });
    },
  },
  extraReducers: (builder) => {
    // we need this to be able to update the state with the results of the worker
    builder.addCase(applySetRowDataEffect.fulfilled, (state, action) => {
      state.rawData = action.payload.rawData ?? state.rawData;
      state.errors = action.payload.errors ?? state.errors;
    });

    builder.addCase(applySetRawDataEffect.fulfilled, (state, action) => {
      state.parsedAgsNormalized =
        action.payload.parsedAgsNormalized ?? state.parsedAgsNormalized;
      state.errors = action.payload.errors ?? state.errors;
    });
  },
});

export const { setRowsData, setRawData } = agsSlice.actions;

export default agsSlice.reducer;
