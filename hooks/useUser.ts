import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/user.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export function useUser(options?: { enabled?: boolean }) {
  const setUser = useAuthStore((state) => state.setUser);
  const enabled = options?.enabled ?? true;

  const query = useQuery({
    queryKey: ["user-me"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data.data);
    }
  }, [query.data, setUser]);

  return {
    user: query.data?.data,
    isLoading: enabled && query.isLoading,
    isError: query.isError,
  };
}
