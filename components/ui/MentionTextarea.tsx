"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { ProjectMembersType } from "@/types";
import { handleForUser } from "@/utils/mentions";
import UserAvatar from "../UserAvatar";

interface Props {
  value: string;
  onChange: (next: string) => void;
  members: ProjectMembersType[];
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  onSubmit?: () => void;
}

export interface MentionTextareaHandle {
  focus: () => void;
}

const MAX_SUGGESTIONS = 6;

const MentionTextarea = forwardRef<MentionTextareaHandle, Props>(
  function MentionTextarea(
    {
      value,
      onChange,
      members,
      placeholder,
      rows = 3,
      className = "",
      disabled,
      onSubmit,
    },
    ref,
  ) {
    const textRef = useRef<HTMLTextAreaElement>(null);
    const [query, setQuery] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useImperativeHandle(ref, () => ({
      focus: () => textRef.current?.focus(),
    }));

    // Build the candidate list for the current `@…` token.
    const suggestions =
      query === null
        ? []
        : members
            .map((m) => ({
              member: m,
              handle: handleForUser(m.user?.email) ?? "",
            }))
            .filter(
              (s) =>
                s.handle.length > 0 &&
                (query.length === 0 ||
                  s.handle.includes(query.toLowerCase()) ||
                  (s.member.user.name ?? "")
                    .toLowerCase()
                    .includes(query.toLowerCase())),
            )
            .slice(0, MAX_SUGGESTIONS);

    const updateQueryFromCaret = (next: string, caret: number) => {
      const before = next.slice(0, caret);
      const at = before.lastIndexOf("@");
      if (at < 0) return setQuery(null);
      // Make sure the `@` starts a new token (beginning of line or after whitespace).
      const charBefore = at === 0 ? "" : before[at - 1];
      if (charBefore && !/\s/.test(charBefore)) return setQuery(null);
      const token = before.slice(at + 1);
      // Token contains no spaces and only allowed handle chars.
      if (/\s/.test(token) || /[^a-zA-Z0-9._-]/.test(token)) {
        return setQuery(null);
      }
      setQuery(token);
      setActiveIndex(0);
    };

    const pickSuggestion = (handle: string) => {
      const el = textRef.current;
      if (!el) return;
      const caret = el.selectionStart ?? value.length;
      const before = value.slice(0, caret);
      const at = before.lastIndexOf("@");
      if (at < 0) return;
      const after = value.slice(caret);
      const next = `${value.slice(0, at)}@${handle} ${after}`;
      onChange(next);
      setQuery(null);
      // Restore caret after the inserted handle + space.
      requestAnimationFrame(() => {
        const pos = at + handle.length + 2;
        el.focus();
        el.setSelectionRange(pos, pos);
      });
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (query !== null && suggestions.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          pickSuggestion(suggestions[activeIndex].handle);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setQuery(null);
          return;
        }
      }
      // Cmd/Ctrl + Enter submits when no picker open.
      if (
        onSubmit &&
        (e.metaKey || e.ctrlKey) &&
        e.key === "Enter" &&
        query === null
      ) {
        e.preventDefault();
        onSubmit();
      }
    };

    return (
      <div className="relative">
        <textarea
          ref={textRef}
          rows={rows}
          disabled={disabled}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            updateQueryFromCaret(e.target.value, e.target.selectionStart ?? 0);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => {
            // Close the picker shortly after blur so click-to-pick still fires.
            setTimeout(() => setQuery(null), 100);
          }}
          className={className}
        />
        {query !== null && suggestions.length > 0 && (
          <div className="absolute z-20 bottom-full mb-1 left-0 w-64 max-h-60 overflow-y-auto rounded-lg border border-[#dde4e4] dark:border-zinc-700 bg-white dark:bg-zinc-900 soft-shadow py-1">
            {suggestions.map((s, i) => (
              <button
                key={s.member.id}
                type="button"
                onMouseDown={(e) => {
                  // mousedown so blur doesn't close the picker before click fires.
                  e.preventDefault();
                  pickSuggestion(s.handle);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm ${
                  i === activeIndex
                    ? "bg-primary2/10"
                    : "hover:bg-background-light dark:hover:bg-zinc-800"
                }`}
              >
                <UserAvatar customName={s.member.user.name ?? "?"} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate dark:text-zinc-100">
                    {s.member.user.name ?? "Unknown"}
                  </p>
                  <p className="text-[11px] text-[#6A717B] dark:text-zinc-400 truncate">
                    @{s.handle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export default MentionTextarea;
