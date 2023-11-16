/* eslint-disable react/no-children-prop */
// Next
import { useEffect, useState } from 'react';

import { Flex, Stack, useToast } from '@chakra-ui/react';
import { Box, useMantineColorScheme } from '@mantine/core';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase';
import { Alert as AlertType } from '@/types';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Components
import Footer from '@/components/FooterNew';
import PlatformAlert from '@/components/PlatformAlert';
import PlatformNav from '@/components/nav/PlatformNav';
import PlatformNavNew from '@/components/nav/PlatformNavNew';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, currentUser, isAuthLoaded } = useAuthContext();
  const [firebaseUser, loading, error] = useAuthState(auth);
  const { colorScheme } = useMantineColorScheme();

  const [sendVerificationEmailLoading, setSendVerificationEmailLoading] = useState<boolean>(false);

  const { push } = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // platform alerts
  const [alerts, setAlerts] = useState<any[]>([]);

  // Wait for the router to be ready before checking if the user is logged in
  useEffect(() => {
    if (loading) return;
    if (!pathname) return;
    if (pathname?.startsWith('/@') || (pathname?.startsWith('/organizations/') && !pathname?.endsWith('settings')))
      return;
    setTimeout(() => {
      if (!firebaseUser) {
        push('/auth/login?redirect=' + window.location.pathname);
        toast({
          title: 'You are not logged in',
          description: 'Please log in to continue.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }, 500);
  }, [loading, firebaseUser, push, toast, pathname]);

  // get platform alerts
  useEffect(() => {
    fetch('/api/v1/platform/alerts').then(async (res) => {
      const data = await res.json();
      setAlerts(data);
    });
  }, [firebaseUser]);

  // Return nothing if the user is not logged in
  return (
    <>
      <PlatformNavNew main={children} />
    </>
  );
}
