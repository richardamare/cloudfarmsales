import { ArrowDown, ArrowUp } from "lucide-react";
import { formatPercent } from "~/lib/utils";

export function PercentangeChange({
  value,
  text = "from last month",
}: {
  value: number;
  text?: string;
}) {
  const formatted = formatPercent(value * 100);

  if (value > 0) {
    return (
      <span className="text-green-500">
        <ArrowUp className="mr-1 inline-block h-3 w-3" />
        {formatted}%{" "}
        <span className="text-xs text-muted-foreground">{text}</span>
      </span>
    );
  }
  return (
    <span className="text-red-500">
      <ArrowDown className="mr-1 inline-block h-3 w-3" />
      {formatted}% <span className="text-xs text-muted-foreground">{text}</span>
    </span>
  );
}
