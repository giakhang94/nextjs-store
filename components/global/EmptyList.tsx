import { cn } from "@/lib/utils";

interface Props {
  heading?: string;
  className?: string;
}
function EmptyList({ heading = "No items found.", className }: Props) {
  return <div className={cn(className, "text-xl")}>{heading}</div>;
}

export default EmptyList;
