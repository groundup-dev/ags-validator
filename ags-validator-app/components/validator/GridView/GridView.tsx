"use client";

import React, { useCallback, useMemo } from "react";
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

// Props for the table component
interface Props {
  group: GroupRaw; // GroupRaw object
  setGroup: (label: string, group: GroupRaw) => void;
}

const GridView: React.FC<Props> = ({ group, setGroup }) => {
  const columns: GridColumn[] = useMemo(
    () =>
      group.headings.map((heading) => ({
        title: heading.name,
        width: 100,
      })),
    [group.headings]
  );

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

  return (
    <div className="w-full h-full">
      <DataGrid
        onCellsEdited={onCellsEdited}
        rowMarkers={"checkbox-visible"}
        columns={columns}
        getCellContent={getData}
        getCellsForSelection={true}
        onCellEdited={onCellEdited}
        rows={group.rows.length}
        onPaste={true}
      />
    </div>
  );
};

export default GridView;
