"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";

export interface PresenceUser {
  userId: string;
  name?: string;
}

interface PresenceStatePayload {
  projectId: string;
  users: PresenceUser[];
}

interface PresenceJoinPayload {
  projectId: string;
  user: PresenceUser;
}

interface PresenceLeavePayload {
  projectId: string;
  userId: string;
}

interface TaskViewerJoinedPayload {
  projectId: string;
  taskId: string;
  user: PresenceUser;
}

interface TaskViewerLeftPayload {
  projectId: string;
  taskId: string;
  userId: string;
}

/**
 * Tracks who is currently in the given project room and which tasks have
 * active viewers. Listens via the existing shared socket instance, so it's
 * safe to call from any component on the project page.
 */
export function useProjectPresence(projectId: string) {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  // taskId -> array of viewer users
  const [taskViewers, setTaskViewers] = useState<
    Record<string, PresenceUser[]>
  >({});

  useEffect(() => {
    if (!projectId) return;

    const onState = (payload: PresenceStatePayload) => {
      if (payload.projectId !== projectId) return;
      setUsers(payload.users);
    };
    const onJoin = (payload: PresenceJoinPayload) => {
      if (payload.projectId !== projectId) return;
      setUsers((prev) =>
        prev.some((u) => u.userId === payload.user.userId)
          ? prev
          : [...prev, payload.user],
      );
    };
    const onLeave = (payload: PresenceLeavePayload) => {
      if (payload.projectId !== projectId) return;
      setUsers((prev) => prev.filter((u) => u.userId !== payload.userId));
    };

    const onViewerJoined = (payload: TaskViewerJoinedPayload) => {
      if (payload.projectId !== projectId) return;
      setTaskViewers((prev) => {
        const list = prev[payload.taskId] ?? [];
        if (list.some((u) => u.userId === payload.user.userId)) return prev;
        return { ...prev, [payload.taskId]: [...list, payload.user] };
      });
    };
    const onViewerLeft = (payload: TaskViewerLeftPayload) => {
      if (payload.projectId !== projectId) return;
      setTaskViewers((prev) => {
        const list = prev[payload.taskId];
        if (!list) return prev;
        const next = list.filter((u) => u.userId !== payload.userId);
        if (next.length === 0) {
          const copy = { ...prev };
          delete copy[payload.taskId];
          return copy;
        }
        return { ...prev, [payload.taskId]: next };
      });
    };

    socket.on("presence:state", onState);
    socket.on("presence:join", onJoin);
    socket.on("presence:leave", onLeave);
    socket.on("task:viewer_joined", onViewerJoined);
    socket.on("task:viewer_left", onViewerLeft);

    // Tell the server we want presence when (re)connecting, in case
    // useProjectSocket's join_project happened before we subscribed.
    socket.emit("join_project", projectId);

    return () => {
      socket.off("presence:state", onState);
      socket.off("presence:join", onJoin);
      socket.off("presence:leave", onLeave);
      socket.off("task:viewer_joined", onViewerJoined);
      socket.off("task:viewer_left", onViewerLeft);
      socket.emit("leave_project", projectId);
    };
  }, [projectId]);

  return { users, taskViewers };
}
