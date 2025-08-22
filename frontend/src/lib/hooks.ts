import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from './auth';

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = authUtils.getToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);
}

export function useAdminGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = authUtils.getToken();
    const user = authUtils.getUser();

    if (!token) {
      router.push('/login');
      return;
    }

    if (!user || user.role !== 'ADMIN') {
      router.push('/products');
      return;
    }
  }, [router]);
}

export function useRedirectIfAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    const token = authUtils.getToken();
    const user = authUtils.getUser();

    if (token && user) {
      const redirectPath = authUtils.getRedirectPath(user);
      router.push(redirectPath);
    }
  }, [router]);
}
