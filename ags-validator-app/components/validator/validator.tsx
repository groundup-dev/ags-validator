"use client";

import { useValidator } from "./hooks/useValidator";
import ErrorTable from "./ErrorTable";
import React, { useState } from "react";
import TextArea from "./TextArea"; // Import TextArea to render in this component
import AGSUpload from "./AGSUpload"; // Import the AGSUpload component
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; // Import Tabs components
import { Label } from "../ui/label";
import GridView from "./GridView"; //

export default function Validator() {
  const { agsData, setAgsData, errors, parsedAgs } = useValidator();

  console.log("parsed", parsedAgs);

  const [lineNumber, setActiveLineNumber] = useState<number | undefined>(
    undefined
  );
  const [hoverLineNumber, setHoverLineNumber] = useState<number | null>(null);

  return (
    <div className="flex flex-col p-2 ">
      <div className="flex space-x-4 ">
        <div className="w-3/5">
          <Tabs defaultValue="text">
            <Card className="">
              <CardContent className="p-4 flex flex-row items-center gap-4">
                <AGSUpload setAgsData={setAgsData} />

                <div className="grid  items-center gap-1.5 mb-4">
                  <Label htmlFor="tabsList">View as</Label>
                  <TabsList id="tabsList">
                    <TabsTrigger value="text">Text </TabsTrigger>
                    <TabsTrigger
                      disabled={parsedAgs === undefined}
                      value="tables"
                    >
                      Tables{" "}
                    </TabsTrigger>
                  </TabsList>
                </div>
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
                  <GridView //@ts-ignore
                    group={parsedAgs?.["SAMP"]} //@ts-ignore
                  />
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
