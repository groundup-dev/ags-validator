import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react"; // Import the HelpCircle icon from shadcn
import Validator from "@/components/validator";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div>
      {/* Description Section */}
      <div className="text-center bg-background">
        <div className="flex justify-center items-center mb-1">
          <h1 className="text-4xl font-bold text-primary mr-2">
            AGS4 Validator
          </h1>
          <h2 className="text-2xl text-secondary">by GroundUp</h2>
        </div>

        <p className="text-lg text-foreground max-w-2xl mx-auto mb-2">
          Validate, fix, and edit your AGS4 data with ease.
        </p>

        <p className="text-md text-foreground max-w-4xl mx-auto flex items-center justify-center">
          All your AGS data stays on your device and
          <strong className="pl-1">never leaves your browser</strong>.
          <Dialog>
            <DialogTrigger asChild>
              <span className="ml-2 cursor-pointer">
                <HelpCircle className="h-5 w-5 text-primary inline" />
              </span>
            </DialogTrigger>
            <DialogContent className="bg-white p-6 rounded-lg max-w-md mx-auto shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-2">
                  Data Privacy
                </DialogTitle>
                <DialogDescription className="text-md text-muted">
                  Your AGS files are processed entirely within your browser.
                  This means that your data never leaves your device, and you
                  can use this tool without worrying about any data privacy and
                  residency requirements.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </p>
      </div>

      <Separator className="my-1 w-full" />

      <Validator />
    </div>
  );
}
