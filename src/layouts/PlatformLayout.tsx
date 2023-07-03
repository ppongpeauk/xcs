/* eslint-disable react/no-children-prop */

// Next
import { useRouter } from "next/router";

// Components
import Footer from "@/components/Footer";
import PlatformNav from "@/components/PlatformNav";
import { Box, Flex } from "@chakra-ui/react";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const { push } = useRouter();

  // Wait for the router to be ready before checking
  useEffect(() => {
    if (!user) {
      push("/login?redirect=" + window.location.pathname);
    }
  }, [user, push]);

  // Return nothing if the user is not logged in
  return (
    <>
      <Flex w={"100vw"} flexDir={"row"}>
        <PlatformNav
          children={
            <Box width={"full"}>
              <Box as="main" minH={"100vh"}>
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
