"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  // Check for an existing token client-side after mount.
  // Skipping the session check entirely when there's no token avoids the
  // network round-trip that previously caused "Checking session..." delay.
  // Cookies aren't accessible during SSR, so we must read + setState after mount.
  useEffect(() => {
    if (typeof document === "undefined") return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setHasToken(/(?:^|;\s*)accessToken=/.test(document.cookie));
  }, []);

  const { user } = useUser({ enabled: hasToken });

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  return <>{children}</>;
};

export default GuestGuard;
