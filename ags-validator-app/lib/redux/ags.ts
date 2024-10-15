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

interface GroupRawNormalized {
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
  heading: string;
  data: string;
}

const initialState: AgsState = {
  rawData: "",
  errors: [],
  parsedAgsNormalized: undefined,
};

// Create an async thunk to handle side effects after updating the row data
export const applySetRowDataEffect = createAsyncThunk<
  { rawData?: string; errors?: AgsError[] },
  SetRowDataPayload,
  { state: { ags: AgsState } }
>("ags/applySetRowDataEffect", async (payload, { getState }) => {
  const parsedAgsNormalized = getState().ags.parsedAgsNormalized;
  if (!parsedAgsNormalized) {
    return {};
  }

  // Now perform the side effect logic (validate and convert)
  const parsedAgs = Object.fromEntries(
    Object.entries(parsedAgsNormalized).map(([label, group]) => [
      label,
      {
        ...group,
        rows: Object.values(group.rows),
      },
    ])
  );

  // Validate and transform the data
  const errors = [
    ...validateAgsDataParsed(parsedAgs),
    ...validateAgsDataParsedWithDict(parsedAgs, "v4_0_4"),
  ];
  const rawData = parsedAgsToString(parsedAgs);

  return { rawData, errors };
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

    setRowData: (state, action: PayloadAction<SetRowDataPayload>) => {
      // Update the row data (this part stays synchronous and pure)
      const { group, lineNumber, data, heading } = action.payload;
      if (state.parsedAgsNormalized) {
        state.parsedAgsNormalized[group].rows[lineNumber].data[heading] = data;
      }
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

export const { setRowData, setRawData } = agsSlice.actions;

export default agsSlice.reducer;
