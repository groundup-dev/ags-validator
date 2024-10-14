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
import { RegisterForm } from "@/components/RegisterForm/RegisterForm";
import Logo from "@/components/logo";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="overflow-hidden">
      {/* Description Section */}
      <div className="text-center my-12 mx-4">
        <div className="flex justify-center items-center mb-8 flex-wrap gap-x-4 gap-y-4">
          <div className="flex-0 sm:flex-1" />
          <h1 className="text-3xl font-bold">AGS Validator</h1>
          <div className="flex items-center gap-2 flex-0 sm:flex-1">
            <p className="text-lg">by</p>
            <Logo size="md" />
          </div>
        </div>
        <p className="text-lg mb-4">
          Validate, fix, and edit your AGS data with ease.
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

        <div className="flex flex-col justify-center items-center text-start mb-4 ">
          <Separator className="my-8 max-w-400" />
          <h2 className="text-xl mb-4">
            What is <strong>GroundUp</strong> ?
          </h2>
          <div className="flex flex-col items-center  max-w-prose">
            <p>
              GroundUp is an open source platform that makes geotechnical
              analysis and data management, easier, quicker, more transparent,
              and more collaborative.
            </p>
            <br />
            <p>
              We are currently working hard on building the public version of
              GroundUp, which will be available soon.
            </p>
            <br />
            <p>
              Register for early access to GroundUp and be the first to know
              when it&apos;s available.
              <br />.
            </p>
            <strong>
              GroundUp will always be open-source, and free to get started.
            </strong>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full w-36 shadow-md" variant="secondary">
              Register
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white p-6 rounded-lg  ">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold mb-2">
                Register
              </DialogTitle>
              <DialogDescription className="text-md text-foreground">
                Register for early access to GroundUp
              </DialogDescription>
            </DialogHeader>
            <RegisterForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative">
        <div
          className="absolute w-[130%] h-[130%] top-1/2 left-1/2 -z-10"
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
