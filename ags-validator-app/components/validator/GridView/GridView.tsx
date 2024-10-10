import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataGrid, {
  GridCell,
  GridCellKind,
  GridColumn,
  Item,
  Theme,
  GridSelection,
  CompactSelection,
} from "@glideapps/glide-data-grid";
import { AgsError, GroupRaw } from "@groundup/ags";
import "@glideapps/glide-data-grid/dist/index.css";

// Props for the table component
interface Props {
  group: GroupRaw;
  setGroup: (label: string, group: GroupRaw) => void;
  errors: AgsError[];
  tableRowErrorNumber: number; // Expected to be one-based
  selectedErrorGroup: string;
}

const GridView: React.FC<Props> = ({ group, tableRowErrorNumber, selectedErrorGroup }) => {
  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  const customTheme: Partial<Theme> = useMemo(
    () => ({
      accentColor: "#3498db",
      borderColor: "#ccc",
      bgCell: "#f9f9f9",
    }),
    []
  );

  const [columns, setColumns] = useState<GridColumn[]>([]);

  useEffect(() => {
    setColumns(
      group.headings.map((heading) => ({
        title: heading.name,
        width: 100,
      }))
    );
  }, [group.headings]);

  const incomingCol = 20; // Column 2, index 1

  useEffect(() => {
    // Only select if the group matches
    if (group.name === selectedErrorGroup) {
      const rowIndex = tableRowErrorNumber - 1; // Convert to zero-based index

      // Check if the row index is within bounds
      if (rowIndex >= 0 && rowIndex < group.rows.length) {
        setSelection({
          current: {
            cell: [incomingCol, rowIndex], // Use the zero-based row index
            range: {
              x: incomingCol,
              y: rowIndex,
              width: 1,
              height: 1,
            },
            rangeStack: [],
          },
          columns: CompactSelection.empty(),
          rows: CompactSelection.empty(),
        });

        console.log(`Selected cell: [${incomingCol}, ${rowIndex}]`);
      }
    }
    console.log(tableRowErrorNumber, incomingCol)
    // Scroll to the selected cell
    document.querySelector("div[role='grid']")?.scrollTo({
      top: tableRowErrorNumber * 30, // Assuming each row is 30px high, adjust if needed
      left: incomingCol * 100, // Assuming each column is 100px wide, adjust if needed
      behavior: "smooth",
    });
  }, [group.name, incomingCol, tableRowErrorNumber, selectedErrorGroup]);

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

  return (
    <div className="w-full h-full">
      <DataGrid
        theme={customTheme}
        gridSelection={selection}
        onGridSelectionChange={setSelection}
        columns={columns}
        getCellContent={getData}
        rows={group.rows.length}
        rowMarkers="checkbox"
      />
    </div>
  );
};

export default GridView;





