"use client";

import ErrorMessages from "./ErrorMessages";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import TextArea from "./TextArea";
import AGSUpload from "./AGSUpload";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BsFileEarmarkText, BsTable } from "react-icons/bs";
import GridView from "./GridView";
import SelectTable from "./SelectTable";
import { AgsDictionaryVersion, AgsError } from "@groundup/ags";
import AutoComplete from "../ui/auto-complete";
import { Button } from "../ui/button";
import { Download, Trash2 } from "lucide-react";
import { downloadFile } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { applySetRowDataEffect, deleteRows } from "@/lib/redux/ags";
import { CompactSelection, GridSelection } from "@glideapps/glide-data-grid";

const agsDictOptions = [
  { value: "v4_0_3", label: "4.0.3" },
  { value: "v4_0_4", label: "4.0.4" },
  { value: "v4_1", label: "4.1" },
  { value: "v4_1_1", label: "4.1.1" },
];

export default function Validator() {
  const [agsDictVersion, setAgsDictVersion] =
    useState<AgsDictionaryVersion>("v4_0_4");

  const [tabsViewValue, setTabsViewValue] = useState("text");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  const [selection, setSelection] = useState<GridSelection | undefined>(
    undefined
  );

  const parsedAgs = useAppSelector((state) => state.ags.parsedAgsNormalized);
  const agsData = useAppSelector((state) => state.ags.rawData);

  const dispatch = useAppDispatch();

  const [goToErrorCallback, setGoToErrorCallback] = useState<
    (error: AgsError) => void
  >(() => {});

  const goToError = useCallback(
    (error: AgsError) => {
      if (error.group) {
        setSelectedGroup(error.group);
      }

      goToErrorCallback(error);
    },
    [setSelectedGroup, goToErrorCallback]
  );

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
    <div className="flex justify-center w-full bg-muted rounded-t-xl border shadow-inner">
      <div className="flex flex-col p-4 max-w-500 w-full gap-4">
        <Card className="p-4">
          <CardTitle className="text-lg">AGS Options</CardTitle>
          <CardContent className="flex items-start sm:items-end gap-4 py-4 px-0 sm:flex-row flex-col">
            <AGSUpload />
            <AutoComplete
              options={agsDictOptions}
              selectedOption={agsDictVersion}
              setSelectedOption={
                setAgsDictVersion as Dispatch<SetStateAction<string>>
              }
              label="Select AGS Version"
              placeholder="Select AGS Version"
            />
            <Button
              variant="outline"
              disabled={!agsData}
              onClick={() => downloadFile(agsData, "export.ags")}
            >
              <Download className="w-4 h-6 mr-2" />
              Export
            </Button>
          </CardContent>
        </Card>
        <div className="flex gap-4 md:flex-row flex-col">
          <Card className="w-full md:w-3/5 h-[calc(100vh-5.5rem)]">
            <Tabs
              value={tabsViewValue}
              onValueChange={(value) => setTabsViewValue(value)}
              className="flex flex-col h-full"
            >
              <div className="mb-2 p-4 pb-0 flex items-start sm:items-center gap-x-4 sm:flex-row flex-col border-b">
                <TabsList
                  id="tabsList"
                  className="border bg-transparent p-0 rounded-b-none border-b-0"
                >
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-accent h-full rounded-l-md rounded-r-none w-24 border-r hover:bg-accent"
                  >
                    <BsFileEarmarkText className="mr-2 h-4 w-4" />
                    Text
                  </TabsTrigger>
                  <TabsTrigger
                    disabled={parsedAgs === undefined}
                    value="tables"
                    className="data-[state=active]:bg-accent h-full rounded-r-md rounded-l-none w-24 hover:bg-accent"
                  >
                    <BsTable className="mr-2 h-4 w-4" />
                    Tables
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="text" className="min-h-0 grow">
                <div className="p-4 pt-0 h-full">
                  <TextArea setGoToErrorCallback={setGoToErrorCallback} />
                </div>
              </TabsContent>

              <TabsContent value="tables" className="min-h-0 grow">
                <div className="p-4 pt-0 h-full flex flex-col gap-4">
                  {parsedAgs !== undefined && (
                    <div className="flex gap-4 items-end flex-wrap">
                      <SelectTable
                        selectedGroup={selectedGroup}
                        setSelectedGroup={setSelectedGroup}
                        groups={Object.keys(parsedAgs)}
                      />
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
                          <Trash2 className="w-4 h-6 mr-2" />
                          {`Delete ${selectedRows.length} rows`}
                        </Button>
                      )}
                    </div>
                  )}
                  <GridView
                    groupName={selectedGroup}
                    setGoToErrorCallback={setGoToErrorCallback}
                    setSelectedRows={setSelectedRows}
                    selection={selection}
                    setSelection={setSelection}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </Card>
          <Card className="w-full md:w-2/5 h-[50vh] md:h-[calc(100vh-5.5rem)]">
            <CardContent className="h-full p-0">
              <ErrorMessages goToError={goToError} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
