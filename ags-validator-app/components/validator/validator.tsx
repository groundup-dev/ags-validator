"use client";

import { useValidator } from "./hooks/useValidator";
import ErrorMessages from "./ErrorMessages";
import React, { useCallback, useEffect, useState } from "react";
import TextArea from "./TextArea";
import AGSUpload from "./AGSUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import GridView from "./GridView";
import SelectTable from "./SelectTable";
import { AgsError } from "@groundup/ags";

export default function Validator() {
  const { agsData, setAgsData, errors, parsedAgs, setGroup } = useValidator();

  const [tabsViewValue, setTabsViewValue] = useState("text");

  const [hoverLineNumber, setHoverLineNumber] = useState<number | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<string>("");

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
    <div className="flex justify-center w-full bg-muted rounded-t-xl border-border border shadow-inner">
      <div className="flex flex-col p-4 max-w-500 w-full">
        <div className="flex gap-4 md:flex-row flex-col">
          <div className="w-full md:w-3/5 h-[calc(100vh-6rem)]">
            <Tabs
              value={tabsViewValue}
              onValueChange={(value) => setTabsViewValue(value)}
              className="flex flex-col h-full"
            >
              <Card className="mb-2">
                <CardContent className="p-4 flex items-start sm:items-center gap-x-4 sm:flex-row flex-col">
                  <AGSUpload setAgsData={setAgsData} />

                  <div className="grid items-center gap-1.5 mb-4">
                    <Label htmlFor="tabsList">View as</Label>
                    <TabsList id="tabsList">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger
                        disabled={parsedAgs === undefined}
                        value="tables"
                      >
                        Tables
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  {tabsViewValue === "tables" && parsedAgs !== undefined && (
                    <SelectTable
                      parsedAgs={parsedAgs}
                      selectedGroup={selectedGroup}
                      setSelectedGroup={setSelectedGroup}
                    />
                  )}
                </CardContent>
              </Card>

              <TabsContent value="text" className="min-h-0 grow">
                <Card className="h-full">
                  <CardContent className="p-4 h-full">
                    <TextArea
                      agsData={agsData}
                      setAgsData={setAgsData}
                      errors={errors}
                      hoverLineNumber={hoverLineNumber}
                      setGoToErrorCallback={setGoToErrorCallback}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tables" className="min-h-0 grow">
                <Card className="h-full">
                  <CardContent className="p-4 h-full">
                    {parsedAgs?.[selectedGroup] && (
                      <GridView
                        group={parsedAgs?.[selectedGroup]}
                        setGroup={setGroup}
                        errors={errors}
                        setGoToErrorCallback={setGoToErrorCallback}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          <Card className="w-full md:w-2/5 h-[50vh] md:h-[calc(100vh-6rem)]">
            <CardContent className="p-4 h-full">
              <ErrorMessages
                errors={errors}
                setHoverLineNumber={setHoverLineNumber}
                goToError={goToError}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
