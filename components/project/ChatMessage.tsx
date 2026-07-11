import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { Paperclip, Trash2 } from "lucide-react";
import UserAvatar from "./../UserAvatar";
import MentionText from "../ui/MentionText";
import MessageReactions from "./MessageReactions";
import type { MessageReactionRow, ProjectMembersType } from "@/types";

const ChatMessage = ({
  name,
  time,
  content,
  id,
  messageId,
  feedType,
  url,
  onDelete,
  members = [],
  reactions,
}: {
  id: string;
  name: string;
  time: string;
  content: string;
  /** The DB id of the chat row; only present for TEXT messages and used to
   * scope reactions. */
  messageId?: string;
  feedType: string;
  url?: string;
  onDelete: () => void;
  members?: ProjectMembersType[];
  reactions?: MessageReactionRow[];
}) => {
  const userId = useAuthStore((state) => state.user?.id);

  return (
    <>
      <div className={`chat ${userId === id ? "chat-end" : "chat-start"} my-4`}>
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <UserAvatar customName={name} />
          </div>
        </div>
        <div className="chat-header">
          <p className="text-sm font-bold text-[#121717] dark:text-white">
            {name}
          </p>
          <time className="text-[11px] text-[#678383] font-medium">{time}</time>
        </div>
        {feedType === "TEXT" ? (
          <>
            <div className="chat-bubble text-[15px] leading-relaxed text-[#121717] dark:text-gray-300 break-words max-w-[80vw] sm:max-w-none">
              <MentionText
                text={content}
                members={members}
                currentUserId={userId}
              />
            </div>
            {messageId && (
              <div className="chat-footer">
                <MessageReactions
                  messageId={messageId}
                  reactions={reactions ?? []}
                  currentUserId={userId}
                />
              </div>
            )}
          </>
        ) : (
          <div className="mt-2">
            {userId === id && (
              <button
                onClick={onDelete}
                className="hover:opacity-100 text-red-500 transition-opacity opacity-0"
              >
                <Trash2 size={14} />
              </button>
            )}
            {url && url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
              <Image
                src={url}
                alt={name || "image"}
                width={500}
                height={500}
                className="rounded-xl border border-[#dde4e4] dark:border-gray-800 max-w-110 cursor-pointer hover:shadow-md transition-all"
                onClick={() =>
                  window.open(url, "_blank", "noopener,noreferrer")
                }
              />
            ) : (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit"
              >
                <Paperclip size={16} className="text-primary2" />
                <span className="text-sm font-medium underline">{name}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessage;
