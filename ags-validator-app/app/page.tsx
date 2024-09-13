import { UserNavbar } from "@/components/NavBar";
import Validator from "@/components/validator/validator";
import React from "react";

export default function Page() {
  return (
    <div>
      <UserNavbar />
      <Validator />
    </div>
  );
}
