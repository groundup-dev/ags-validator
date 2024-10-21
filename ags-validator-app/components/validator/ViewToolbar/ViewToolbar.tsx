import { Button } from "@/components/ui/button";
import { deleteRows, applySetRowDataEffect } from "@/lib/redux/ags";
import { CompactSelection, GridSelection } from "@glideapps/glide-data-grid";

import { Trash2 } from "lucide-react";
import SelectTable from "../SelectTable";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  tabsViewValue: string;
  selectedRows: number[];
  setSelection: React.Dispatch<React.SetStateAction<GridSelection | undefined>>;
  selectedGroup: string;
  setSelectedGroup: React.Dispatch<React.SetStateAction<string>>;
};

export default function ViewToolbar({
  tabsViewValue,
  selectedRows,
  setSelection,
  selectedGroup,
  setSelectedGroup,
}: Props) {
  const dispatch = useAppDispatch();

  const parsedAgs = useAppSelector((state) => state.ags.parsedAgsNormalized);

  // we need to populate the selectedGroup state when tables view is selected the first time
  useEffect(() => {
    if (parsedAgs && !selectedGroup && Object.keys(parsedAgs).length > 0) {
      const firstKey = Object.keys(parsedAgs)[0];

      if (firstKey) {
        setSelectedGroup(firstKey);
      }
    }
  }, [parsedAgs, selectedGroup, setSelectedGroup]);

  return (
    <div>
      <div className="grid items-center gap-1.5 mb-4">
        <TabsList id="tabsList">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger disabled={parsedAgs === undefined} value="tables">
            Tables
          </TabsTrigger>
        </TabsList>
      </div>
      {tabsViewValue === "tables" && parsedAgs !== undefined && (
        <SelectTable
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          groups={Object.keys(parsedAgs)}
        />
      )}
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
