/* eslint-disable react/no-children-prop */
// Next
import { useEffect, useState } from 'react';

import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Flex, Stack, useToast } from '@chakra-ui/react';

import firebase from 'firebase/app';
import { sendEmailVerification } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Components
import Footer from '@/components/Footer';
import PlatformAlert from '@/components/PlatformAlert';
import PlatformNav from '@/components/PlatformNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, currentUser, isAuthLoaded } = useAuthContext();
  const [firebaseUser, loading, error] = useAuthState(auth);
  const [sendVerificationEmailLoading, setSendVerificationEmailLoading] = useState<boolean>(false);
  const { push } = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // Wait for the router to be ready before checking if the user is logged in
  useEffect(() => {
    if (loading) return;
    // if (pathname.startsWith("/platform/profile")) return;
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
  }, [loading]);

  // Return nothing if the user is not logged in
  return (
    <>
      <PlatformNav />
      <Box
        as={'main'}
        pos={'relative'}
        left={{ base: 0, md: '240px' }}
        w={{ base: '100%', md: 'calc(100% - 240px)' }}
        flexGrow={1}
      >
        <Flex
          pos={'sticky'}
          top={'6rem'}
          flexGrow={1}
          zIndex={1}
        >
          <Stack
            id={'alerts'}
            backdropFilter={'blur(24px)'}
            spacing={0}
            w={'full'}
            h={'full'}
          >
            {/* Email not verified */}
            {currentUser && (
              <>
                {/* Email not verified */}
                {!user?.emailVerified && (
                  <PlatformAlert
                    title={'Action needed'}
                    description={'Please verify your email address to continue using Restrafes XCS.'}
                    isClosable={true}
                    button={{
                      text: 'Resend verification email',
                      isLoading: sendVerificationEmailLoading,
                      onClick: async () => {
                        setSendVerificationEmailLoading(true);
                        await sendEmailVerification(user).finally(() => {
                          setSendVerificationEmailLoading(false);
                        });
                      }
                    }}
                  />
                )}
                {/* Roblox account not verified */}
                {!currentUser?.roblox.verified && (
                  <PlatformAlert
                    title={'Action needed'}
                    description={'Please verify your Roblox account to continue using Restrafes XCS.'}
                    isClosable={true}
                    button={{
                      text: 'Verify Roblox account',
                      onClick: async () => {
                        push(`https://apis.roblox.com/oauth/v1/authorize?client_id=${process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_ROOT_URL}/platform/verify/oauth2/roblox&scope=openid profile&response_type=code`);
                      }
                    }}
                  />
                )}
              </>
            )}
          </Stack>
        </Flex>
        {
          process.env.NODE_ENV === 'development' && (
            <Alert status={'warning'} rounded={'none'} mb={0}>
              <AlertIcon />
              <AlertTitle mr={2}>Development Mode</AlertTitle>
              <AlertDescription>
                This website is currently running in development mode.
              </AlertDescription>
            </Alert>
          )
        }
        <Box minH={'calc(100vh - 6rem)'}>{children}</Box>
      </Box>
    </>
  );
}
