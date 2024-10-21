"use client";

import ErrorMessages from "./ErrorMessages";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import TextArea from "./TextArea";
import AGSUpload from "./AGSUpload";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import GridView from "./GridView";
import { AgsDictionaryVersion, AgsError } from "@groundup/ags";
import AutoComplete from "../ui/auto-complete";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { downloadFile } from "@/lib/utils";

import { useAppSelector } from "@/lib/redux/hooks";
import { GridSelection } from "@glideapps/glide-data-grid";
import ViewToolbar from "./ViewToolbar/ViewToolbar";

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

  const agsData = useAppSelector((state) => state.ags.rawData);

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

  return (
    <div className="flex justify-center w-full bg-muted rounded-t-xl border-border border shadow-inner">
      <div className="flex flex-col p-4 max-w-500 w-full">
        <Card className="mb-2 p-2">
          <CardTitle className="text-lg">AGS Options</CardTitle>
          <CardContent className="p-4 flex items-start sm:items-center gap-x-4 sm:flex-row flex-col">
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
              variant={"outline"}
              disabled={!agsData}
              onClick={() => downloadFile(agsData, "export.ags")}
            >
              <Download className="w-4 h-6 mr-1" /> Export
            </Button>
          </CardContent>
        </Card>

        <div className="flex gap-4 md:flex-row flex-col">
          <div className="w-full  h-[50vh] md:h-[calc(100vh-5rem)] ">
            <Tabs
              value={tabsViewValue}
              onValueChange={(value) => setTabsViewValue(value)}
              className="flex flex-col h-full"
            >
              <Card className="">
                <CardContent>
                  <ViewToolbar
                    tabsViewValue={tabsViewValue}
                    selectedRows={selectedRows}
                    setSelection={setSelection}
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                  />

                  <TabsContent value="text" className="min-h-0 grow">
                    <TextArea setGoToErrorCallback={setGoToErrorCallback} />
                  </TabsContent>

                  <TabsContent value="tables" className="min-h-0 grow">
                    <GridView
                      groupName={selectedGroup}
                      setGoToErrorCallback={setGoToErrorCallback}
                      setSelectedRows={setSelectedRows}
                      selection={selection}
                      setSelection={setSelection}
                    />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
          <Card className="w-full md:w-2/5 h-[50vh] md:h-[calc(100vh-5rem)]">
            <CardContent className="p-4 h-full">
              <ErrorMessages goToError={goToError} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
