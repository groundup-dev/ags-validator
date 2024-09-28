import { AgsError } from "@groundup/ags";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ErrorTableProps {
  errors: AgsError[];
  setActiveLineNumber: (lineNumber: number) => void;
  setHoverLineNumber: (hoverLineNumber: number | null) => void;
}

export default function ErrorTable({
  errors,
  setActiveLineNumber,
  setHoverLineNumber,
}: ErrorTableProps) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Errors</h2>
      <div className="overflow-auto max-h-[calc(100vh-200px)]">
        {errors.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Line</TableHead>
                <TableHead>Rule</TableHead>
                <TableHead>Error</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {errors.map((error, index) => (
                <TableRow
                  key={index}
                  onMouseEnter={() => {
                    setHoveredRowIndex(index);
                    setHoverLineNumber(error.lineNumber);
                  }}
                  onMouseLeave={() => {
                    setHoveredRowIndex(null);
                    setHoverLineNumber(null);
                  }}
                >
                  <TableCell className="font-medium">
                    {error.lineNumber}
                  </TableCell>
                  <TableCell>{error.rule}</TableCell>
                  <TableCell>{error.message}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className={`transition-opacity duration-200 ${
                        hoveredRowIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={() => setActiveLineNumber(error.lineNumber)}
                    >
                      Go to
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground">No errors found</p>
        )}
      </div>
    </div>
  );
}
