import React from "react";

export default function Navbar() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-1 border-b px-4 md:px-6 bg-foreground">
      <h1 className="text-3xl bold text-primary-foreground mr-2">
        AGS4 Validator
      </h1>
      <h2 className="text-xl text-secondary">by GroundUp</h2>
    </header>
  );
}
