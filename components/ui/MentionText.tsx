import type { ProjectMembersType } from "@/types";
import { segmentText } from "@/utils/mentions";

interface Props {
  text: string;
  members: ProjectMembersType[];
  currentUserId?: string | null;
  className?: string;
}

/**
 * Renders chat / comment content with `@handle` tokens replaced by styled
 * mention chips. Falls back to plain text for any handle that doesn't resolve
 * to a project member (e.g. typo or member removed since the message was sent).
 */
const MentionText = ({ text, members, currentUserId, className }: Props) => {
  const segments = segmentText(text, members);
  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.kind === "text") return <span key={i}>{seg.value}</span>;
        const isSelf = seg.member?.userId === currentUserId;
        if (!seg.member) {
          return (
            <span key={i} className="opacity-80">
              {seg.raw}
            </span>
          );
        }
        return (
          <span
            key={i}
            className={`inline-block px-1 rounded font-bold ${
              isSelf ? "bg-primary2 text-white" : "bg-primary2/10 text-primary2"
            }`}
            title={seg.member.email}
          >
            @{seg.member.name ?? seg.member.handle}
          </span>
        );
      })}
    </span>
  );
};

export default MentionText;
