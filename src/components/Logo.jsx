import Image from "next/image";
import { cn } from "@/lib/utils";

export default function Logo({ size = 28, className }) {
  return (
    <Image
      src="/logo.png"
      alt="Arab Developers logo"
      width={size}
      height={size}
      className={cn("rounded-lg object-contain", className)}
      priority
    />
  );
}
