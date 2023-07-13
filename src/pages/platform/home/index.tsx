import { useAuthContext } from "@/contexts/AuthContext";
import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Card,
  CardHeader,
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import { Suspense } from "react";

import { Stat } from "@/components/Stat";

const stats = [
  { label: "Total Scans", value: "71,887" },
  { label: "Successful Scans", value: "56.87%" },
  { label: "Unsuccessful Scans", value: "12.87%" },
];
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
          <Skeleton isLoaded={!!currentUser}>
            <Text fontSize={"4xl"} fontWeight={"900"}>
              Good {new Date().getHours() < 12 ? "morning" : "afternoon"},{" "}
              {currentUser?.displayName || currentUser?.username}!
            </Text>
          </Skeleton>
          <Box py={8}>
            <Text fontSize={"3xl"} mb={4}>Global Statistics</Text>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: "5", md: "6" }}
            >
              {stats.map(({ label, value }) => (
                <Stat key={label} label={label} value={value} />
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

PlatformHome.getLayout = (page: any) => <Layout>{page}</Layout>;
