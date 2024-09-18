import { AgsError } from "ags/src/models";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; // Assuming Button component is used

interface ErrorTableProps {
  errors: AgsError[];
  setActiveLineNumber: (lineNumber: number) => void;
  setHoverLineNumber: (hoverLineNumber: number | null) => void;
}

export default function ErrorTable({ errors, setActiveLineNumber, setHoverLineNumber }: ErrorTableProps) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  return (
    <>
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
                  setHoverLineNumber(error.lineNumber); // Update hover line number on mouse enter
                }}
                onMouseLeave={() => {
                  setHoveredRowIndex(null);
                  setHoverLineNumber(null); // Reset hover line number on mouse leave
                }}
              >
                <TableCell className="font-medium">
                  {error.lineNumber}
                </TableCell>
                <TableCell>{error.rule}</TableCell>
                <TableCell>{error.message}</TableCell>
                <TableCell>
                  {/* Button visibility controlled by row hover */}
                  <Button
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
        "No errors found"
      )}
    </>
  );
}
