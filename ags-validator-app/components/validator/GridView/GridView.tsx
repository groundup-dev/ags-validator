"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import DataGrid, {
  DataEditorProps,
  EditableGridCell,
  EditListItem,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  Theme,
} from "@glideapps/glide-data-grid";
import { AgsError, GroupRaw } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";

// Props for the table component
interface Props {
  group: GroupRaw; // GroupRaw object
  setGroup: (label: string, group: GroupRaw) => void;
  errors: AgsError[];
}

const getCSSVariable = (variableName: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
};

const GridView: React.FC<Props> = ({ group, setGroup, errors }) => {
  // Create a custom theme using your CSS variables
  const customTheme: Partial<Theme> = useMemo(
    () => ({
      accentColor: getCSSVariable("--border"), // Maps to your primary color
      accentFg: getCSSVariable("--accent-foreground"),
      accentLight: getCSSVariable("--background"),
      // textDark: getCSSVariable("--foreground"),
      // textMedium: getCSSVariable("--muted-foreground"),
      // textLight: getCSSVariable("--primary-foreground"),
      // textBubble: getCSSVariable("--foreground"),
      // bgIconHeader: getCSSVariable("--card"),
      // fgIconHeader: getCSSVariable("--card-foreground"),
      // textHeader: getCSSVariable("--popover-foreground"),
      // textGroupHeader: getCSSVariable("--primary-foreground"),
      // textHeaderSelected: getCSSVariable("--primary-foreground"),
      bgCell: getCSSVariable("--card"),
      bgCellMedium: getCSSVariable("--muted"),
      // bgHeader: getCSSVariable("--secondary"),
      // bgHeaderHasFocus: getCSSVariable("--border"),
      // bgHeaderHovered: getCSSVariable("--accent"),

      borderColor: getCSSVariable("--border"),
      horizontalBorderColor: getCSSVariable("--ring"),
    }),
    []
  );

  useEffect(() => {
    setColumns(
      group.headings.map((heading) => ({
        title: heading.name,
        width: 100,
      }))
    );
  }, [group.name]);

  const [columns, setColumns] = React.useState<GridColumn[]>([]);

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

  // Get cell data for rendering
  const getData = useCallback(
    ([colNum, rowNum]: Item): GridCell => {
      const row = group.rows[rowNum];
      const col = group.headings[colNum];

      if (!row || !col) {
        throw new Error("Invalid cell");
      }

      return {
        kind: GridCellKind.Text,
        data: row.data[col.name] || "",
        allowOverlay: true,
        displayData: row.data[col.name] || "",
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
        rowMarkers={"checkbox"}
        columns={columns}
        getCellContent={getData}
        getCellsForSelection={true}
        onCellEdited={onCellEdited}
        rows={group.rows.length}
        onPaste={true}
        overscrollX={0}
        overscrollY={0}
        // scaleToRem={true}
        maxColumnAutoWidth={200}
        maxColumnWidth={500}
        onColumnResize={onColumnResize}
      />
    </div>
  );
};

export default GridView;
