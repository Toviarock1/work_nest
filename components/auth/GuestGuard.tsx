import { useUser } from "@/hooks/useUser";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isError } = useUser();
  const logout = useAuthStore((state) => state.logOut);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading)
    return <div className="p-4 text-center">Checking session...</div>;

  return !user ? <>{children}</> : null;
};

export default GuestGuard;
