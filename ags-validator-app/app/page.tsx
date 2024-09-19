import { UserNavbar } from "@/components/NavBar";
import Validator from "@/components/Validator/Validator";
import React from "react";

export default function Page() {
  return (
    <div>
      <UserNavbar />
      <Validator />
    </div>
  );
}
