"use client";

import React from "react";
import { Logo } from "@/components/logo";

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
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex justify-between w-full h-14 px-4 items-center container mx-auto">
        <Logo size="md" />
        <div className="hidden md:flex gap-2">
          <Popover>
            <Button asChild variant="ghost" size="sm">
              <PopoverTrigger>Contact</PopoverTrigger>
            </Button>
            <PopoverContent>
              <div className="flex flex-col">
                <p>We are always happy to chat.</p>
                <p>Feel free to reach out to us at</p>
                <Separator className="w-full my-3" />
                <p className="font-semibold">hello@groundup.cloud</p>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <Button asChild variant="ghost" size="sm">
              <DropdownMenuTrigger>Feedback</DropdownMenuTrigger>
            </Button>

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
        </div>

        <div className="flex items-center gap-4">
          <MobileNav />
          <div className="items-center gap-2 hidden md:flex">
            <Button asChild size="sm">
              <Link href="https://www.groundup.cloud">
                <ExternalLink className="w-4 h-4 mr-2" />
                GroundUp
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="https://github.com/groundup-dev/ags-validator">
                <FaGithub className="h-4 w-4 mr-2" />
                GitHub
              </Link>
            </Button>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
