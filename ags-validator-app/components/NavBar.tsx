import React from "react";
import Logo from "@/components/logo";

import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 h-14 z-10 flex items-center border-b px-4 md:px-6 bg-background">
      <div className=" flex flex-row justify-between w-full ">
        <div className="max-w-400 w-full flex items-center gap-6 mx-auto">
          <Logo size="sm" />
          <h1>AGS Validator</h1>
        </div>

        <div className="items-center flex">
          <Link href={"https://github.com/groundup-dev/ags-validator"}>
            <FaGithub className="h-6 w-6" />
          </Link>
        </div>
      </div>

      {/* link to github repo */}
    </header>
  );
}
