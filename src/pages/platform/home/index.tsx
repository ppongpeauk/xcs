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
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { Suspense, useEffect, useState } from "react";

// import { Stat } from "@/components/Stat";

function StatBox({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <Box
      borderRadius={"lg"}
      border={"1px solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
      p={4}
    >
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
        <StatHelpText>{helper}</StatHelpText>
      </Stat>
    </Box>
  );
}
export default function PlatformHome() {
  const { currentUser, user } = useAuthContext();
  const [stats, setStats] = useState({ total: 0, granted: 0, denied: 0 });
  const randomSubGreetings = [
    "Securing your facility starts here.",
    "The first step towards a safer space.",
    "Building trust through access.",
    "Managing access with ease.", 
    "Security made simple.",
    "Where security meets flexibility.",
    "Take control of your entry points.",
    "Custom access when you need it.",
    "Secured access for all.",
    "Grant access with confidence.",
    "Your access authority.",
    "Empowering you with access control.",
    "Expert security at your fingertips.",
    "Intelligent access management.",
    "Seamless security, happy users.",
    "Making security seamless.",
    "Peace of mind, delivered daily.",
    "The intersection of access and trust.",
    "Balancing security and convenience.",
    "Let us handle access so you can focus on your work."
  ];

  const [randomSubGreeting, setRandomSubGreeting] = useState("");

  useEffect(() => {
    if (!user) return;
    setRandomSubGreeting(
      randomSubGreetings[Math.floor(Math.random() * randomSubGreetings.length)]
    );
    user.getIdToken().then((token: string) => {
      fetch("/api/v1/statistics/total-scans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
        });
    });
  }, [user]);

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
            <Text fontSize={"4xl"}>
              Good {new Date().getHours() < 12 ? "morning" : "afternoon"},{" "}
              {currentUser?.displayName || currentUser?.username}.
            </Text>
            <Text fontSize={"xl"} color={"gray.500"}>
              {randomSubGreeting}
            </Text>
          </Skeleton>
          <Box py={8}>
            <Skeleton isLoaded={!!stats.total}>
              <Heading fontSize={"3xl"} mb={4}>
                Global Statistics
              </Heading>
            </Skeleton>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: "5", md: "6" }}
              maxW={"720px"}
            >
              <Skeleton isLoaded={!!stats.total}>
                {/* <Stat label={"Total"} value={`${stats.total} scans total`} /> */}
                <StatBox
                  label={"Total Scans"}
                  value={`${stats.total} scans`}
                  helper={"Since the beginning of time."}
                />
              </Skeleton>
              <Skeleton isLoaded={!!stats.granted}>
                <StatBox
                  label={"Successful Scans"}
                  value={`${stats.granted} scan${
                    stats.granted > 1 ? "s" : ""
                  } (${(stats.granted / stats.total) * 100}%)`}
                  helper={"Scans that were successful."}
                />
              </Skeleton>
              <Skeleton isLoaded={!!stats.denied}>
                <StatBox
                  label={"Failed Scans"}
                  value={`${stats.denied} scan${stats.denied > 1 ? "s" : ""} (${
                    (stats.denied / stats.total) * 100
                  }%)`}
                  helper={"Scans that were denied."}
                />
              </Skeleton>
            </SimpleGrid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

PlatformHome.getLayout = (page: any) => <Layout>{page}</Layout>;
