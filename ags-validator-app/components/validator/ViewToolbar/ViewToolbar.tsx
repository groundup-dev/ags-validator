import { Button } from "@/components/ui/button";
import { deleteRows, applySetRowDataEffect, undo, redo } from "@/lib/redux/ags";
import { CompactSelection, GridSelection } from "@glideapps/glide-data-grid";
import { Redo, Trash2, Undo } from "lucide-react";
import SelectTable from "../SelectTable";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Card } from "@/components/ui/card";

interface Props {
  tabsViewValue: string;
  selectedRows: number[];
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
  selectedGroup: string;
  setSelection: (selection: GridSelection) => void;
}

export default function ViewToolbar({
  tabsViewValue,
  selectedRows,
  setSelectedGroup,
  selectedGroup,
  setSelection,
}: Props) {
  const dispatch = useAppDispatch();
  const parsedAgs = useAppSelector((state) => state.ags.parsedAgsNormalized);

  const canUndo = useAppSelector((state) => state.ags.past.length > 0);
  const canRedo = useAppSelector((state) => state.ags.future.length > 0);

  const handleUndo = () => {
    dispatch(undo());
    dispatch(applySetRowDataEffect());
  };

  const handleRedo = () => {
    dispatch(redo());
    dispatch(applySetRowDataEffect());
  };

  return (
    <div className="flex flex-row gap-4 align-middle items-center w-full">
      {tabsViewValue === "tables" && parsedAgs !== undefined && (
        <SelectTable
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          groups={Object.keys(parsedAgs)}
        />
      )}
      {tabsViewValue === "tables" && parsedAgs !== undefined && (
        <div className="flex  gap-2">
          <button onClick={handleUndo} disabled={!canUndo}>
            <Undo
              className={canUndo ? "w-8 h-8 p-1" : "w-8 h-8 p-1 opacity-50"}
            />
          </button>
          <button onClick={handleRedo} disabled={!canRedo}>
            <Redo
              className={canRedo ? "w-8 h-8 p-1" : "w-8 h-8 p-1 opacity-50"}
            />
          </button>
        </div>
      )}{" "}
      {tabsViewValue === "tables" &&
        parsedAgs !== undefined &&
        selectedRows.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setSelection({
                columns: CompactSelection.empty(),
                rows: CompactSelection.empty(),
                current: undefined,
              });
              dispatch(
                deleteRows({
                  group: selectedGroup,
                  rows: selectedRows,
                })
              );

              dispatch(applySetRowDataEffect());
            }}
          >
            <Trash2 className="w-4 h-6 mr-1" />
            {`Delete ${selectedRows.length} rows`}
          </Button>
        )}
    </div>
  );
}
