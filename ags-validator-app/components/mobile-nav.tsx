"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import { Separator } from "./ui/separator";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          aria-label="Open navigation"
          variant="ghost"
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-sm text-muted-foreground">
              Visit our website to learn more about GroundUp.
            </p>
            <Link href="https://www.groundup.cloud">
              <Button asChild size="sm">
                <div className="flex flex-row gap-2">
                  <ExternalLink className="w-4 h-4" />
                  GroundUp
                </div>
              </Button>
            </Link>
          </div>
          <Separator className="my-2" />

          <div className="px-2 py-1">
            <h3 className="font-medium mb-2">Contact</h3>
            <p className="text-sm text-muted-foreground">
              We are always happy to chat.
            </p>
            <p className="text-sm text-muted-foreground">
              Feel free to reach out to us at
            </p>
            <p className="font-semibold mt-1">hello@groundup.cloud</p>
          </div>

          <Separator className="my-2" />

          <div className="px-2 py-1">
            <h3 className="font-medium mb-2">Feedback</h3>
            <div className="flex flex-col gap-2">
              <Link
                href="https://github.com/groundup-dev/ags-validator/issues/new?assignees=&labels=bug&projects=&template=bug-report.md&title=%5BBUG%5D+Brief+description+of+the+bug"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                Report an issue
                <ExternalLink className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com/groundup-dev/ags-validator/issues/new?assignees=&labels=enhancement&projects=&template=enhancement.md&title=%5BENHANCEMENT%5D+Brief+description+of+the+enhancement"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
              >
                Suggest a change
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <Separator className="my-2" />

          <Button asChild variant="outline" size="sm">
            <Link
              href="https://github.com/groundup-dev/ags-validator"
              onClick={() => setOpen(false)}
              className="flex flex-row items-center gap-2"
            >
              <FaGithub className="h-5 w-5" />
              Get the code
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
