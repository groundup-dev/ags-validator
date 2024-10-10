import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "@glideapps/glide-data-grid";
import { AgsError, GroupRaw } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";

// Props for the table component
interface Props {
  group: GroupRaw;
  setGroup: (label: string, group: GroupRaw) => void;
  errors: AgsError[];
  tableRowErrorNumber: number; 
  tableHeaderErrorNumber: number;
  selectedErrorGroup: string;
}

const getCSSVariable = (variableName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

const GridView: React.FC<Props> = ({ 
  group, 
  tableRowErrorNumber, 
  tableHeaderErrorNumber, 
  selectedErrorGroup, 
  errors, 
  setGroup 
}) => {
  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  const customTheme: Partial<Theme> = useMemo(
    () => ({
      accentColor: getCSSVariable("--border"), // Maps to your primary color
      accentFg: getCSSVariable("--accent-foreground"),
      accentLight: getCSSVariable("--background"),
      bgCell: getCSSVariable("--card"),
      bgCellMedium: getCSSVariable("--muted"),
      borderColor: getCSSVariable("--border"),
      horizontalBorderColor: getCSSVariable("--ring"),
    }),
    []
  );

  const [columns, setColumns] = useState<GridColumn[]>([]);

  const highlights = React.useMemo<DataEditorProps["highlightRegions"]>(() => {
    return errors
      .filter((error) => error.group === group.name)
      .map((error) => {
        console.log(error);

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

  // const incomingCol = 20; // Column 2, index 1

  useEffect(() => {
    // Only select if the group matches
    if (group.name === selectedErrorGroup) {
      const headerIndex = tableHeaderErrorNumber - 1;
      const rowIndex = tableRowErrorNumber - 1; // Convert to zero-based index

      // Check if the row index is within bounds
      if (rowIndex >= 0 && rowIndex < group.rows.length) {
        setSelection({
          current: {
            cell: [headerIndex, rowIndex], // Use the zero-based row index
            range: {
              x: headerIndex,
              y: rowIndex,
              width: 1,
              height: 1,
            },
            rangeStack: [],
          },
          columns: CompactSelection.empty(),
          rows: CompactSelection.empty(),
        });

        console.log(`Selected cell: [${headerIndex}, ${rowIndex}]`);
      }
    }

    // Scroll to the selected cell
    document.querySelector("div[role='grid']")?.scrollTo({
      top: tableRowErrorNumber * 30, // Assuming each row is 30px high, adjust if needed
      left: tableHeaderErrorNumber * 100, // Assuming each column is 100px wide, adjust if needed
      behavior: "smooth",
    });
  }, [group.name, tableRowErrorNumber, selectedErrorGroup, group.rows.length, tableHeaderErrorNumber]);


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

  // Handle single cell edit
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

  return (
    <div className="w-full h-full">
      <DataGrid
        theme={customTheme}
        onCellsEdited={onCellsEdited}
        highlightRegions={highlights}
        rowMarkers="checkbox"
        columns={columns}
        getCellContent={getData}
        getCellsForSelection={true}
        onCellEdited={onCellEdited}
        rows={group.rows.length}
        onPaste={true}
        overscrollX={0}
        overscrollY={0}
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





