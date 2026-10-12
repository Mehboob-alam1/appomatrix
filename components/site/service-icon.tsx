import {
  ChartNoAxesCombined,
  Cloud,
  Code2,
  Compass,
  Globe,
  Layers,
  Palette,
  PenLine,
  ShoppingBag,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  globe: Globe,
  smartphone: Smartphone,
  layers: Layers,
  compass: Compass,
  code: Code2,
  palette: Palette,
  pen: PenLine,
  cloud: Cloud,
  shopping: ShoppingBag,
  chart: ChartNoAxesCombined,
  sparkles: Sparkles,
};

export const SERVICE_ICONS = Object.keys(ICONS);

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Layers;
  return <Icon className={className} aria-hidden />;
}
