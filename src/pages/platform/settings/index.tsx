// Components
import {
  Avatar,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Layouts
import Layout from "@/layouts/PlatformLayout";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import SettingsProfile from "@/components/SettingsProfile";
import { FaIdBadge } from "react-icons/fa";

function StyledTab({ children }: { children: React.ReactNode }) {
  return (
    <Tab
      w={"200px"}
      fontSize={["sm", "md"]}
      color={"unset"}
      justifyContent={"left"}
      border={"none"}
      rounded={"lg"}
      fontWeight={"bold"}
      _hover={{
        bg: useColorModeValue("gray.100", "gray.700"),
      }}
      _selected={{
        bg: useColorModeValue("gray.100", "#fff"),
        color: useColorModeValue("black", "gray.900"),
      }}
      _active={{
        bg: useColorModeValue("gray.200", "gray.300"),
        color: useColorModeValue("gray.900", "gray.900"),
      }}
    >
      {children}
    </Tab>
  );
}

export default function Settings() {
  const { query, push } = useRouter();
  const { currentUser, user } = useAuthContext();

  return (
    <>
      <Head>
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:type" content="website" />
      </Head>
      <Container maxW={"full"} p={8}>
        <Text fontSize={"4xl"} fontWeight={"900"}>
          Settings
        </Text>
        <Tabs
          py={4}
          orientation={"vertical"}
          variant={"line"}
          isLazy={true}
          maxW={"full"}
          h={"100%"}
        >
          <TabList
            display={{ base: "none", md: "block" }}
            h={"100%"}
            border={"none"}
          >
            <StyledTab>
              <FaIdBadge />
              <Text ml={2}>Profile</Text>
            </StyledTab>
          </TabList>

          <TabPanels px={{ base: 0, md: 8 }}>
            <TabPanel p={0}>
              <SettingsProfile />
            </TabPanel>
            <TabPanel p={0}>
            </TabPanel>
            <TabPanel p={0}>
              <Text>Members</Text>
            </TabPanel>
            <TabPanel p={0}>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

Settings.getLayout = (page: any) => <Layout>{page}</Layout>;
