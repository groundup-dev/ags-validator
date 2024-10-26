import { Button } from "@/components/ui/button";
import { deleteRows, applySetRowDataEffect, undo, redo } from "@/lib/redux/ags";
import { CompactSelection, GridSelection } from "@glideapps/glide-data-grid";
import { Trash2 } from "lucide-react";
import { FaRedo, FaUndo } from "react-icons/fa";
import SelectTable from "../SelectTable";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

interface Props {
  selectedRows: number[];
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
  selectedGroup: string;
  setSelection: (selection: GridSelection) => void;
}

export default function ViewToolbar({
  selectedRows,
  setSelectedGroup,
  selectedGroup,
  setSelection,
}: Props) {
  const dispatch = useAppDispatch();
  const parsedAgs = useAppSelector((state) => state.ags.parsedAgsNormalized);

  const canUndo = useAppSelector((state) => state.ags.past.length > 0);
  const canRedo = useAppSelector((state) => state.ags.future.length > 0);

  if (parsedAgs === undefined) return null;

  const handleUndo = () => {
    dispatch(undo());
    dispatch(applySetRowDataEffect());
  };

  const handleRedo = () => {
    dispatch(redo());
    dispatch(applySetRowDataEffect());
  };

  return (
    <div className="flex gap-4 items-end flex-wrap">
      <SelectTable
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        groups={Object.keys(parsedAgs)}
      />
      <div className="flex gap-1">
        <Button
          variant="outline"
          className="w-10 p-0"
          onClick={handleUndo}
          disabled={!canUndo}
        >
          <FaUndo className="w-5 h-5 p-1" />
        </Button>
        <Button
          variant="outline"
          className="w-10 p-0"
          onClick={handleRedo}
          disabled={!canRedo}
        >
          <FaRedo className="w-5 h-5 p-1" />
        </Button>
      </div>
      {selectedRows.length > 0 && (
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
