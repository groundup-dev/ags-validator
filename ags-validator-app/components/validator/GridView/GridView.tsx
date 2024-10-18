import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DataGrid, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  Theme,
  GridSelection,
  CompactSelection,
  DataEditorProps,
  EditableGridCell,
  EditListItem,
  DataEditorRef,
} from "@glideapps/glide-data-grid";
import { AgsError } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  addRow,
  applySetRowDataEffect,
  GroupRawNormalized,
  setRowsData,
} from "@/lib/redux/ags";

// Props for the table component
interface Props {
  groupName: string;
  selection?: GridSelection;
  setSelection?: (selection: GridSelection) => void;

  setGoToErrorCallback: (callback: (error: AgsError) => void) => void;
  setSelectedRows: (rows: number[]) => void;
}

const getCSSVariable = (variableName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

const GridView: React.FC<Props> = ({
  setGoToErrorCallback,
  groupName,
  setSelectedRows,
}) => {
  const group = useAppSelector(
    (state) => state.ags.parsedAgsNormalized?.[groupName]
  ) as GroupRawNormalized;

  const errors = useAppSelector((state) => state.ags.errors);

  const dispatch = useAppDispatch();

  const ref = useRef<DataEditorRef | null>(null);

  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
    current: undefined,
  });

  console.log("selection", selection);

  const onPaste = useCallback(
    (target: Item, values: readonly (readonly string[])[]): boolean => {
      const lineNumber = group.lineNumber + 4 + target[1];
      const headings = group.headings
        .map((heading) => heading.name)
        .slice(target[0], target[0] + values[0].length);

      const updates = values.map((value, index) => {
        const updateForRow = value.reduce((acc, val, idx) => {
          acc[headings[idx]] = val;
          return acc;
        }, {} as Record<string, string>);

        return {
          group: group.name,
          lineNumber: lineNumber + index,
          update: updateForRow,
        };
      });

      dispatch(setRowsData(updates));
      dispatch(applySetRowDataEffect());

      return false;
    },
    [dispatch, group.headings, group.lineNumber, group.name]
  );

  useEffect(() => {
    if (selection.current) {
      setSelectedRows([]);
    } else {
      setSelectedRows(selection.rows.toArray());
    }
  }, [selection, setSelectedRows]);

  const customTheme: Partial<Theme> = useMemo(
    () => ({
      accentColor: getCSSVariable("--secondary"),
      accentFg: getCSSVariable("--secondary-foreground"),
      accentLight: getCSSVariable("--muted"),
    }),
    []
  );

  const scrollToError = useCallback(
    (error: AgsError) => {
      if (group.name !== error.group) {
        return;
      }

      const rowIndex = error.lineNumber - group.lineNumber - 4;

      if (rowIndex < 0) {
        // if less than 0, then the error is in the group heading or units
        return;
      }

      ref.current?.scrollTo(0, rowIndex, "both", 0, 0, {
        vAlign: "center",
        hAlign: "center",
      });
    },
    [group.lineNumber, group.name, ref]
  );

  useEffect(() => {
    setGoToErrorCallback(() => scrollToError);
  }, [setGoToErrorCallback, scrollToError]);

  const [columns, setColumns] = useState<GridColumn[]>([]);

  const highlights = React.useMemo<DataEditorProps["highlightRegions"]>(() => {
    return errors
      .filter((error) => error.group === group.name)
      .map((error) => {
        // minus 4 as there are 4 lines before the table starts
        const rowIndex = error.lineNumber - group.lineNumber - 4;
        return {
          color: error.severity === "error" ? "#DC262622" : "#F59E0B22",
          range: {
            x: 0,
            y: rowIndex,
            width: group.headings.length,
            height: 1,
          },
          style: "solid",
        };
      });
  }, [errors, group.name, group.lineNumber, group.headings.length]);

  useEffect(() => {
    setColumns(
      group.headings.map((heading) => ({
        title: heading.name,
        width: 100,
      }))
    );
  }, [group.headings]);

  const onCellsEdited = (newValues: readonly EditListItem[]) => {
    const cells: Item[] = newValues.map((cell) => cell.location);
    const values = newValues.map((cell) => cell.value) as EditableGridCell[];

    dispatch(
      setRowsData(
        cells.map((cell, index) => {
          const colNum = cell[0];
          const rowNum = cell[1];
          const heading = group.headings[colNum];
          const data =
            values[index]?.kind === GridCellKind.Text ? values[index].data : "";

          return {
            group: group.name,
            lineNumber: group.lineNumber + 4 + rowNum,
            update: {
              [heading.name]: data,
            },
          };
        })
      )
    );

    dispatch(applySetRowDataEffect());
  };

  const onCellEdited = () => {};

  const getData = useCallback(
    ([colNum, rowNum]: Item): GridCell => {
      const lineNumber = group.lineNumber + 4 + rowNum;
      const row = group.rows[lineNumber];
      const col = group.headings[colNum];
      const data = row && col ? row.data[col.name] : "";

      return {
        kind: GridCellKind.Text,
        data: data,
        allowOverlay: true,
        displayData: data,
        readonly: false,
      };
    },
    [group]
  );

  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number) => {
      setColumns((prevColsMap) => {
        const index = prevColsMap.findIndex((ci) => ci.title === column.title);
        const newArray = [...prevColsMap];
        newArray.splice(index, 1, {
          ...prevColsMap[index],
          width: newSize,
          title: column.title,
        });
        return newArray;
      });
    },
    [setColumns]
  );

  const onRowAppended = useCallback(() => {
    dispatch(addRow({ group: group.name }));
  }, [dispatch, group.name]);

  return (
    <div className="w-full h-full">
      <DataGrid
        height={"100%"}
        width={"100%"}
        ref={ref}
        theme={customTheme}
        onCellsEdited={onCellsEdited}
        highlightRegions={highlights}
        rowMarkers={{
          startIndex: group.lineNumber + 4,
          kind: "both",
        }}
        onRowAppended={onRowAppended}
        trailingRowOptions={{
          hint: "Add Row...",
          sticky: false,
          tint: true,
        }}
        columns={columns}
        getCellContent={getData}
        getCellsForSelection={true}
        onCellEdited={onCellEdited}
        rows={Object.keys(group.rows).length}
        onPaste={onPaste}
        maxColumnAutoWidth={200}
        maxColumnWidth={500}
        onColumnResize={onColumnResize}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
      />
    </div>
  );
};

export default GridView;
