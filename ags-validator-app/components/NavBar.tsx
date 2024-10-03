import React from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 h-14 z-10 flex items-center border-b px-4 md:px-6 bg-foreground">
      <div className="max-w-400 w-full flex items-center gap-1 mx-auto">
        <h1 className="text-lg sm:text-2xl bold text-primary-foreground mr-2">
          AGS4 Validator
        </h1>
        <h2 className="sm:text-lg text-sm text-secondary">by GroundUp</h2>
      </div>
    </header>
  );
}
