import axiosInstance from "@/lib/axiosInstance";

export const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "👀", "🙏"] as const;
export type QuickReaction = (typeof QUICK_REACTIONS)[number];

export const toggleReaction = async (payload: {
  messageId: string;
  emoji: string;
}) => {
  // The emoji needs URL-encoding so multibyte characters survive the path.
  const response = await axiosInstance.post(
    `/reactions/message/${payload.messageId}/${encodeURIComponent(payload.emoji)}`,
  );
  return response.data;
};
