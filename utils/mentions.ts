import type { ProjectMembersType } from "@/types";

// We use the email prefix as the @handle so users always have something stable
// and unique to type. The autocomplete shows "Sarah Chen (sarah)" but inserts
// "@sarah" into the text. Display rendering reverses that — `@sarah` → "Sarah Chen".
export const MENTION_REGEX = /@([a-zA-Z0-9._-]+)/g;

export const handleForUser = (email: string | null | undefined) => {
  if (!email) return null;
  return email.split("@")[0]?.toLowerCase() ?? null;
};

export interface ResolvedMention {
  handle: string;
  userId: string;
  name: string;
  email: string;
}

export const resolveMentions = (
  text: string,
  members: ProjectMembersType[],
): ResolvedMention[] => {
  const byHandle = new Map<string, ResolvedMention>();
  for (const m of members) {
    const handle = handleForUser(m.user?.email);
    if (!handle) continue;
    byHandle.set(handle, {
      handle,
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
    });
  }

  const seen = new Set<string>();
  const result: ResolvedMention[] = [];
  text.replace(MENTION_REGEX, (_, raw) => {
    const handle = String(raw).toLowerCase();
    if (seen.has(handle)) return "";
    seen.add(handle);
    const hit = byHandle.get(handle);
    if (hit) result.push(hit);
    return "";
  });
  return result;
};

/**
 * Splits `text` into segments — plain string fragments plus mention objects.
 * Lets callers render with whatever JSX styling they want.
 */
export type MentionSegment =
  | { kind: "text"; value: string }
  | { kind: "mention"; raw: string; handle: string; member?: ResolvedMention };

export const segmentText = (
  text: string,
  members: ProjectMembersType[],
): MentionSegment[] => {
  const byHandle = new Map<string, ResolvedMention>();
  for (const m of members) {
    const handle = handleForUser(m.user?.email);
    if (!handle) continue;
    byHandle.set(handle, {
      handle,
      userId: m.userId,
      name: m.user.name,
      email: m.user.email,
    });
  }

  const segments: MentionSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(MENTION_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, start) });
    }
    const raw = match[0];
    const handle = match[1].toLowerCase();
    segments.push({
      kind: "mention",
      raw,
      handle,
      member: byHandle.get(handle),
    });
    lastIndex = start + raw.length;
  }
  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) });
  }
  return segments;
};
