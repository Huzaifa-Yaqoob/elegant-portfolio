import * as LucideIcons from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";

type LucideIconProps = {
  name: string;
  size?: number | string;
  class?: string;
  className?: string;
};

export default function LucideIcon({
  name,
  size = 24,
  class: classProp,
  className,
}: LucideIconProps) {
  const iconComponentName = name
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const iconMap = LucideIcons as unknown as Record<string, LucideIcon>;
  const Icon = iconMap[iconComponentName];

  if (!Icon) {
    return null;
  }

  return (
    <Icon
      size={typeof size === "string" ? Number(size) : size}
      className={className ?? classProp}
    />
  );
}
