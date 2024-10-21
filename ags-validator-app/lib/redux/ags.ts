import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AgsError,
  HeadingRaw,
  RowRaw,
  defaultRulesConfig,
  RulesConfig,
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
  loading: boolean;
  rulesConfig: RulesConfig;
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
  loading: false,
  rulesConfig: {
    ...defaultRulesConfig,
    rule2a: false, // for now disabling cr and lf rule
  },
};

export const applySetRowDataEffect = createAsyncThunk<
  { rawData: string; errors: AgsError[] },
  undefined,
  { state: { ags: AgsState } }
>("ags/applySetRowDataEffect", async (_, { getState }) => {
  const parsedAgsNormalized = getState().ags.parsedAgsNormalized;
  if (!parsedAgsNormalized) {
    return {
      rawData: getState().ags.rawData,
      errors: getState().ags.errors,
    };
  }

  const worker = new Worker(
    new URL("../../workers/validateRowUpdateWorker.js", import.meta.url)
  );

  const config = getState().ags.rulesConfig;

  return new Promise<{ rawData: string; errors: AgsError[] }>((resolve) => {
    worker.onmessage = (event) => {
      const { rawData, errors } = event.data;
      resolve({ rawData, errors });
    };

    worker.postMessage({
      parsedAgsNormalized,
      rulesConfig: config,
    });
  });
});

export const applySetRawDataEffect = createAsyncThunk<
  { errors: AgsError[]; parsedAgsNormalized?: AgsRawNormalized },
  undefined,
  { state: { ags: AgsState } }
>("ags/applySetRawDataEffect", async (_, { getState }) => {
  const worker = new Worker(
    new URL("../../workers/validateRawUpdateWorker.js", import.meta.url)
  );

  const rawData = getState().ags.rawData;
  const config = getState().ags.rulesConfig;

  return new Promise<{
    parsedAgsNormalized?: AgsRawNormalized;
    errors: AgsError[];
  }>((resolve) => {
    worker.onmessage = (event) => {
      const { parsedAgsNormalized, errors } = event.data;

      resolve({ parsedAgsNormalized, errors });
    };

    worker.postMessage({ rawData, rulesConfig: config });
  });
});

export const agsSlice = createSlice({
  name: "ags",
  initialState,
  reducers: {
    setRawData: (state, action: PayloadAction<string>) => {
      state.rawData = action.payload;
    },

    deleteRows: (
      state,
      action: PayloadAction<{ group: string; rows: number[] }>
    ) => {
      const { group, rows } = action.payload;

      if (!state.parsedAgsNormalized) {
        return;
      }

      const rowNums = rows.map(
        (row) => row + 4 + state.parsedAgsNormalized![group].lineNumber
      );

      const rowsFlat = Object.values(
        state.parsedAgsNormalized[group].rows
      ).filter((row) => !rowNums.includes(row.lineNumber));

      state.parsedAgsNormalized![group].rows = Object.fromEntries(
        rowsFlat.map((row, index) => [
          index + 4 + state.parsedAgsNormalized![group].lineNumber,
          row,
        ])
      );
    },

    addRow: (state, action: PayloadAction<{ group: string }>) => {
      const headings = state.parsedAgsNormalized?.[
        action.payload.group
      ].headings.map((heading) => heading.name);

      if (!headings) {
        return;
      }

      if (state.parsedAgsNormalized) {
        const lineNumberLast =
          Object.keys(state.parsedAgsNormalized[action.payload.group].rows)
            .length +
          state.parsedAgsNormalized[action.payload.group].lineNumber +
          3;

        const newRow = {
          data: Object.fromEntries(headings.map((heading) => [heading, ""])),
          lineNumber: lineNumberLast + 1,
        };

        state.parsedAgsNormalized[action.payload.group].rows[
          lineNumberLast + 1
        ] = newRow;
      }
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
    builder.addCase(applySetRowDataEffect.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(applySetRawDataEffect.pending, (state) => {
      state.loading = true;
    });
    // we need this to be able to update the state with the results of the workers
    builder.addCase(applySetRowDataEffect.fulfilled, (state, action) => {
      state.rawData = action.payload.rawData;
      state.errors = action.payload.errors;
      state.loading = false;
    });

    builder.addCase(applySetRawDataEffect.fulfilled, (state, action) => {
      state.parsedAgsNormalized = action.payload.parsedAgsNormalized;
      state.errors = action.payload.errors;
      state.loading = false;
    });
  },
});

export const { setRowsData, setRawData, deleteRows, addRow } = agsSlice.actions;

export default agsSlice.reducer;
