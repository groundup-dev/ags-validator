import React from "react";
import Logo from "@/components/logo";

export default function Navbar() {
  return (
    <header className="sticky top-0 h-14 z-10 flex items-center border-b px-4 md:px-6 bg-background">
      <div className="max-w-400 w-full flex items-center gap-6 mx-auto">
        <Logo size="sm" />
        <h1>AGS4 Validator</h1>
      </div>
    </header>
  );
}
