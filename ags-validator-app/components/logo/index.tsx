import Image from "next/image";
import groundUpLogo from "./groundUpLogo.svg";
import { cn } from "@/lib/utils";

const sizeClassNames = {
  sm: { logo: "h-8", text: "text-md" },
  md: { logo: "h-10", text: "text-lg" },
  lg: { logo: "h-12", text: "text-xl" },
};

interface Props {
  size: keyof typeof sizeClassNames;
}

export default function Logo({ size }: Props) {
  return (
    <div className="flex items-center gap-1">
      <Image
        src={groundUpLogo}
        className={cn("w-auto", sizeClassNames[size].logo)}
        alt="GroundUp logo"
      />
      <p className={cn("font-semibold", sizeClassNames[size].text)}>GroundUp</p>
    </div>
  );
}
