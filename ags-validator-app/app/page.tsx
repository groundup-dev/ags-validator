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
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Page() {
  return (
    <div className="overflow-hidden px-4">
      <div className="flex flex-col lg:flex-row my-12 max-w-400 w-full mx-auto gap-12 px-2 lg:px-8">
        <div className="w-full lg:w-1/2">
          <div className="flex my-8 flex-wrap gap-4 items-center justify-center">
            <h1 className="text-3xl font-bold flex-0">AGS Validator</h1>
            <div className="flex items-center gap-2 flex-0 lg:flex-1">
              <p className="text-lg">by</p>
              <Logo size="md" />
            </div>
          </div>
          <p className="text-lg mb-4 text-center lg:text-start">
            Validate, fix, and edit your AGS data with ease.
          </p>
          <p className="text-md mb-16 text-center lg:text-start">
            All your AGS data stays on your device and
            <span className="font-medium"> never leaves your browser</span>.
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

          <div className="flex mb-8 justify-center lg:justify-start">
            <div className="flex flex-col gap-8 w-full max-w-2xl">
              <div className="flex items-center gap-4 w-full">
                <div className="flex-grow flex flex-col lg:flex-row min-h-24 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold border-b lg:border-b-0 lg:border-r h-full p-6">
                    <UploadCloudIcon className="h-6 w-6" />
                    Upload
                  </div>
                  <p className="p-6">
                    Upload or paste your AGS data using the tools below
                  </p>
                </div>
                <CornerRightDown
                  strokeWidth={1}
                  className="h-8 w-8 shrink-[0.25]"
                />
              </div>

              <div className="flex items-center gap-4 w-full">
                <CornerLeftDown
                  strokeWidth={1}
                  className="h-8 w-8 shrink-[0.25]"
                />
                <div className="flex-grow flex flex-col lg:flex-row min-h-24 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold border-b lg:border-b-0 lg:border-r h-full p-6">
                    <CheckSquare className="h-6 w-6" />
                    Validate
                  </div>
                  <p className="p-6">
                    Validate your data against any AGS4 version, and inspect
                    issues
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="flex-grow flex flex-col lg:flex-row min-h-24 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold border-b lg:border-b-0 lg:border-r h-full p-6">
                    <Edit className="h-6 w-6" />
                    Edit
                  </div>
                  <p className="p-6">Edit your data in tables or text views</p>
                </div>
                <CornerRightDown
                  strokeWidth={1}
                  className="h-8 w-8 shrink-[0.25]"
                />
              </div>

              <div className="flex items-center gap-4 w-full">
                <div className="h-8 w-8 shrink-[0.25]" />
                <div className="flex-grow flex flex-col lg:flex-row min-h-24 lg:items-center border rounded-lg h-full bg-accent hover:scale-101 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 font-bold border-b lg:border-b-0 lg:border-r h-full p-6">
                    <DownloadCloud className="h-6 w-6" />
                    Export
                  </div>
                  <p className="p-6"> Export your data as AGS4</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div>
            <div className="flex mb-8 flex-col gap-4 p-4 bg-muted rounded-xl border shadow-inner max-w-2xl">
              <h2 className="font-bold text-lg w-full text-center">
                New to GroundUp?
              </h2>
              <Card className="flex flex-col items-center">
                <h4 className="p-4 text-lg w-full font-semibold border-b">
                  About us
                </h4>
                <div className="flex flex-col gap-4 p-4">
                  <p>
                    GroundUp is an open source platform that makes geotechnical
                    analysis and data management, easier, quicker, more
                    transparent, and more collaborative.
                  </p>
                  <p>
                    We are currently working hard on building the public version
                    of GroundUp, which will be available soon.
                  </p>
                  <span className="font-medium">
                    GroundUp will always be open-source, and free to get
                    started.
                  </span>
                </div>
              </Card>
              <Card className="flex flex-col items-center">
                <h4 className="p-4 text-lg w-full font-semibold border-b">
                  Register for early access
                </h4>
                <div className="flex flex-col gap-4 p-4">
                  <p>
                    Register for early access to GroundUp and be the first to
                    know when it&apos;s available.
                  </p>
                  <RegisterForm />
                  <div className="flex justify-end">
                    <Link className="text-xs" href="/privacy">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
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
