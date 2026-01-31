import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/auth.service";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, logOut } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          const res = await getMe();
          setUser(res.data);
        }
      } catch (error) {
        logOut();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, setUser, logOut, router]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading WorkNest...
      </div>
    );

  return user ? <>{children}</> : null;
};

export default AuthGuard;
