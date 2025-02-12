import { cn } from "@/lib/utils";
import Image from "next/image";
import groundUpLogo from "./groundUpLogo.svg";

const sizeClassNames = {
  sm: { logo: "h-8", text: "text-md" },
  md: { logo: "h-10", text: "text-lg" },
  lg: { logo: "h-12", text: "text-xl" },
};

interface Props {
  size: keyof typeof sizeClassNames;
  showText?: boolean;
}

export function Logo({ size, showText = true }: Props) {
  const heights = {
    sm: 32, // h-8
    md: 40, // h-10
    lg: 48, // h-12
  };

  return (
    <div className="flex items-center gap-1">
      <Image
        src={groundUpLogo}
        width={heights[size]}
        height={heights[size]}
        className={cn("w-auto", sizeClassNames[size].logo)}
        alt="GroundUp logo"
      />
      {showText && (
        <p className={cn("font-semibold", sizeClassNames[size].text)}>
          GroundUp
        </p>
      )}
    </div>
  );
}
