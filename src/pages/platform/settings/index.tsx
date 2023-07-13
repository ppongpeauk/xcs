// Components
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";

// Layouts
import Layout from "@/layouts/PlatformLayout";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import SettingsAppearance from "@/components/SettingsAppearance";
import SettingsLinkedAccounts from "@/components/SettingsLinkedAccounts";
import SettingsProfile from "@/components/SettingsProfile";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaIdBadge, FaLink } from "react-icons/fa";

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
  const [index, setIndex] = useState(0);

  return (
    <>
      <Head>
        <title>EVE XCS – Settings</title>
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Settings" />
      </Head>
      <Container maxW={"full"} p={8}>
        <Text fontSize={"4xl"} fontWeight={"900"}>
          Settings
        </Text>
        <Box display={{ base: "block", md: "none" }} pt={4}>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              aria-label={"Menu"}
              w={"full"}
            />
            <MenuList>
              <MenuItem
                onClick={() => {
                  setIndex(0);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIndex(1);
                }}
              >
                Appearance
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIndex(2);
                }}
              >
                Linked Accounts
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Tabs
          py={4}
          orientation={"vertical"}
          variant={"line"}
          isLazy={true}
          maxW={"full"}
          h={"100%"}
          index={index}
          onChange={setIndex}
        >
          <TabList
            display={{ base: "none", md: "block" }}
            h={"100%"}
            border={"none"}
          >
            <StyledTab>
              <Text>Profile</Text>
            </StyledTab>
            <StyledTab>
              <Text>Appearance</Text>
            </StyledTab>
            <StyledTab>
              <Text>Linked Accounts</Text>
            </StyledTab>
          </TabList>

          <TabPanels px={{ base: 0, md: 8 }}>
            <TabPanel p={0}>
              <Text fontSize={"3xl"} fontWeight={"bold"}>
                Profile
              </Text>
              <Text fontSize={"md"} color={"gray.500"}>
                This is how you appear to other users.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsProfile />
            </TabPanel>
            <TabPanel p={0}>
              <Text fontSize={"3xl"} fontWeight={"bold"}>
                Appearance
              </Text>
              <Text fontSize={"md"} color={"gray.500"}>
                Customize the appearance of the app.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsAppearance />
            </TabPanel>
            <TabPanel p={0}>
              <Text fontSize={"3xl"} fontWeight={"bold"}>
                Linked Accounts
              </Text>
              <Text fontSize={"md"} color={"gray.500"}>
                Link your accounts to verify your identity.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsLinkedAccounts />
            </TabPanel>
            <TabPanel p={0}></TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

Settings.getLayout = (page: any) => <Layout>{page}</Layout>;
