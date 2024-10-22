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
  ArrowDownRight,
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
    <div className="overflow-hidden">
      <div className="flex flex-row my-12 mx-4">
        <div className="text-left mx-4 w-1/2">
          <div className="flex text-left mb-8 flex-wrap gap-x-4 gap-y-4 items-center">
            <div />
            <h1 className="text-3xl font-bold flex-0">AGS Validator</h1>
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
                    can use this tool without worrying about any data privacy
                    and residency requirements.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </p>

          <div className="flex flex-col gap-12">
            <div className="flex flex-row gap-6 items-center">
              <Card className="flex flex-row w-2/3">
                <CardTitle className="text-lg bg-muted w-40 rounded-l-md">
                  <div className="flex items-center gap-2 m-6">
                    <UploadCloudIcon className="h-6 w-6" />
                    Upload
                  </div>
                </CardTitle>
                <CardContent className="items-center m-2">
                  Upload or paste your AGS data using the tools below
                </CardContent>
              </Card>

              <CornerRightDown
                strokeWidth={1}
                className="h-16 w-16 text-border"
              />
            </div>
            <div className="flex flex-row gap-6 self-end items-center">
              <CornerLeftDown
                strokeWidth={1}
                className="h-16 w-16 text-border"
              />
              <Card className="flex flex-row-reverse w-2/3 min-w-96 self-end">
                <CardTitle className="text-lg bg-muted w-40 rounded-r-md">
                  <div className="flex items-center gap-2 m-6">
                    <CheckSquare className="h-6 w-6" />
                    Validate
                  </div>
                </CardTitle>
                <CardContent className="items-center m-2">
                  Validate your data against any AGS4 version, and inspect
                  issues.
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-row gap-6 items-center">
              <Card className="flex flex-row w-2/3 min-w-96">
                <CardTitle className="text-lg bg-muted w-40 rounded-l-md">
                  <div className="flex items-center gap-2 m-6">
                    <Edit className="h-6 w-6" />
                    Edit
                  </div>
                </CardTitle>
                <CardContent className="m-2 text-center ">
                  Edit your data in tables or text views
                </CardContent>
              </Card>

              <CornerRightDown
                strokeWidth={1}
                className="h-16 w-16 text-border"
              />
            </div>

            <Card className="flex flex-row-reverse w-2/3 min-w-96 self-end">
              <CardTitle className="text-lg bg-muted w-40 rounded-r-md">
                <div className="flex items-center gap-2 m-6">
                  <DownloadCloud className="h-6 w-6" />
                  Export
                </div>
              </CardTitle>
              <CardContent className="m-2 text-center ">
                Export your data as AGS4
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="flex flex-col justify-center items-center text-start mb-4 w-1/2 ">
          <CardTitle className="text-lg bg-muted w-full flex justify-center p-3 rounded-t-md border-b">
            New to GroundUp?
          </CardTitle>
          <CardContent className="p-2 my-8">
            <div className="flex flex-col items-left  max-w-prose">
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
              </p>
              <br />
              <strong>
                GroundUp will always be open-source, and free to get started.
              </strong>
            </div>
            <Separator className="my-4" />

            <RegisterForm />
          </CardContent>
        </Card>
      </div>
      <div className="relative">
        <div
          className="absolute w-[120%] h-[120%] top-1/2 left-1/2 -z-10"
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
