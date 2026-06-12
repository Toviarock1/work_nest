"use client";

import UserAvatar from "../UserAvatar";
import type { PresenceUser } from "@/hooks/useProjectPresence";

const MAX_VISIBLE = 5;

interface Props {
  users: PresenceUser[];
  currentUserId?: string | null;
}

const PresenceStack = ({ users, currentUserId }: Props) => {
  // Filter out the current user — you don't need to see yourself in the "who's here" strip.
  const others = currentUserId
    ? users.filter((u) => u.userId !== currentUserId)
    : users;

  if (others.length === 0) return null;

  const visible = others.slice(0, MAX_VISIBLE);
  const overflow = Math.max(0, others.length - MAX_VISIBLE);

  return (
    <div
      className="flex items-center gap-2"
      aria-label={`${others.length} ${others.length === 1 ? "person" : "people"} viewing this project`}
    >
      <div className="flex -space-x-2">
        {visible.map((u) => (
          <div
            key={u.userId}
            title={u.name ?? "Member"}
            className="ring-2 ring-white dark:ring-zinc-950 rounded-xl"
          >
            <UserAvatar customName={u.name ?? "?"} size="sm" />
          </div>
        ))}
        {overflow > 0 && (
          <div className="ring-2 ring-white dark:ring-zinc-950 size-8 rounded-xl bg-[#f1f4f4] dark:bg-zinc-800 text-[#678383] dark:text-zinc-300 text-[11px] font-bold flex items-center justify-center">
            +{overflow}
          </div>
        )}
      </div>
      <span className="hidden lg:inline text-xs text-[#678383] dark:text-zinc-400">
        viewing now
      </span>
    </div>
  );
};

export default PresenceStack;
