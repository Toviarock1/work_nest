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

  // Generate a consistent background color based on the name.
  // Use 600 in light mode for AA contrast on white, 500 in dark mode so the chip pops on zinc-900.
  const colors = [
    "bg-red-600 dark:bg-red-500",
    "bg-blue-600 dark:bg-blue-500",
    "bg-emerald-600 dark:bg-emerald-500",
    "bg-amber-600 dark:bg-amber-500",
    "bg-purple-600 dark:bg-purple-500",
    "bg-pink-600 dark:bg-pink-500",
    "bg-teal-600 dark:bg-teal-500",
  ];
  // Simple "hash" to pick the same color for the same name every time
  const colorIndex = name ? name.length % colors.length : 0;
  const bgColor = colors[colorIndex];

  return (
    <div
      className={`flex items-center justify-center rounded-xl font-bold text-white shadow-sm shrink-0 
      ${sizeClasses[size]} ${bgColor} ${className}`}
    >
      {firstLetter}
    </div>
  );
}
