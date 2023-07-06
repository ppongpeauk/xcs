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
} from "@chakra-ui/react";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

import PlatformAlert from "@/components/PlatformAlert";
import { auth } from "@/lib/firebase";
import firebase from "firebase/app";
import { sendEmailVerification } from "firebase/auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, currentUser } = useAuthContext();
  const [sendVerificationEmailLoading, setSendVerificationEmailLoading] = useState<boolean>(false);
  const { push } = useRouter();

  // Wait for the router to be ready before checking
  async function waitForAuthInit() {
    let unsubscribe = null;
    await new Promise<void>((resolve) => {
      unsubscribe = auth.onAuthStateChanged((_) => resolve());
    });
    (await unsubscribe!)();
  }

  useEffect(() => {
    
    async function checkUser() {
      // Wait for auth to initialize before checking if the user is logged in
      await waitForAuthInit().then(async () => {
        if (!user) {
          await push("/auth/login?redirect=" + window.location.pathname);
        }
      });
    }
    checkUser();
  }, [user, push]);

  // Return nothing if the user is not logged in
  return (
    <>
      <Flex w={"100vw"} flexDir={"row"}>
        <PlatformNav
          children={
            <Box width={"full"}>
              <Box as="main" minH={"calc(100vh - 6rem)"}>
                {/* Alerts */}
                <Stack
                  id={"alerts"}
                  pos={"sticky"}
                  top={"6rem"}
                  zIndex={500}
                  backdropFilter={"blur(24px)"}
                  spacing={0}
                >
                  {/* Email not verified */}
                  {
                    (currentUser && !user.emailVerified) && (
                      <PlatformAlert
                        title={"Email not verified"}
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
                          }
                        }}
                      />
                    )
                  }
                </Stack>
                {/* Children */}
                {children}
              </Box>
              <Footer />
            </Box>
          }
        />
      </Flex>
    </>
  );
}
