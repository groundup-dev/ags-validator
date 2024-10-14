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
import { AgsError, GroupRaw } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";

// Props for the table component
interface Props {
  group: GroupRaw;
  setGroup: (label: string, group: GroupRaw) => void;
  errors: AgsError[];
  setGoToErrorCallback: (callback: (error: AgsError) => void) => void;
  setSelectedRows: (rows: number[]) => void;
}

const getCSSVariable = (variableName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

const GridView: React.FC<Props> = ({
  group,
  setGoToErrorCallback,
  errors,
  setGroup,
  setSelectedRows,
}) => {
  const ref = useRef<DataEditorRef | null>(null);

  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
    current: undefined,
  });

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

  const onCellsEdited = React.useCallback(
    (newValues: readonly EditListItem[]) => {
      const cells: Item[] = newValues.map((cell) => cell.location);
      const values = newValues.map((cell) => cell.value) as EditableGridCell[];

      const newGroup = {
        ...group,
        rows: group.rows.map((row, rowIndex) => {
          const updatedRow = { ...row };
          cells.forEach((cell, index) => {
            if (cell[1] === rowIndex) {
              const colNum = cell[0];
              const heading = group.headings[colNum];
              if (heading) {
                const newData =
                  values[index]?.kind === GridCellKind.Text
                    ? values[index].data
                    : "";

                updatedRow.data[heading.name] = newData;
              }
            }
          });
          return updatedRow;
        }),
      };
      setGroup(group.name, newGroup);
    },
    [group, setGroup]
  );

  const onCellEdited = React.useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        return; // Only handle text cells
      }

      const [colNum, rowNum] = cell;
      const row = group.rows[rowNum];
      const col = group.headings[colNum];

      if (!row || !col) return;

      const heading = group.headings[colNum];
      if (!heading) return;
      const newGroup = {
        ...group,
        rows: group.rows.map((r, i) =>
          i === rowNum
            ? { ...r, data: { ...r.data, [heading.name]: newValue.data } }
            : r
        ),
      };

      setGroup(group.name, newGroup);
    },
    [group, setGroup]
  );

  const getData = useCallback(
    ([colNum, rowNum]: Item): GridCell => {
      const row = group.rows[rowNum];
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
    const newRow = {
      data: group.headings.reduce((acc, heading) => {
        acc[heading.name] = "";
        return acc;
      }, {} as Record<string, string>),
      lineNumber: group.rows.length + group.lineNumber + 4,
    };

    const newGroup = {
      ...group,
      rows: [...group.rows, newRow],
    };

    setGroup(group.name, newGroup);
  }, [group, setGroup]);

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
        rows={group.rows.length}
        onPaste={true}
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
