'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const PUBLIC_ROUTES = ['/login', '/home'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_ROUTES.includes(pathname ?? '');

  useEffect(() => {
    if (!isAuthenticated && !isPublic) {
      router.replace('/home');
    }
  }, [isAuthenticated, pathname, router, isPublic]);

  if (!pathname) return null;

  if (!isAuthenticated && !isPublic) {
    return null;
  }

  return <>{children}</>;
}
