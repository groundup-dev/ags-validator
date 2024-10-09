import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import Validator from "@/components/validator";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

export default function Page() {
  return (
    <div className="overflow-hidden">
      {/* Description Section */}
      <div className="text-center my-12 mx-4">
        <div className="flex justify-center items-center mb-8 flex-wrap gap-x-4 gap-y-4">
          <div className="flex-0 sm:flex-1" />
          <h1 className="text-3xl font-bold">AGS4 Validator</h1>
          <div className="flex items-center gap-2 flex-0 sm:flex-1">
            <p className="text-lg">by</p>
            <Logo size="md" />
          </div>
        </div>
        <p className="text-lg mb-4">
          Validate, fix, and edit your AGS4 data with ease.
        </p>
        <p className="text-md mb-10">
          All your AGS data stays on your device and
          <strong> never leaves your browser</strong>.
          <Dialog>
            <DialogTrigger asChild>
              <span className="ml-2 cursor-pointer">
                <HelpCircle className="h-5 w-5 text-primary inline" />
              </span>
            </DialogTrigger>
            <DialogContent className="p-6 rounded-lg max-w-md mx-auto shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold mb-2">
                  Data Privacy
                </DialogTitle>
                <DialogDescription className="text-md">
                  Your AGS files are processed entirely within your browser.
                  This means that your data never leaves your device, and you
                  can use this tool without worrying about any data privacy and
                  residency requirements.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </p>
        <Button className="rounded-full w-36 shadow-md" variant="secondary">
          Register now
        </Button>
      </div>
      <div className="relative">
        <div
          className="absolute w-[125%] h-[115%] top-1/2 left-1/2 -z-10"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(var(--primary) 0%, transparent 70%)",
          }}
        />
        <div className="px-4">
          <Validator />
        </div>
      </div>
    </div>
  );
}
