import { useEffect, useMemo, useRef, useState } from "react";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchChatHistory, sendMessage } from "@/services/message.service";
import { fetchProjectMembers } from "@/services/project.service";
import { useChatSocket } from "@/hooks/useChatSocket";
import { SendHorizontal, Paperclip } from "lucide-react";
import ChatMessage from "./ChatMessage";
import QueryError from "@/components/ui/QueryError";
import ChatSkeleton from "@/components/skeleton/ChatSkeleton";
import MentionTextarea from "@/components/ui/MentionTextarea";
import { formatTime, groupMessagesByDate } from "@/utils/formatData";
import { toast } from "react-toastify";
import type { ProjectMembersType } from "@/types";
import {
  deleteFile,
  fetchFileHistory,
  uploadChatFile,
} from "@/services/file.service";
import type { Message, GetFileHistorry } from "@/types";

type FeedItem =
  | (Message & { feedType: "TEXT" })
  | (GetFileHistorry & { feedType: "FILE" });

export default function ChatPanel({ projectId }: { projectId: string }) {
  const [draft, setDraft] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const scrollbottom = () => {
    messagesRef.current?.scrollIntoView({ behavior: "instant" });
  };

  // 1. Fetch Message History
  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["chat-history", projectId],
    queryFn: () => fetchChatHistory(projectId),
  });
  // 1. Fetch File History
  const { data: projectFiles } = useQuery({
    queryKey: ["file-history", projectId],
    queryFn: () => fetchFileHistory(projectId),
  });

  const unifiedFeed = useMemo(() => {
    const msgList: Message[] = messages?.data || [];
    const fileList: GetFileHistorry[] = projectFiles?.data || [];

    const combined: FeedItem[] = [
      ...msgList.map((m) => ({ ...m, feedType: "TEXT" as const })),
      ...fileList.map((f) => ({ ...f, feedType: "FILE" as const })),
    ];

    combined.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return groupMessagesByDate(combined);
  }, [messages?.data, projectFiles?.data]);

  // 2. Real-time Listener
  useChatSocket(projectId);

  // 3. Send Message Mutation
  const mutation = useMutation({
    mutationFn: sendMessage,
    // Belt + suspenders: the socket usually pushes the new message, but if the
    // socket is offline this keeps the chat list correct.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history", projectId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message || "Couldn't send message");
    },
  });

  const fileMutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      uploadChatFile({ projectId, file }),
    onSuccess: () => {
      toast.success("File shared!");
      queryClient.invalidateQueries({ queryKey: ["file-history", projectId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message || "Couldn't upload file");
    },
  });
  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) => deleteFile(fileId),
    onSuccess: () => {
      toast.success("File deleted!");
      queryClient.invalidateQueries({ queryKey: ["file-history", projectId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message || "Couldn't delete file");
    },
  });

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      fileMutation.mutate({ file });
    }
  };

  const onSend = () => {
    const content = draft.trim();
    if (!content) return;
    mutation.mutate(
      { projectId, content },
      {
        onSuccess: () => {
          setDraft("");
        },
      },
    );
  };

  const { data: membersData } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });
  const members: ProjectMembersType[] = membersData?.data?.projectMembers ?? [];

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    scrollbottom();
  }, [messages]);

  if (isLoading) return <ChatSkeleton />;

  if (isError)
    return (
      <div className="p-4">
        <QueryError
          compact
          message="Couldn't load chat history."
          onRetry={() => refetch()}
        />
      </div>
    );

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {Object.keys(unifiedFeed).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-[#678383] gap-1">
            <p className="text-sm font-bold">No messages yet</p>
            <p className="text-xs">
              Say hi to your team to get the thread going.
            </p>
          </div>
        ) : (
          Object.entries(unifiedFeed).map(([date, items]) => (
            <div key={date}>
              <div className="relative flex items-center py-4">
                <div className="grow border-t border-[#dde4e4] dark:border-gray-800"></div>
                <span className="shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-[#678383]">
                  {date}
                </span>
                <div className="grow border-t border-[#dde4e4] dark:border-gray-800"></div>
              </div>
              {items?.map((msg) => (
                <div key={`${msg.feedType}-${msg.id}`}>
                  <ChatMessage
                    name={
                      msg.feedType === "TEXT"
                        ? msg.sender?.name
                        : msg.uploader?.name
                    }
                    content={msg.feedType === "TEXT" ? msg.content : msg.name}
                    time={formatTime(msg.createdAt)}
                    id={msg.feedType === "TEXT" ? msg.senderId : msg.uploaderId}
                    messageId={msg.feedType === "TEXT" ? msg.id : undefined}
                    feedType={msg.feedType}
                    url={msg.feedType === "FILE" ? msg.url : undefined}
                    onDelete={() => deleteFileMutation.mutate(msg.id)}
                    members={members}
                    reactions={
                      msg.feedType === "TEXT" ? msg.reactions : undefined
                    }
                  />
                  <div ref={messagesRef}></div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      {/* <!-- Message Input Bar (Fixed Bottom) --> */}
      <div className="px-6 pb-6 pt-2 bg-white dark:bg-background-dark border-t border-transparent">
        <div className="relative bg-white dark:bg-gray-800 border border-[#dde4e4] dark:border-gray-700 rounded-xl shadow-lg focus-within:border-primary2/50 focus-within:ring-4 focus-within:ring-primary2/5 transition-all">
          <div className="flex flex-col p-2">
            <MentionTextarea
              value={draft}
              onChange={setDraft}
              members={members}
              rows={2}
              placeholder="Type a message… @ to mention"
              onSubmit={onSend}
              className="w-full border-none focus:ring-0 bg-transparent text-[15px] outline-none resize-none min-h-11 max-h-40 placeholder:text-gray-400 font-medium"
            />
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1">
                {/* <button className="p-1.5 text-gray-500 hover:text-primary2 hover:bg-[#f1f4f4] dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    format_bold
                  </span>
                </button>
                <button className="p-1.5 text-gray-500 hover:text-primary2 hover:bg-[#f1f4f4] dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    format_italic
                  </span>
                </button>
                <button className="p-1.5 text-gray-500 hover:text-primary2 hover:bg-[#f1f4f4] dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    link
                  </span>
                </button> */}
                <div className="w-px h-6 bg-[#dde4e4] dark:bg-gray-700 mx-1"></div>
                <button
                  onClick={handlePaperclipClick}
                  className="p-1.5 text-gray-500 hover:text-primary2 hover:bg-[#f1f4f4] dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    <Paperclip />
                  </span>
                </button>
                <input
                  type="file"
                  className="hidden"
                  onChange={onFileSelect}
                  ref={fileInputRef}
                />
                {/* <button className="p-1.5 text-gray-500 hover:text-primary2 hover:bg-[#f1f4f4] dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-xl">
                    mood
                  </span>
                </button> */}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onSend}
                  className="flex items-center gap-2 bg-primary2 hover:bg-[#155351] text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                >
                  <span>Send</span>
                  <span className="material-symbols-outlined text-sm">
                    <SendHorizontal />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
