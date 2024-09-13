// ErrorDisplay.tsx
import { AgsError } from "ags/src/models";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ErrorTableProps {
  errors: AgsError[];
}

export default function ErrorTable({ errors }: ErrorTableProps) {
  return (
    <>
      {errors.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Line</TableHead>
              <TableHead>Rule</TableHead>
              <TableHead>Error</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {errors.map((errors, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {errors.lineNumber}
                </TableCell>
                <TableCell>{errors.rule}</TableCell>
                <TableCell>{errors.message}</TableCell>
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
