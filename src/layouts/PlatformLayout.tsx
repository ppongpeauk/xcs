/* eslint-disable react/no-children-prop */

// Next
import { useRouter } from "next/router";

// Components
import Footer from "@/components/Footer";
import PlatformNav from "@/components/PlatformNav";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Flex,
  Stack,
  useToast,
} from "@chakra-ui/react";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

import PlatformAlert from "@/components/PlatformAlert";
import { auth } from "@/lib/firebase";
import firebase from "firebase/app";
import { sendEmailVerification } from "firebase/auth";
import { usePathname } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, currentUser, isAuthLoaded } = useAuthContext();
  const [loading, error] = useAuthState(auth);
  const [sendVerificationEmailLoading, setSendVerificationEmailLoading] =
    useState<boolean>(false);
  const { push } = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  // Wait for the router to be ready before checking if the user is logged in
  useEffect(() => {
    if (loading) return;
    // if (pathname.startsWith("/platform/profile")) return;
    setTimeout(() => {
      if (!user) {
        push("/auth/login?redirect=" + window.location.pathname);
        toast({
          title: "You are not logged in",
          description: "Please log in to continue.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }, 500);
  }, [loading]);

  // Return nothing if the user is not logged in
  return (
    <>
      <PlatformNav />
      <Box
        as={"main"}
        pos={"relative"}
        left={{ base: 0, md: "240px" }}
        w={{ base: "100vw", md: "calc(100vw - 240px)" }}
        flexGrow={1}
      >
        <Flex pos={"sticky"} top={"6rem"} flexGrow={1} zIndex={1}>
          <Stack
            id={"alerts"}
            backdropFilter={"blur(24px)"}
            spacing={0}
            w={"full"}
            h={"full"}
          >
            {/* Email not verified */}
            {currentUser && (
              <>
                {/* Email not verified */}
                {!user?.emailVerified && (
                  <PlatformAlert
                    title={"Action needed"}
                    description={
                      "Please verify your email address to continue using EVE XCS."
                    }
                    isClosable={true}
                    button={{
                      text: "Resend verification email",
                      isLoading: sendVerificationEmailLoading,
                      onClick: async () => {
                        setSendVerificationEmailLoading(true);
                        await sendEmailVerification(user).finally(() => {
                          setSendVerificationEmailLoading(false);
                        });
                      },
                    }}
                  />
                )}
                {/* Roblox account not verified */}
                {!currentUser?.roblox.verified && (
                  <PlatformAlert
                    title={"Action needed"}
                    description={
                      "Please verify your Roblox account to continue using EVE XCS."
                    }
                    isClosable={true}
                    button={{
                      text: "Verify Roblox account",
                      onClick: async () => {
                        push("/platform/verify");
                      },
                    }}
                  />
                )}
              </>
            )}
          </Stack>
        </Flex>
        <Box minH={"calc(100vh - 6rem)"}>{children}</Box>
      </Box>
    </>
  );
}
