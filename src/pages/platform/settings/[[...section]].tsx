// Components
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Icon,
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
  useToast,
} from "@chakra-ui/react";

// Layouts
import Layout from "@/layouts/PlatformLayout";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import SettingsAdmin from "@/components/SettingsAdmin";
import SettingsAppearance from "@/components/SettingsAppearance";
import SettingsLinkedAccounts from "@/components/SettingsLinkedAccounts";
import SettingsProfile from "@/components/SettingsProfile";
import { HamburgerIcon } from "@chakra-ui/icons";
import { BiSolidUserBadge, BiSolidUserDetail } from "react-icons/bi";
import { FaIdBadge, FaLink, FaPaintBrush } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { RiAdminFill } from "react-icons/ri";

function StyledTab({
  children,
  index,
  icon,
}: {
  children: React.ReactNode;
  index: number;
  icon?: any;
}) {
  const { push } = useRouter();

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
      _active={{
        bg: useColorModeValue("gray.200", "gray.600"),
        color: useColorModeValue("gray.900", "white"),
      }}
      _selected={{
        bg: useColorModeValue("gray.100", "#fff"),
        color: useColorModeValue("black", "gray.900"),
      }}
      onClick={() => {
        push(`/platform/settings/${index + 1}`);
      }}
    >
      {icon ? <Icon as={icon} mr={2} /> : null}
      {children}
    </Tab>
  );
}

export default function Settings() {
  const { query, push } = useRouter();
  const toast = useToast();
  const { currentUser, user } = useAuthContext();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    query.section && setIndex(parseInt(query.section as string) - 1);
  }, [query]);

  useEffect(() => {
    if (!query.discordLinked) return;
    if (query.discordLinked === "true") {
      toast({
        title: "Successfully linked your Discord account.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "There was an error linking your Discord account.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [query]);

  return (
    <>
      <Head>
        <title>EVE XCS – Settings</title>
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Settings" />
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>Settings</Heading>
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
              {currentUser?.platform.staff && (
                <MenuItem
                  onClick={() => {
                    setIndex(3);
                  }}
                >
                  Admin Settings
                </MenuItem>
              )}
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
          isManual={true}
        >
          <TabList
            display={{ base: "none", md: "block" }}
            h={"100%"}
            border={"none"}
          >
            <StyledTab index={0} icon={BiSolidUserDetail}>
              <Text>Profile</Text>
            </StyledTab>
            <StyledTab index={1} icon={FaPaintBrush}>
              <Text>Appearance</Text>
            </StyledTab>
            <StyledTab index={2} icon={FiExternalLink}>
              <Text>Linked Accounts</Text>
            </StyledTab>
            {currentUser?.platform.staff && (
              <StyledTab index={3} icon={RiAdminFill}>
                <Text>Admin Settings</Text>
              </StyledTab>
            )}
          </TabList>

          <TabPanels px={{ base: 0, md: 8 }}>
            <TabPanel p={0}>
              <Heading>Profile</Heading>
              <Text fontSize={"md"} color={"gray.500"}>
                This is how you appear to other users.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsProfile />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Appearance</Heading>
              <Text fontSize={"md"} color={"gray.500"}>
                Customize the appearance of the website.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsAppearance />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Linked Accounts</Heading>
              <Text fontSize={"md"} color={"gray.500"}>
                Link your accounts to verify your identity.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsLinkedAccounts />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Admin Settings</Heading>
              <Text fontSize={"md"} color={"gray.500"}>
                Super secret admin settings.
              </Text>
              <Divider mt={4} mb={8} />
              <SettingsAdmin />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

Settings.getLayout = (page: any) => <Layout>{page}</Layout>;
