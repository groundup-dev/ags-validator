"use client";

import { useValidator } from "./hooks/useValidator";
import ErrorTable from "./ErrorTable";
import React, { useEffect, useState } from "react";
import TextArea from "./TextArea";
import AGSUpload from "./AGSUpload";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "../ui/label";
import GridView from "./GridView";
import SelectTable from "./SelectTable";

export default function Validator() {
  const { agsData, setAgsData, errors, parsedAgs, setGroup } = useValidator();

  const [tabsViewValue, setTabsViewValue] = useState("text");

  const [lineNumber, setActiveLineNumber] = useState<number | undefined>(
    undefined
  );
  const [hoverLineNumber, setHoverLineNumber] = useState<number | null>(null);

  const [selectedGroup, setSelectedGroup] = useState<string>("");

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
    <div className="flex flex-col p-2 ">
      <div className="flex space-x-4 ">
        <div className="w-3/5">
          <Tabs
            value={tabsViewValue}
            onValueChange={(value) => setTabsViewValue(value)}
          >
            <Card className="">
              <CardContent className="p-4 flex flex-row items-center gap-4">
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

            <TabsContent value="text">
              <Card>
                <CardContent className="p-4">
                  <TextArea
                    agsData={agsData}
                    setAgsData={setAgsData}
                    errors={errors}
                    activeLineNumber={lineNumber}
                    hoverLineNumber={hoverLineNumber}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tables">
              <Card>
                <CardContent className="p-4">
                  {parsedAgs?.[selectedGroup] && (
                    <GridView
                      group={parsedAgs?.[selectedGroup]}
                      setGroup={setGroup}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Card className="w-2/5">
          <CardContent className="p-4">
            <ErrorTable
              errors={errors}
              setActiveLineNumber={setActiveLineNumber}
              setHoverLineNumber={setHoverLineNumber}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
