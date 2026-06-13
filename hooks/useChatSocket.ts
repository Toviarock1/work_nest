import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "@/lib/socket";
import type { ApiResponse, GetFileHistorry, Message } from "@/types";

type MessageCache = ApiResponse<Message[]>;
type FileCache = ApiResponse<GetFileHistorry[]>;

export function useChatSocket(projectId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!projectId) return;

    const onNewMessage = (newMessage: Message) => {
      queryClient.setQueryData<MessageCache>(
        ["chat-history", projectId],
        (oldData) => {
          if (!oldData) return { data: [newMessage] };
          if (oldData.data.some((m) => m.id === newMessage.id)) return oldData;
          return { ...oldData, data: [...oldData.data, newMessage] };
        },
      );
    };

    const upsertFile = (newFile: GetFileHistorry) => {
      queryClient.setQueryData<FileCache>(
        ["file-history", projectId],
        (oldData) => {
          if (!oldData) return { data: [newFile] };
          if (oldData.data.some((f) => f.id === newFile.id)) return oldData;
          return { ...oldData, data: [...oldData.data, newFile] };
        },
      );
    };

    const removeFile = (deletedFile: { id: string }) => {
      queryClient.setQueryData<FileCache>(
        ["file-history", projectId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((f) => f.id !== deletedFile.id),
          };
        },
      );
    };

    const reactionDelta = (
      payload: { messageId: string; emoji: string; userId: string },
      mode: "add" | "remove",
    ) => {
      queryClient.setQueryData<MessageCache>(
        ["chat-history", projectId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((m) => {
              if (m.id !== payload.messageId) return m;
              const current = m.reactions ?? [];
              if (mode === "add") {
                if (
                  current.some(
                    (r) =>
                      r.emoji === payload.emoji && r.userId === payload.userId,
                  )
                ) {
                  return m;
                }
                return {
                  ...m,
                  reactions: [
                    ...current,
                    { emoji: payload.emoji, userId: payload.userId },
                  ],
                };
              }
              return {
                ...m,
                reactions: current.filter(
                  (r) =>
                    !(r.emoji === payload.emoji && r.userId === payload.userId),
                ),
              };
            }),
          };
        },
      );
    };

    const onReactionAdded = (p: {
      messageId: string;
      emoji: string;
      userId: string;
    }) => reactionDelta(p, "add");
    const onReactionRemoved = (p: {
      messageId: string;
      emoji: string;
      userId: string;
    }) => reactionDelta(p, "remove");

    socket.on("new_message", onNewMessage);
    socket.on("new_file", upsertFile);
    socket.on("file_deleted", removeFile);
    socket.on("message_reaction_added", onReactionAdded);
    socket.on("message_reaction_removed", onReactionRemoved);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("new_file", upsertFile);
      socket.off("file_deleted", removeFile);
      socket.off("message_reaction_added", onReactionAdded);
      socket.off("message_reaction_removed", onReactionRemoved);
    };
  }, [projectId, queryClient]);
}
