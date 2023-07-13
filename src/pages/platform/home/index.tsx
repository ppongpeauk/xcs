import { useAuthContext } from "@/contexts/AuthContext";
import Layout from "@/layouts/PlatformLayout";
import { Box, Card, CardHeader, Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";
import { Suspense } from "react";
export default function PlatformHome() {
  const { currentUser } = useAuthContext();

  return (
    <>
      <Head>
        <title>EVE XCS – Home</title>
        <meta property="og:title" content="EVE XCS - Platform Home" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.jpeg" />
      </Head>
      <Container maxW={"full"} p={8}>
        {/* Greeting */}
        <Box id={"greeting"}>
          <Text fontSize={"4xl"} fontWeight={"900"}>
            Good {new Date().getHours() < 12 ? "morning" : "afternoon"},{" "}
            {currentUser?.displayName || currentUser?.username}!
          </Text>
          <Text fontSize={"xl"} fontWeight={"500"}>
            This page is still under construction.
          </Text>
        </Box>
      </Container>
    </>
  );
}

PlatformHome.getLayout = (page: any) => <Layout>{page}</Layout>;
