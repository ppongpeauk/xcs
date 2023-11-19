/*
 * Name: PlatformLayout.tsx
 * Description: Layout for the control panel
 * Author: Pete Pongpeauk <pete@ppkl.dev>
 *
 * Copyright (c) 2023 Pete Pongpeauk and contributors
 * License: MIT License
 */

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import PlatformNav from '@/components/nav/PlatformNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [firebaseUser, loading] = useAuthState(auth);
  const pathname = usePathname();
  const { push } = useRouter();

  // wait for the router to be ready
  // before checking if the user is logged in
  useEffect(() => {
    if (loading) return;
    if (!pathname) return;
    if (pathname?.startsWith('/@') || (pathname?.startsWith('/organizations/') && !pathname?.endsWith('settings')))
      return;
    setTimeout(() => {
      if (!firebaseUser) {
        push('/auth/login?redirect=' + window.location.pathname);
      }
    }, 500);
  }, [loading, firebaseUser, push, pathname]);

  return (
    <>
      <PlatformNav main={children} />
    </>
  );
}
