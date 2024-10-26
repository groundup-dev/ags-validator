import React from "react";
import Logo from "@/components/logo";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

export default function Navbar() {
  return (
    <header className="sticky top-0 h-14 z-10 flex items-center border-b px-4 md:px-6 bg-background">
      <div className=" flex flex-row justify-between w-full ">
        <div className="max-w-400 w-full flex items-center gap-6 mx-auto">
          <Logo size="sm" />
          <h1>AGS Validator</h1>
        </div>

        <div className="items-center flex gap-2">
          <Popover>
            <PopoverTrigger className="text-sm hidden sm:block">
              Contact
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col">
                <p>We are always happy to chat.</p>
                <p>Feel free to reach out to us at:</p>
                <Separator className="w-full m-1.5" />
                <p className="font-bold">james@groundup.cloud</p>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger className=" hidden sm:block border rounded-md text-sm p-2 hover:bg-accent hover:text-accent-foreground">
              Feedback
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Feedback</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="https://github.com/groundup-dev/ags-validator/issues/new?assignees=&labels=bug&projects=&template=bug-report.md&title=%5BBUG%5D+Brief+description+of+the+bug"
                  target="_blank"
                >
                  Report an issue
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  target="_blank"
                  href="https://github.com/groundup-dev/ags-validator/issues/new?assignees=&labels=enhancement&projects=&template=enhancement.md&title=%5BENHANCEMENT%5D+Brief+description+of+the+enhancement"
                >
                  Suggest a change
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={"https://github.com/groundup-dev/ags-validator"}>
            <FaGithub className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
