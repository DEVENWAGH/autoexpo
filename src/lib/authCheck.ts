import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuthCheck(redirectPath: string = '/login') {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(redirectPath);
    }
  }, [session, status, router, redirectPath]);

  return { session, isLoading: status === 'loading', isAuthenticated: !!session };
}
