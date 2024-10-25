import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AgsError,
  HeadingRaw,
  RowRaw,
  defaultRulesConfig,
  RulesConfig,
  AgsDictionaryVersion,
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

type Action = {
  type: string;
  group: string;
};

type AddAction = Action & {
  type: "add";
};

type DeleteAction = Action & {
  type: "delete";
  rows: Record<number, RowRaw<HeadingRaw[]>>;
};

type UpdateAction = Action & {
  type: "update";
  rows: SetRowDataPayload[];
};

type HistoryAction = AddAction | DeleteAction | UpdateAction;

type AgsState = {
  rawData: string;
  errors: AgsError[];
  parsedAgsNormalized: AgsRawNormalized | undefined;
  loading: boolean;
  rulesConfig: RulesConfig;
  agsDictionaryVersion: AgsDictionaryVersion;
  past: HistoryAction[];
  future: HistoryAction[];
  canUndo: boolean;
  canRedo: boolean;
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
  agsDictionaryVersion: "v4_0_4",

  canUndo: false,
  canRedo: false,
  past: [],
  future: [],
  rulesConfig: {
    ...defaultRulesConfig,
    rule2a: false, // for now disabling cr and lf rule
  },
};

function getCurrentRowsState(
  state: AgsState,
  action: UpdateAction
): UpdateAction {
  const headingsInUpdate = [
    ...new Set(action.rows.flatMap((row) => Object.keys(row.update))),
  ];

  // get current state of the rows to be updated, so we can undo
  const rowPartials = action.rows.map((row) => {
    return {
      group: row.group,
      lineNumber: row.lineNumber,
      update: headingsInUpdate.reduce((acc, heading) => {
        acc[heading] =
          state.parsedAgsNormalized![action.group].rows[row.lineNumber].data[
            heading
          ];
        return acc;
      }, {} as Record<string, string>),
    };
  });

  return {
    ...action,
    rows: rowPartials,
  };
}

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
      agsDictionaryVersion: getState().ags.agsDictionaryVersion,
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

    worker.postMessage({
      rawData,
      rulesConfig: config,
      agsDictionaryVersion: getState().ags.agsDictionaryVersion,
    });
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

      if (state.future.length > 0) {
        state.future = [];
      }

      const rowNums = rows.map(
        (row) => row + 4 + state.parsedAgsNormalized![group].lineNumber
      );

      const rowsToDelete = Object.fromEntries(
        Object.entries(state.parsedAgsNormalized[group].rows).filter(
          ([lineNumber]) => rowNums.includes(parseInt(lineNumber))
        )
      );

      const rowsFlat = Object.values(
        state.parsedAgsNormalized[group].rows
      ).filter((row) => !rowsToDelete[row.lineNumber]);

      // need to reindex the rows, including numbers on row object
      state.parsedAgsNormalized[group].rows = Object.fromEntries(
        rowsFlat.map((row, index) => [
          index + 4 + state.parsedAgsNormalized![group].lineNumber,
          {
            ...row,
            lineNumber:
              index + 4 + state.parsedAgsNormalized![group].lineNumber,
          },
        ])
      );

      state.past.push({
        type: "delete",
        group,
        rows: rowsToDelete,
      });
    },

    clearHistory: (state) => {
      state.past = [];
      state.future = [];
    },

    addRow: (state, action: PayloadAction<{ group: string }>) => {
      if (!state.parsedAgsNormalized) {
        return;
      }

      const headings = state.parsedAgsNormalized?.[
        action.payload.group
      ].headings.map((heading) => heading.name);

      if (!headings) {
        return;
      }

      if (state.future.length > 0) {
        state.future = [];
      }

      const lineNumberLast =
        Math.max(
          ...Object.keys(
            state.parsedAgsNormalized[action.payload.group].rows
          ).map((lineNumber) => parseInt(lineNumber))
        ) + 1;

      const newRow = {
        data: Object.fromEntries(headings.map((heading) => [heading, ""])),
        lineNumber: lineNumberLast + 1,
      };

      state.parsedAgsNormalized[action.payload.group].rows[lineNumberLast + 1] =
        newRow;

      state.past.push({ type: "add", group: action.payload.group });
    },

    setRowsData: (state, action: PayloadAction<SetRowDataPayload[]>) => {
      const group = action.payload[0].group;

      const updateActionForHistory: UpdateAction = getCurrentRowsState(state, {
        type: "update",
        group,
        rows: action.payload,
      });

      state.past.push(updateActionForHistory);

      if (state.future.length > 0) {
        state.future = [];
      }

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

    redo: (state) => {
      const nextAction = state.future.pop();
      if (!nextAction) {
        return;
      }

      switch (nextAction.type) {
        case "add":
          state.past.push({ type: "add", group: nextAction.group });
          const lineNumberLast = Math.max(
            ...Object.keys(
              state.parsedAgsNormalized![nextAction.group].rows
            ).map((lineNumber) => parseInt(lineNumber))
          );

          const newRow = {
            data: Object.fromEntries(
              state.parsedAgsNormalized![nextAction.group].headings.map(
                (heading) => [heading.name, ""]
              )
            ),
            lineNumber: lineNumberLast + 1,
          };

          state.parsedAgsNormalized![nextAction.group].rows[
            lineNumberLast + 1
          ] = newRow;
          break;

        case "delete":
          state.past.push(nextAction);
          // need to re-delete the rows that were removed before, in the right place, and renumber the rest
          const { group, rows } = nextAction;

          const rowsFlat = Object.values(
            state.parsedAgsNormalized![group].rows
          ).filter((row) => !rows[row.lineNumber]);

          // need to reindex the rows, including numbers on row object
          state.parsedAgsNormalized![group].rows = Object.fromEntries(
            rowsFlat.map((row, index) => [
              index + 4 + state.parsedAgsNormalized![group].lineNumber,
              {
                ...row,
                lineNumber:
                  index + 4 + state.parsedAgsNormalized![group].lineNumber,
              },
            ])
          );

          break;

        case "update":
          const actionForHistory = getCurrentRowsState(state, nextAction);
          state.past.push(actionForHistory);

          nextAction.rows.forEach((row) => {
            const { group, lineNumber, update } = row;

            if (state.parsedAgsNormalized) {
              state.parsedAgsNormalized[group].rows[lineNumber].data = {
                ...state.parsedAgsNormalized[group].rows[lineNumber].data,
                ...update,
              };
            }
          });
          break;
      }
    },
    undo: (state) => {
      const lastAction = state.past.pop();

      if (!lastAction) {
        return;
      }

      switch (lastAction.type) {
        case "delete":
          state.future.push(lastAction);

          // need to un-delete the rows that were removed before, in the right place, and renumber the rest
          const insertRow = Math.min(
            ...Object.keys(lastAction.rows).map((row) => parseInt(row))
          );

          // renumber the rows that are below the deleted rows
          const shiftedRows = Object.fromEntries(
            Object.entries(state.parsedAgsNormalized![lastAction.group].rows)
              .filter(([lineNumber]) => parseInt(lineNumber) >= insertRow)
              .map(([lineNumber, row]) => {
                return [
                  parseInt(lineNumber) + Object.keys(lastAction.rows).length,
                  {
                    ...row,
                    lineNumber:
                      parseInt(lineNumber) +
                      Object.keys(lastAction.rows).length,
                  },
                ];
              })
          );

          // merge the shifted rows with the deleted rows
          const merged = {
            ...state.parsedAgsNormalized![lastAction.group].rows,
            ...shiftedRows,
            ...lastAction.rows,
          };

          state.parsedAgsNormalized![lastAction.group].rows = merged;
          break;

        case "add":
          state.future.push({ type: "add", group: lastAction.group });

          const lastRow = Math.max(
            ...Object.keys(
              state.parsedAgsNormalized![lastAction.group].rows
            ).map((lineNumber) => parseInt(lineNumber))
          );
          delete state.parsedAgsNormalized![lastAction.group].rows[lastRow];

          break;

        case "update":
          const actionForHistory = getCurrentRowsState(state, lastAction);
          state.future.push(actionForHistory);

          lastAction.rows.forEach((row) => {
            const { group, lineNumber, update } = row;

            if (state.parsedAgsNormalized) {
              state.parsedAgsNormalized[group].rows[lineNumber].data = {
                ...state.parsedAgsNormalized[group].rows[lineNumber].data,
                ...update,
              };
            }
          });
          break;
      }
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

export const {
  setRowsData,
  setRawData,
  deleteRows,
  addRow,
  undo,
  redo,
  clearHistory,
} = agsSlice.actions;

export default agsSlice.reducer;
