export const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// "Today" / "Yesterday" / "3d ago" / "2w ago" / falls back to absolute date
export const formatRelative = (dateString: string | Date) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(diffMs / day);

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(date);
};

export const formatTime = (dateString: string | Date) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getMessageDateLabel = (dateString: string | Date) => {
  const date = new Date(dateString);
  const now = new Date();

  // Handle invalid dates
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Reset times to compare only dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const checkDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (checkDate.getTime() === today.getTime()) return "Today";
  if (checkDate.getTime() === yesterday.getTime()) return "Yesterday";

  // Otherwise return "October 24"
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
  });
};

// Group any list of items that carry a `createdAt` (messages, files, etc.)
// by the human-readable date label used in the chat feed.
export const groupMessagesByDate = <T extends { createdAt: string | Date }>(
  items: T[],
): Record<string, T[]> => {
  if (!items) return {};

  return items.reduce<Record<string, T[]>>((groups, item) => {
    const dateLabel = getMessageDateLabel(item.createdAt);
    if (!groups[dateLabel]) groups[dateLabel] = [];
    groups[dateLabel].push(item);
    return groups;
  }, {});
};
