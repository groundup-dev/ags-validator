"use client";

import React, { useCallback, useMemo } from "react";
import DataGrid, {
  EditableGridCell,
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
} from "@glideapps/glide-data-grid";
import { GroupRaw } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";

// Define the interfaces (as provided in your description)

// Props for the table component
interface Props {
  group: GroupRaw; // GroupRaw object
  setGroup: (label: string, group: GroupRaw) => void;
}

const GridView: React.FC<Props> = ({ group, setGroup }) => {
  // Prepare the columns for the Data Grid
  const columns: GridColumn[] = useMemo(
    () =>
      group.headings.map((heading) => ({
        title: heading.name,
        width: 200,
      })),
    [group.headings]
  );

  const onCellEdited = React.useCallback(
    (cell: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) {
        // we only have text cells, might as well just die here.
        return;
      }
      const [colNum, rowNum] = cell;
      const row = group.rows[rowNum];
      const col = group.headings[colNum];

      if (row === undefined || col === undefined) {
        throw new Error("Invalid cell");
      }

      const heading = group.headings[colNum];
      if (!heading) {
        return;
      }
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

      if (row === undefined || col === undefined) {
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

  const getCellsForSelection = useCallback(
    (selection: Rectangle, abortSignal: AbortSignal): GridCell[][] => {},
    [group]
  );

  return (
    <div className="w-full h-full">
      <DataGrid
        columns={columns}
        getCellContent={getData}
        getCellsForSelection={true}
        onCellEdited={onCellEdited}
        rows={group.rows.length}
        onPaste={true}
        rowMarkers={"number"}
      />
    </div>
  );
};

export default GridView;
