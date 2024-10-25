import React from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckSquare,
  CornerLeftDown,
  CornerRightDown,
  DownloadCloud,
  Edit,
  HelpCircle,
  UploadCloudIcon,
} from "lucide-react";
import Validator from "@/components/validator";
import { RegisterForm } from "@/components/RegisterForm/RegisterForm";
import Logo from "@/components/logo";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="overflow-hidden px-4">
      <div className="flex flex-col lg:flex-row my-12 max-w-400 w-full mx-auto gap-12 px-8">
        <div className="w-full lg:w-1/2">
          <div className="flex my-8 flex-wrap gap-4 items-center">
            <h1 className="text-3xl font-bold flex-0">AGS Validator</h1>
            <div className="flex items-center gap-2 flex-0 sm:flex-1">
              <p className="text-lg">by</p>
              <Logo size="md" />
            </div>
          </div>
          <p className="text-lg mb-4">
            Validate, fix, and edit your AGS data with ease.
          </p>
          <p className="text-md mb-16">
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
                    can use this tool without worrying about any data privacy
                    and residency requirements.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>

          <div className="w-full flex mb-8">
            <div className="flex flex-col gap-8 max-w-2xl">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-grow flex flex-col lg:flex-row p-6 gap-4 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold">
                    <UploadCloudIcon className="h-6 w-6" />
                    Upload
                  </div>
                  <Separator className="lg:h-10 lg:w-px" />
                  <p>Upload or paste your AGS data using the tools below</p>
                </div>
                <CornerRightDown strokeWidth={1} className="h-8 w-8 shrink-0" />
              </div>

              <div className="flex items-center gap-4 w-full">
                <CornerLeftDown strokeWidth={1} className="h-8 w-8 shrink-0" />
                <div className="flex-grow flex flex-col lg:flex-row p-6 gap-4 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckSquare className="h-6 w-6" />
                    Validate
                  </div>
                  <Separator className="lg:h-10 lg:w-px" />
                  <p>
                    Validate your data against any AGS4 version, and inspect
                    issues
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="flex-grow flex flex-col lg:flex-row p-6 gap-4 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold">
                    <Edit className="h-6 w-6" />
                    Edit
                  </div>
                  <Separator className="lg:h-10 lg:w-px" />
                  <p>Edit your data in tables or text views</p>
                </div>
                <CornerRightDown strokeWidth={1} className="h-8 w-8 shrink-0" />
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="h-8 w-8 shrink-0" />
                <div className="flex-grow flex flex-col lg:flex-row p-6 gap-4 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold">
                    <DownloadCloud className="h-6 w-6" />
                    Export
                  </div>
                  <Separator className="lg:h-10 lg:w-px" />
                  <p> Export your data as AGS4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div>
            <Card className="flex flex-col items-center max-w-xl">
              <CardTitle className="font-bold text-lg bg-muted w-full flex p-3 justify-center items-center rounded-t-md border-b">
                New to GroundUp?
              </CardTitle>
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-6">
                  <h4 className="w-full align-middle text-lg font-bold ">
                    About us
                  </h4>
                  <p>
                    GroundUp is an open source platform that makes geotechnical
                    analysis and data management, easier, quicker, more
                    transparent, and more collaborative.
                  </p>
                  <p>
                    We are currently working hard on building the public version
                    of GroundUp, which will be available soon.
                  </p>
                  <p>
                    GroundUp will always be open-source, and free to get
                    started.
                  </p>
                </div>
                <Separator />
                <div className="flex flex-col gap-4 p-6">
                  <h4 className="w-full align-middle text-lg font-bold">
                    Register for early access
                  </h4>
                  <p>
                    Register for early access to GroundUp and be the first to
                    know when it&apos;s available.
                  </p>
                  <RegisterForm />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative">
        <div
          className="absolute w-[120%] h-[120%] top-1/2 left-1/2 -z-10"
          style={{
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(var(--primary) 0%, transparent 70%)",
          }}
        />
        <Validator />
      </div>
    </div>
  );
}
