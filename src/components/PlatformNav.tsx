/* eslint-disable react-hooks/rules-of-hooks */

// React
import { useEffect, useState } from "react";

// Components
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Spacer,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AiFillCrown, AiFillHome, AiFillInfoCircle } from "react-icons/ai";
import { BiExit } from "react-icons/bi";
import { FaBuilding, FaUserAlt } from "react-icons/fa";
import { ImTree } from "react-icons/im";
import { MdSensors } from "react-icons/md";

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

  useEffect(() => {
    if (!title) {
      switch (pathname) {
        case "/platform/home":
          setCurrentRouteLabel("Home");
          break;
        case "/platform/event-logs":
          setCurrentRouteLabel("Event Logs");
          break;
        case "/platform/organizations":
          setCurrentRouteLabel("Organizations");
          break;
        case "/platform/organizations/[id]":
          setCurrentRouteLabel("Organization");
          break;
        default:
          setCurrentRouteLabel("");
      }
    }
  }, [pathname]);

  

  return (
    <>
      <Flex
        as="nav"
        display={["none", "flex"]}
        position={"sticky"}
        top={0}
        h={"100vh"}
        w={"250px"}
        py={9}
        flexDir={"column"}
        align={"flex-start"}
        bg={useColorModeValue("white", "gray.800")}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        zIndex={500}
      >
        {/* Title */}
        <Box>
          <Flex
            as={NextLink}
            href={"/"}
            align={"center"}
            transition={"filter 0.2s ease"}
            _hover={{
              filter: useColorModeValue("opacity(0.75)", "brightness(0.75)"),
            }}
            _active={{
              filter: useColorModeValue("opacity(0.5)", "brightness(0.5)"),
            }}
          >
            <Image
              src={useColorModeValue(
                "/images/logo-black.png",
                "/images/logo-white.png"
              )}
              mx={[4, 16]}
              w={"full"}
              h={"24px"}
              alt={"EVE XCS"}
              objectFit={"cover"}
            />
          </Flex>
        </Box>

        <Box w={"full"} py={4}>
          {/* Divider */}
          {/* <Box position={"relative"} p={8} w={"full"} mt={8}>
          <Divider />
          <AbsoluteCenter
            bg={useColorModeValue("white", "gray.800")}
            px={2}
            color={"gray.300"}
            textTransform={"uppercase"}
            fontSize={"sm"}
          >
            Main Menu
          </AbsoluteCenter>
        </Box> */}

          {/* Links */}
          <VStack
            flexDir={"column"}
            align={"flex-start"}
            justify={"flex-start"}
            w={"100%"}
            px={4}
            pt={16}
            spacing={2}
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
              leftIcon={<MdSensors />}
            >
              Event Logs
            </NavLink>
            <NavLink
              href={"/platform/profile"}
              pathname={pathname}
              leftIcon={<FaUserAlt />}
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
        {/* <Box w={"full"} py={8}>
        <Flex
          flexDir={"column"}
          align={"flex-start"}
          justify={"flex-start"}
          bg={useColorModeValue("gray.100", "gray.700")}
          mx={4}
          my={"auto"}
          p={4}
          rounded={"xl"}
          border={"1px solid"}
          borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Heading size={"md"} mb={2}>
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
            leftIcon={<ChevronRightIcon />}
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
          spacing={2}
          mt={"auto"}
        >
          <NavLink
            href={"/platform/help"}
            pathname={pathname}
            leftIcon={<AiFillInfoCircle />}
          >
            Help & Information
          </NavLink>
          <NavLink href={"/logout"} pathname={pathname} leftIcon={<BiExit />}>
            Log Out
          </NavLink>
        </VStack>
      </Flex>
      <Flex flexDir={"column"} w={"full"}>
        {/* Horizontal Bar */}
        <Flex
          as={"header"}
          position={"sticky"}
          top={0}
          w={"full"}
          h={"6rem"}
          align={"center"}
          justify={"space-between"}
          px={8}
          bg={useColorModeValue("white", "gray.800")}
          borderY={"1px solid"}
          borderRight={"1px solid"}
          borderColor={useColorModeValue("gray.300", "gray.700")}
          zIndex={500}
        >
          <Heading size={"lg"}>{currentRouteLabel}</Heading>
          <Flex align={"center"} justify={"flex-end"}>
            <Button variant={"unstyled"} h={"full"} onClick={() => {}}>
              <Avatar
                src={
                  "https://cdn.discordapp.com/attachments/975857519199158292/1101596785606131792/342716556_6948966861786125_4195991580296149283_n.jpg"
                }
              />
            </Button>
          </Flex>
        </Flex>
        {children}
      </Flex>
    </>
  );
}