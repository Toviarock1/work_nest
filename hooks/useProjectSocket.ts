import socket from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";

export function useProjectSocket(projectId: string) {
  const queryClient = useQueryClient();

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] });
  }, [queryClient, projectId]);

  useEffect(() => {
    if (!projectId) return;
    // socket.on("connect", () => {
    //   console.log("✅ Socket Connected:", socket.id);
    // });

    // socket.on("disconnect", (reason) => {
    //   console.log("❌ Socket Disconnected. Reason:", reason);
    // });

    socket.emit("join_project", projectId);

    socket.on("task_created", invalidateQuery);
    socket.on("task_updated", invalidateQuery);
    socket.on("task_deleted", invalidateQuery);
    socket.on("task_assigned", invalidateQuery);
    socket.on("task_file_added", invalidateQuery);
    socket.on("task_link_created", invalidateQuery);
    socket.on("task_link_deleted", invalidateQuery);

    return () => {
      socket.off("task_created", invalidateQuery);
      socket.off("task_updated", invalidateQuery);
      socket.off("task_deleted", invalidateQuery);
      socket.off("task_assigned", invalidateQuery);
      socket.off("task_file_added", invalidateQuery);
      socket.off("task_link_created", invalidateQuery);
      socket.off("task_link_deleted", invalidateQuery);
    };
  }, [projectId, invalidateQuery]);
}
