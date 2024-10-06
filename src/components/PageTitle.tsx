import { cn } from "@/lib/utils";

type Props = {
  title: string;
  className?: string; // Note: "classname" should be renamed to "className" to follow React's convention
};

export default function PageTitle({ title, className }: Props) {
  return <h1 className={cn("text-2xl font-semibold", className)}>{title}</h1>;
}
