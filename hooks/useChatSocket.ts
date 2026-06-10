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

    socket.on("new_message", onNewMessage);
    socket.on("new_file", upsertFile);
    socket.on("file_deleted", removeFile);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("new_file", upsertFile);
      socket.off("file_deleted", removeFile);
    };
  }, [projectId, queryClient]);
}
