"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import socket from "@/lib/socket";

interface AssignedTaskPayload {
  id: string;
  title?: string;
  assignedToId?: string | null;
  assignedTo?: { id?: string; name?: string };
}

interface NewMessagePayload {
  id: string;
  senderId?: string;
}

interface MentionPayload {
  source: "message" | "comment";
  projectId: string;
  excerpt?: string;
  from?: { id?: string; name?: string | null };
}

interface Options {
  projectId: string;
  /** Logged-in user's id — used to scope assignment toasts and skip self-sends. */
  currentUserId?: string | null;
  /** When true the unread counter is suppressed and any pending count is cleared. */
  isMessagesTabActive: boolean;
}

/**
 * Project-wide awareness signals: unread messages while away from the Messages
 * tab, plus a toast notification when the current user is assigned a task.
 *
 * Listening lives here (not in ChatPanel) so signals fire even when the chat
 * panel isn't mounted.
 */
export function useProjectAwareness({
  projectId,
  currentUserId,
  isMessagesTabActive,
}: Options) {
  const [unreadMessages, setUnreadMessages] = useState(0);

  // Clear pending count whenever the user lands on the Messages tab. The
  // setState-in-effect rule is appropriate to disable here: the count is an
  // external counter sync'd from socket events, not derivable in render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isMessagesTabActive) setUnreadMessages(0);
  }, [isMessagesTabActive]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!projectId) return;

    const onNewMessage = (payload: NewMessagePayload) => {
      if (payload?.senderId && payload.senderId === currentUserId) return;
      // Use a fresh check via the functional setter so the listener identity
      // doesn't have to change with each tab-state flip.
      setUnreadMessages((n) => (isMessagesTabActive ? 0 : n + 1));
    };

    const onTaskAssigned = (payload: AssignedTaskPayload) => {
      if (!currentUserId) return;
      const assignedId = payload.assignedToId ?? payload.assignedTo?.id;
      if (assignedId !== currentUserId) return;
      const title = payload.title ?? "a task";
      toast.info(`You were assigned to "${title}"`);
    };

    const onMention = (payload: MentionPayload) => {
      const who = payload.from?.name ?? "Someone";
      const where = payload.source === "comment" ? "a comment" : "a message";
      const excerpt = payload.excerpt
        ? `: "${payload.excerpt.slice(0, 80)}${
            payload.excerpt.length > 80 ? "…" : ""
          }"`
        : "";
      toast.info(`${who} mentioned you in ${where}${excerpt}`);
    };

    socket.on("new_message", onNewMessage);
    socket.on("task_assigned", onTaskAssigned);
    socket.on("mention", onMention);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("task_assigned", onTaskAssigned);
      socket.off("mention", onMention);
    };
  }, [projectId, currentUserId, isMessagesTabActive]);

  return { unreadMessages };
}
