import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AgsError,
  //   AgsRaw,
  //   AgsDictionaryVersion,
  validateAgsData,
  parsedAgsToString,
  validateAgsDataParsed,
  validateAgsDataParsedWithDict,
  HeadingRaw,
  RowRaw,
} from "@groundup/ags";

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
    new URL("../../workers/validationWorker.js", import.meta.url)
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

export const agsSlice = createSlice({
  name: "ags",
  initialState,
  reducers: {
    setRawData: (state, action: PayloadAction<string>) => {
      state.rawData = action.payload;
      const { errors, parsedAgs } = validateAgsData(action.payload);

      state.errors = errors;

      if (!parsedAgs) {
        state.parsedAgsNormalized = undefined;
        return;
      }

      const parsedAgsNormalized = Object.fromEntries(
        Object.entries(parsedAgs).map(([label, group]) => [
          label,
          {
            ...group,
            rows: Object.fromEntries(
              group.rows.map((row) => [row.lineNumber, row])
            ),
          },
        ])
      );

      state.parsedAgsNormalized = parsedAgsNormalized;
    },

    setRowsData: (state, action: PayloadAction<SetRowDataPayload[]>) => {
      action.payload.forEach((payload) => {
        const { group, lineNumber, update } = payload;
        console.log("setRowsData", group, lineNumber, update);

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
    // Handle the side effect thunk results and only update the state if successful
    builder.addCase(applySetRowDataEffect.fulfilled, (state, action) => {
      state.rawData = action.payload.rawData ?? state.rawData;
      state.errors = action.payload.errors ?? state.errors;
    });
  },
});

export const { setRowsData, setRawData } = agsSlice.actions;

export default agsSlice.reducer;
