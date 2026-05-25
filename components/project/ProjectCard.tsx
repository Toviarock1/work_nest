import {
  fetchProjectMembers,
  removeProject,
} from "@/services/project.service";
import { ProjectMembersType } from "@/types";
import { formatRelative } from "@/utils/formatData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, EllipsisVertical, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import UserAvatar from "../UserAvater";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
}

const MAX_AVATARS = 3;

const ProjectCard = ({ id, name, description, createdAt }: ProjectCardProps) => {
  const queryClient = useQueryClient();

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ["project-members", id],
    queryFn: () => fetchProjectMembers(id),
    staleTime: 60 * 1000,
  });

  const members: ProjectMembersType[] = Array.isArray(
    membersData?.data?.projectMembers,
  )
    ? membersData.data.projectMembers
    : [];
  const visibleMembers = members.slice(0, MAX_AVATARS);
  const overflow = Math.max(0, members.length - MAX_AVATARS);

  const { mutate, isPending } = useMutation({
    mutationFn: removeProject,
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleOptions = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onRemove = (id: string) => {
    mutate({ id });
  };

  return (
    <div className="bg-white dark:bg-background-dark rounded-xl border border-[#f1f4f4] dark:border-[#2d3238] shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 group">
      <div className="flex justify-end items-start mb-4">
        <div className="dropdown" onClick={handleOptions}>
          <button
            tabIndex={0}
            className="p-1 text-[#678383] hover:bg-[#f1f4f4] dark:hover:bg-[#2d3238] rounded"
            onClick={handleOptions}
            aria-label="Project options"
          >
            <EllipsisVertical className="size-5" />
          </button>
          <ul
            tabIndex={-1}
            className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
          >
            <li>
              <button
                disabled={isPending}
                onClick={() => onRemove(id)}
                className="w-full btn flex justify-start gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <Trash2 className="size-4" />
                <span className="font-bold">Delete</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Link href={`dashboard/project/${id}`} className="block">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-1 capitalize">{name}</h3>
          <p className="text-sm text-[#678383] line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-[#f1f4f4] dark:border-[#2d3238]">
          {/* Avatar stack + count */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {membersLoading ? (
                <>
                  <div className="skeleton size-8 rounded-full ring-2 ring-white dark:ring-background-dark" />
                  <div className="skeleton size-8 rounded-full ring-2 ring-white dark:ring-background-dark" />
                  <div className="skeleton size-8 rounded-full ring-2 ring-white dark:ring-background-dark" />
                </>
              ) : visibleMembers.length > 0 ? (
                visibleMembers.map((m) => (
                  <div
                    key={m.id}
                    className="ring-2 ring-white dark:ring-background-dark rounded-full"
                    title={m.user?.name}
                  >
                    <UserAvatar customName={m.user?.name} size="sm" />
                  </div>
                ))
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-[#678383]">
                  <Users className="size-4" />
                  No members
                </span>
              )}
              {overflow > 0 && (
                <div className="ring-2 ring-white dark:ring-background-dark size-8 rounded-full bg-[#f1f4f4] dark:bg-[#2d3238] text-[#678383] text-xs font-bold flex items-center justify-center">
                  +{overflow}
                </div>
              )}
            </div>
            {!membersLoading && members.length > 0 && (
              <span className="text-xs text-[#678383] ml-1">
                {members.length} member{members.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {/* Created at */}
          {createdAt && (
            <span
              className="inline-flex items-center gap-1 text-xs text-[#678383]"
              title={new Date(createdAt).toLocaleString()}
            >
              <Clock className="size-3.5" />
              {formatRelative(createdAt)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
