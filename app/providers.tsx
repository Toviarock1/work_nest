"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { env } from "@/lib/env";
import { SocketProvider } from "@/components/socketProvider/SocketProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
        // Centralized mutation failure toast — per-call onError still runs first.
        mutationCache: new MutationCache({
          onError: (err, _vars, _ctx, mutation) => {
            if (mutation.options.onError) return; // call site handles it
            const message =
              (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message ||
              (err as Error)?.message ||
              "Something went wrong";
            toast.error(message);
          },
        }),
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        {children}
        {env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </SocketProvider>
    </QueryClientProvider>
  );
}
