import { useUser } from "@/hooks/useUser";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  customName?: string;
}

export default function UserAvatar({
  size = "md",
  className = "",
  customName,
}: Props) {
  const { user } = useUser();
  const name = customName ? customName : user.name;
  const firstLetter = name?.charAt(0).toUpperCase();

  // 2. Define sizes
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "w-[250px] h-[200px] text-[150px]",
  };

  // Soft, low-saturation tinted backgrounds with matching deep text — reads
  // calm on white surfaces and stays legible on zinc-900 via the dark variants.
  const colors = [
    "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200",
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-200",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200",
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200",
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200",
    "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-200",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200",
  ];
  // Simple "hash" to pick the same color for the same name every time
  const colorIndex = name ? name.length % colors.length : 0;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`flex items-center justify-center rounded-xl font-bold shadow-sm shrink-0 ${sizeClasses[size]} ${bgColor} ${className}`}
    >
      {firstLetter}
    </div>
  );
}
