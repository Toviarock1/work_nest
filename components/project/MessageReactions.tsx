"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { SmilePlus } from "lucide-react";
import { QUICK_REACTIONS, toggleReaction } from "@/services/reaction.service";
import type { MessageReactionRow } from "@/types";

interface Props {
  messageId: string;
  reactions: MessageReactionRow[];
  currentUserId?: string | null;
}

interface Grouped {
  emoji: string;
  count: number;
  mine: boolean;
}

const groupReactions = (
  rows: MessageReactionRow[],
  currentUserId: string | null | undefined,
): Grouped[] => {
  const map = new Map<string, Grouped>();
  for (const r of rows) {
    const existing = map.get(r.emoji);
    if (existing) {
      existing.count += 1;
      if (currentUserId && r.userId === currentUserId) existing.mine = true;
    } else {
      map.set(r.emoji, {
        emoji: r.emoji,
        count: 1,
        mine: !!currentUserId && r.userId === currentUserId,
      });
    }
  }
  return Array.from(map.values());
};

const MessageReactions = ({ messageId, reactions, currentUserId }: Props) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const onClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [pickerOpen]);

  const { mutate, isPending } = useMutation({
    mutationFn: toggleReaction,
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message || "Couldn't update reaction, try again",
      );
    },
  });

  const grouped = groupReactions(reactions, currentUserId);

  const click = (emoji: string) => {
    setPickerOpen(false);
    mutate({ messageId, emoji });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {grouped.map((g) => (
        <button
          key={g.emoji}
          type="button"
          disabled={isPending}
          onClick={() => click(g.emoji)}
          aria-pressed={g.mine}
          aria-label={`${g.emoji} ${g.count} ${g.mine ? "— click to remove yours" : "— click to react"}`}
          className={`inline-flex items-center gap-1 px-1.5 h-6 rounded-full text-xs border transition-colors ${
            g.mine
              ? "bg-primary2/10 border-primary2/40 text-primary2"
              : "bg-white dark:bg-zinc-800 border-[#dde4e4] dark:border-zinc-700 text-[#121717] dark:text-zinc-200 hover:border-primary2/40"
          } disabled:opacity-60`}
        >
          <span>{g.emoji}</span>
          <span className="font-bold tabular-nums text-[11px]">{g.count}</span>
        </button>
      ))}
      <div className="relative" ref={pickerRef}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => setPickerOpen((p) => !p)}
          aria-label="Add reaction"
          className="size-6 inline-flex items-center justify-center rounded-full text-[#678383] hover:text-primary2 hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
        >
          <SmilePlus className="size-3.5" />
        </button>
        {pickerOpen && (
          <div className="absolute z-20 bottom-full mb-1 left-0 flex gap-1 px-1.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-[#dde4e4] dark:border-zinc-700 shadow-lg">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => click(emoji)}
                aria-label={`React with ${emoji}`}
                className="size-7 inline-flex items-center justify-center rounded-full hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 transition-colors text-base"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactions;
