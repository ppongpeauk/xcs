/* eslint-disable react-hooks/rules-of-hooks */

// React
import { Suspense, useEffect, useState } from "react";

// Components
import Footer from "@/components/Footer";
import ThemeButton from "@/components/ThemeButton";
import { ChevronRightIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  Code,
  Container,
  Divider,
  Flex,
  HStack,
  Heading,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  SkeletonCircle,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import {
  AiFillCrown,
  AiFillHome,
  AiFillInfoCircle,
  AiFillSetting,
} from "react-icons/ai";
import { BiSolidExit, BiSolidTime } from "react-icons/bi";
import { BsPersonBadgeFill } from "react-icons/bs";
import { FaBuilding, FaIdBadge, FaUserAlt } from "react-icons/fa";
import { ImTree } from "react-icons/im";
import { MdSensors } from "react-icons/md";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";

// eslint-disable-next-line react/display-name
const MenuLink = forwardRef((props: any, ref: any) => (
  <Link _hover={{ textDecor: "unset" }} as={NextLink} ref={ref} {...props} />
));

function NavLink({
  href,
  variant = "ghost",
  pathname,
  children,
  leftIcon,
}: {
  href: string;
  variant?: string;
  pathname: string;
  children: React.ReactNode;
  leftIcon: React.ReactElement;
}) {
  return (
    <Button
      as={NextLink}
      variant={pathname === href ? "solid" : variant}
      href={href}
      leftIcon={
        leftIcon ? (
          <Box mr={2} fontSize={"xl"}>
            {leftIcon}
          </Box>
        ) : (
          <></>
        )
      }
      w={"full"}
      justifyContent={"flex-start"}
      m={0}
      px={4}
      py={6}
      rounded={"xl"}
      color={
        pathname === href
          ? useColorModeValue("gray.100", "gray.900")
          : useColorModeValue("gray.900", "gray.100")
      }
      bg={
        pathname === href ? useColorModeValue("gray.900", "gray.200") : "none"
      }
      _hover={
        pathname === href
          ? {}
          : {
              color: useColorModeValue("gray.900", "gray.100"),
              bg: useColorModeValue("gray.100", "gray.700"),
            }
      }
      _active={
        pathname === href
          ? {
              color: useColorModeValue("gray.100", "gray.900"),
              bg: useColorModeValue("gray.700", "gray.400"),
            }
          : {
              color: useColorModeValue("gray.900", "gray.100"),
              bg: useColorModeValue("gray.200", "gray.600"),
            }
      }
    >
      {children}
    </Button>
  );
}

export default function PlatformNav({
  type,
  title,
  children,
}: {
  type?: string;
  title?: string | null | undefined;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentRouteLabel, setCurrentRouteLabel] = useState<string | null>("");
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (!title) {
      switch (pathname) {
        // case "/platform/home":
        //   setCurrentRouteLabel("Home");
        //   break;
        // case "/platform/event-logs":
        //   setCurrentRouteLabel("Event Logs");
        //   break;
        // case "/platform/organizations":
        //   setCurrentRouteLabel("Organizations");
        //   break;
        // case "/platform/organizations/[id]":
        //   setCurrentRouteLabel("Organization");
        //   break;
        // case "/platform/locations":
        //   setCurrentRouteLabel("Locations");
        //   break;
        default:
          setCurrentRouteLabel("");
      }
    }
  }, [pathname]);

  return (
    <>
      <Flex
        id="platform-nav"
        as="nav"
        display={{ base: "none", md: "flex" }}
        position={"fixed"}
        top={0}
        h={"100vh"}
        w={"240px"}
        flexDir={"column"}
        align={"flex-start"}
        bg={useColorModeValue("white", "gray.800")}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        zIndex={500}
      >
        {/* Title */}
        <Flex
          transform={"translateY(-1px)"}
          h={"6rem"}
          width={"full"}
          borderBottom={"1px solid"}
          borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Flex
            as={NextLink}
            width={"full"}
            h={"full"}
            href={"/platform/home"}
            align={"center"}
            justify={"center"}
            transition={"filter 0.2s ease"}
            _hover={{
              filter: useColorModeValue("opacity(0.75)", "brightness(0.75)"),
            }}
            _active={{
              filter: useColorModeValue("opacity(0.5)", "brightness(0.5)"),
            }}
          >
            <Flex position={"relative"} w={"128px"} h={"100%"}>
              <NextImage
                src={useColorModeValue(
                  "/images/logo-black.png",
                  "/images/logo-white.png"
                )}
                priority={true}
                fill={true}
                alt={"EVE XCS"}
                style={{
                  objectFit: "contain",
                }}
              />
              {/* <Code
                ml={2}
                fontSize={"xs"}
                h={"fit-content"}
                px={"4px"}
                fontWeight={"bold"}
                bg={useColorModeValue("gray.900", "white")}
                color={useColorModeValue("white", "gray.900")}
              >
                BETA
              </Code> */}
            </Flex>
          </Flex>
        </Flex>

        <Box w={"full"}>
          {/* Links */}
          <VStack
            flexDir={"column"}
            align={"flex-start"}
            justify={"flex-start"}
            w={"100%"}
            px={4}
            py={8}
            spacing={1}
          >
            <NavLink
              href={"/platform/home"}
              pathname={pathname}
              leftIcon={<AiFillHome />}
            >
              Home
            </NavLink>
            <NavLink
              href={"/platform/event-logs"}
              pathname={pathname}
              leftIcon={<BiSolidTime />}
            >
              Event Logs
            </NavLink>
            <NavLink
              href={"/platform/profile"}
              pathname={pathname}
              leftIcon={<FaIdBadge />}
            >
              Profile
            </NavLink>
            <NavLink
              href={"/platform/organizations"}
              pathname={pathname}
              leftIcon={<FaBuilding />}
            >
              Organizations
            </NavLink>
            <NavLink
              href={"/platform/locations"}
              pathname={pathname}
              leftIcon={<ImTree />}
            >
              Locations
            </NavLink>
          </VStack>
        </Box>

        {/* Upgrade Prompt */}
        {/* <Box w={"full"}>
          <Flex
            flexDir={"column"}
            align={"flex-start"}
            justify={"flex-start"}
            bg={useColorModeValue("gray.100", "gray.700")}
            mx={4}
            p={4}
            rounded={"xl"}
            border={"1px solid"}
            borderColor={useColorModeValue("gray.300", "gray.700")}
          >
            <Heading size={"sm"} mb={2}>
              Upgrade to XCS PRO
            </Heading>
            <Text alignSelf={"center"} fontSize={"sm"} pb={4}>
              Upgrade to unlock more features and functionality.
            </Text>
            <Button
              as={NextLink}
              href={"/platform/upgrade"}
              variant={"solid"}
              colorScheme={"blue"}
              size={"sm"}
              alignSelf={"center"}
              px={8}
            >
              Upgrade
            </Button>
          </Flex>
        </Box> */}

        <VStack
          flexDir={"column"}
          align={"flex-start"}
          justify={"flex-start"}
          w={"100%"}
          px={4}
          py={8}
          spacing={1}
          mt={"auto"}
        >
          <NavLink
            href={"https://discord.gg/983DXK26"}
            pathname={pathname}
            leftIcon={<AiFillInfoCircle />}
          >
            Help & Information
          </NavLink>
          <NavLink
            href={"/auth/logout"}
            pathname={pathname}
            leftIcon={<BiSolidExit />}
          >
            Log Out
          </NavLink>
        </VStack>
      </Flex>

      <Flex flexDir={"column"} id="platform-nav-horizontal">
        {/* Horizontal Bar */}
        <Flex
          as={"header"}
          position={"fixed"}
          top={0}
          w={"100vw"}
          h={"6rem"}
          align={"center"}
          justify={"space-between"}
          px={8}
          bg={useColorModeValue("white", "gray.800")}
          borderY={"1px solid"}
          borderX={"1px solid"}
          borderColor={useColorModeValue("gray.300", "gray.700")}
          zIndex={499}
        >
          {/* Route Label (inactive) */}
          {/* <Heading size={"lg"}>EVE XCS</Heading> */}
          <Flex
            as={NextLink}
            href={"/platform/home"}
            display={{ base: "flex", md: "none" }}
            position={"relative"}
            w={"128px"}
            h={"100%"}
          >
            <NextImage
              src={useColorModeValue(
                "/images/logo-black.png",
                "/images/logo-white.png"
              )}
              priority={true}
              fill={true}
              alt={"EVE XCS"}
              style={{
                objectFit: "contain",
              }}
            />
          </Flex>

          <HStack align={"center"} justify={"flex-end"} spacing={4} ml={"auto"}>
            {/* Avatar */}
            <Button variant={"unstyled"} h={"full"} onClick={() => {}}>
              <SkeletonCircle isLoaded={!!currentUser} w={"auto"} h={"auto"}>
                <Avatar src={currentUser?.avatar} size={"md"} />
              </SkeletonCircle>
            </Button>

            {/* Theme Button */}
            <Box display={{ base: "none", md: "flex" }}>
              <ThemeButton />
            </Box>

            {/* Mobile Nav */}
            <Box display={{ base: "flex", md: "none" }}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HamburgerIcon />}
                  variant={"solid"}
                  aria-label="Options"
                />
                <MenuList>
                  <MenuItem
                    as={MenuLink}
                    icon={<AiFillHome />}
                    href="/platform/home"
                  >
                    Home
                  </MenuItem>
                  <MenuItem
                    as={MenuLink}
                    icon={<BiSolidTime />}
                    href="/platform/event-logs"
                  >
                    Event Logs
                  </MenuItem>
                  <MenuItem
                    as={MenuLink}
                    icon={<FaIdBadge />}
                    href="/platform/profile"
                  >
                    Profile
                  </MenuItem>
                  <MenuItem
                    as={MenuLink}
                    icon={<FaBuilding />}
                    href="/platform/organizations"
                  >
                    Organizations
                  </MenuItem>
                  <MenuItem
                    as={MenuLink}
                    icon={<ImTree />}
                    href="/platform/locations"
                  >
                    Locations
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    as={MenuLink}
                    icon={<AiFillSetting />}
                    href="/platform/settings"
                  >
                    Settings
                  </MenuItem>
                  <MenuItem
                    as={MenuLink}
                    icon={<AiFillInfoCircle />}
                    href="https://discord.gg/983DXK26"
                  >
                    Help & Information
                  </MenuItem>
                  <ThemeButton menu={true} />
                  <MenuDivider />
                  <MenuItem
                    as={MenuLink}
                    icon={<BiSolidExit />}
                    href="/auth/logout"
                  >
                    Log Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        </Flex>
      </Flex>
      <Box
        id="platform-content"
        position={"relative"}
        top={"6rem"}
        left={{ base: 0, md: "240px" }}
        w={{ base: "100vw", md: "calc(100% - 240px)" }}
        h={"100vh"}
        overflow={"auto"}
        pb={{ base: "6rem", md: 0 }}
      >
        {children}
      </Box>
    </>
  );
}
