const Bubble = ({ side }: { side: "start" | "end" }) => (
  <div
    className={`flex gap-3 ${side === "end" ? "flex-row-reverse" : ""} my-3`}
  >
    <div className="skeleton size-10 rounded-full shrink-0" />
    <div className={`flex flex-col gap-2 ${side === "end" ? "items-end" : ""}`}>
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-10 w-64 rounded-xl" />
    </div>
  </div>
);

const ChatSkeleton = () => (
  <div className="flex-1 overflow-y-auto p-6 space-y-2">
    <div className="relative flex items-center py-3">
      <div className="grow border-t border-[#dde4e4] dark:border-gray-800" />
      <span className="skeleton mx-4 h-3 w-20 rounded" />
      <div className="grow border-t border-[#dde4e4] dark:border-gray-800" />
    </div>
    <Bubble side="start" />
    <Bubble side="end" />
    <Bubble side="start" />
  </div>
);

export default ChatSkeleton;
