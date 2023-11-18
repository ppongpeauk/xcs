// React
import { useContext, useEffect } from 'react';

// Next
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';
import { Center, Loader } from '@mantine/core';

export default function Logout() {
  const router = useRouter();
  const { logOut, isAuthLoaded, user } = useAuthContext();

  useEffect(() => {
    logOut();
  }, [logOut]);

  useEffect(() => {
    if (!isAuthLoaded) return;
    if (!user) {
      router.push('/auth/login');
    }
  }, [isAuthLoaded, user, router]);

  return (
    <>
      <Center h="100vh">
        <Loader
          size={'md'}
          color="var(--mantine-color-default-color)"
        />
      </Center>
    </>
  );
}
