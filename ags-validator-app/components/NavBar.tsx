"use client";

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
import { ExternalLink } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MobileNav } from "./mobile-nav";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 h-14 z-10 flex items-center border-b px-4 md:px-6 bg-background">
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <h1 className="text-lg font-semibold">AGS Editor</h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="https://www.groundup.cloud">
            <Button asChild size="sm">
              <div className="flex flex-row gap-2">
                <ExternalLink className="w-4 h-4" />
                GroundUp
              </div>
            </Button>
          </Link>

          <Popover>
            <PopoverTrigger className="text-sm ">Contact</PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col">
                <p>We are always happy to chat.</p>
                <p>Feel free to reach out to us at</p>
                <Separator className="w-full m-1.5" />
                <p className="font-semibold">hello@groundup.cloud</p>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger className="text-sm ">
              Feedback
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Feedback</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="https://github.com/groundup-dev/ags-validator/issues/new?assignees=&labels=bug&projects=&template=bug-report.md&title=%5BBUG%5D+Brief+description+of+the+bug"
                  target="_blank"
                  className="flex flex-row gap-1"
                >
                  Report an issue
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  target="_blank"
                  href="https://github.com/groundup-dev/ags-validator/issues/new?assignees=&labels=enhancement&projects=&template=enhancement.md&title=%5BENHANCEMENT%5D+Brief+description+of+the+enhancement"
                  className="flex flex-row gap-1"
                >
                  Suggest a change
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={"https://github.com/groundup-dev/ags-validator"}>
            <FaGithub className="h-5 w-5" />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <MobileNav />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
