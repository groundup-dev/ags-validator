"use client";

import React from "react";
import DataGrid, {
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
}

const GridView: React.FC<Props> = ({ group }) => {
  // Prepare the columns for the Data Grid
  const columns: GridColumn[] = group.headings.map((heading) => ({
    title: heading.name,
    width: 200,
  }));

  function getData([colNum, rowNum]: Item): GridCell {
    const row = group.rows[rowNum];
    const col = group.headings[colNum];

    if (row === undefined || col === undefined) {
      throw new Error("Invalid cell");
    }

    return {
      kind: GridCellKind.Text,
      data: row.data[col.name] || "",
      allowOverlay: false,
      displayData: row.data[col.name] || "",
    };
  }

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <DataGrid
        columns={columns}
        getCellContent={getData}
        rows={group.rows.length}
      />
    </div>
  );
};

export default GridView;
