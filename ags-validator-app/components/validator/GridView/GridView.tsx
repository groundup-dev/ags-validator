"use client";

import React, { useCallback, useEffect } from "react";
import DataGrid, {
  EditableGridCell,
  EditListItem,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { GroupRaw } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";
import { useValidator } from "../hooks/useValidator";

// Props for the table component
interface Props {
  group: GroupRaw; // GroupRaw object
  setGroup: (label: string, group: GroupRaw) => void;
}

const updateGroup = (
  group: GroupRaw,
  updates: { cell: Item; value: EditableGridCell }[]
): GroupRaw => {
  const updatedRows = [...group.rows];
  const updatedHeadings = [...group.headings];

  updates.forEach(({ cell, value }) => {
    const [colNum, rowIndex] = cell;
    const heading = group.headings[colNum];
    const data = value.data as string;

    // Update heading (first two rows represent special cases for unit/type)
    if (rowIndex === 0 && heading) {
      updatedHeadings[colNum] = { ...heading, unit: data };
    } else if (rowIndex === 1 && heading) {
      updatedHeadings[colNum] = { ...heading, type: data };
    } else {
      // Update data rows (rowIndex - 2 for actual data rows)
      const rowNumForData = rowIndex - 2;
      if (heading && updatedRows[rowNumForData]) {
        updatedRows[rowNumForData] = {
          ...updatedRows[rowNumForData],
          data: {
            ...updatedRows[rowNumForData].data,
            [heading.name]: data,
          },
        };
      }
    }
  });

  return { ...group, rows: updatedRows, headings: updatedHeadings };
};

const GridView: React.FC<Props> = ({ group, setGroup }) => {
  useEffect(() => {
    console.log("group.headings", group.headings);
    console.log("setting columns");
    setColumns(
      group.headings.map((heading) => ({
        title: heading.name,
        width: 100,
      }))
    );
  }, [group.name]);

  // const { parsedAgs, errors } = useValidator();

  const [columns, setColumns] = React.useState<GridColumn[]>([]);

  const onCellsEdited = React.useCallback(
    (newValues: readonly EditListItem[]) => {
      // Transform the input data into the format expected by updateGroup
      const updates = newValues.map((newItem) => ({
        cell: newItem.location,
        value: newItem.value,
      }));

      // Perform all state updates at once by constructing the new group
      const newGroup = updateGroup(group, updates);

      // Set the group state once with the updated data

      setGroup(group.name, newGroup);
      console.log("setting group on cells edit");
    },
    [group, setGroup]
  );

  // Handle single cell edit
  const onCellEdited = React.useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) return; // Only handle text cells

      // Single cell edit wrapped as an array
      const updates = [{ cell, value: newValue }];

      // Perform the state update at once by constructing the new group
      const newGroup = updateGroup(group, updates);

      // Check if there are any changes before setting the group state
      if (JSON.stringify(group) !== JSON.stringify(newGroup)) {
        setGroup(group.name, newGroup);
        console.log("setting group on cell edit");
      }
      // setGroup(group.name, newGroup);
      // console.log("setting group on cell edit");
    },
    [group, setGroup]
  );

  const getDataForCell = (colNum: number, rowNum: number): string => {
    const col = group.headings[colNum];

    // if first row we give units
    if (rowNum == 0) {
      return col?.unit || "";
    } else if (rowNum == 1) {
      return col?.type || "";
    }

    const row = group.rows[rowNum - 2];
    console;

    if (!row || !col) {
      return "";
    }

    return row.data[col.name] || "";
  };

  // Get cell data for rendering
  const getData = useCallback(
    ([colNum, rowNum]: Item): GridCell => {
      const data = getDataForCell(colNum, rowNum);

      return {
        kind: GridCellKind.Text,
        data: data,
        allowOverlay: true,
        displayData: data,
        readonly: false,
      };
    },
    [group, getDataForCell]
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
        onCellsEdited={onCellsEdited}
        rowMarkers={"checkbox"}
        columns={columns}
        getCellContent={getData}
        getCellsForSelection={true}
        onCellEdited={onCellEdited}
        rows={group.rows.length + 2}
        onPaste={true}
        overscrollX={0}
        overscrollY={0}
        freezeTrailingRows={-2}
        getRowThemeOverride={(i) =>
          i > 1
            ? undefined
            : {
                bgCell: "#e0f0ff88",
              }
        }
        //
        // scaleToRem={true}
        maxColumnAutoWidth={200}
        maxColumnWidth={500}
        onColumnResize={onColumnResize}
      />
    </div>
  );
};

export default GridView;
