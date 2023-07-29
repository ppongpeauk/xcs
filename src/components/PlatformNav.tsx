/* eslint-disable react-hooks/rules-of-hooks */

// React
import { Suspense, useEffect, useState } from "react";

// Components
import DeleteDialog from "@/components/DeleteDialog";
import Footer from "@/components/Footer";
import ThemeButton from "@/components/ThemeButton";
import {
  ChevronRightIcon,
  HamburgerIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import {
  AbsoluteCenter,
  Avatar,
  Box,
  Button,
  ButtonGroup,
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
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import {
  AiFillBell,
  AiFillCrown,
  AiFillHome,
  AiFillInfoCircle,
  AiFillSetting,
} from "react-icons/ai";
import { BiNotification, BiSolidExit, BiSolidTime } from "react-icons/bi";
import { BsPersonBadgeFill } from "react-icons/bs";
import { FaBell, FaBuilding, FaIdBadge, FaUserAlt } from "react-icons/fa";
import { ImTree } from "react-icons/im";
import { MdSensors } from "react-icons/md";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

function AvatarPopover({ currentUser, onLogoutOpen }: { currentUser?: any, onLogoutOpen?: any }) {
  const { push } = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button variant={"unstyled"} h={"full"} onClick={() => {}}>
            <Skeleton
              isLoaded={!!currentUser}
              w={"auto"}
              h={"auto"}
              // border={"2px solid"}
              // borderColor={useColorModeValue("gray.200", "gray.700")}
              borderRadius={"full"}
              overflow={"hidden"}
            >
              <Avatar src={currentUser?.avatar} size={"md"} borderRadius={0} />
            </Skeleton>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          m={0}
          my={{ base: 4, md: 6 }}
          mx={{ base: 0, md: 2 }}
          zIndex={2}
          minW={{ base: "100vw", md: "320px" }}
          w={{ base: "100vw", md: "auto" }}
          bg={useColorModeValue("white", "none")}
          backdropFilter={"blur(2em)"}
          rounded={"xl"}
        >
          <PopoverBody>
            <Stack>
              <Flex
                as={Button}
                onClick={() => {
                  push("/platform/profile");
                  onClose();
                }}
                variant={"ghost"}
                w={"100%"}
                h={"auto"}
                align={"center"}
                rounded={"lg"}
                p={4}
                m={0}
              >
                <Flex flexDir={"column"} align={"flex-start"} w={"min-content"}>
                  <Text
                    fontSize={"xl"}
                    fontWeight={"900"}
                    textOverflow={"ellipsis"}
                  >
                    {currentUser?.displayName}
                  </Text>
                  <Text fontSize={"md"} color={"gray.500"}>
                    @{currentUser?.username}
                  </Text>
                </Flex>
                <Spacer />
                <SkeletonCircle
                  isLoaded={!!currentUser}
                  w={"auto"}
                  h={"auto"}
                  pl={4}
                >
                  <Avatar
                    // name={currentUser?.displayName}
                    src={currentUser?.avatar}
                    size={"lg"}
                  />
                </SkeletonCircle>
              </Flex>
              <Button
                as={NextLink}
                href={"/platform/settings"}
                variant={"outline"}
                size={"md"}
                leftIcon={<AiFillSetting />}
                onClick={() => {
                  onClose();
                }}
              >
                Settings
              </Button>
              <Button
                // as={NextLink}
                // href={"/auth/logout"}
                variant={"outline"}
                size={"md"}
                leftIcon={<BiSolidExit />}
                onClick={() => {
                  onLogoutOpen();
                }}
              >
                Log Out
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

// eslint-disable-next-line react/display-name
const MenuLink = forwardRef((props: any, ref: any) => (
  <Link _hover={{ textDecor: "unset" }} as={NextLink} ref={ref} {...props} />
));

function NavLink({
  href,
  onClick,
  variant = "ghost",
  pathname,
  children,
  leftIcon,
}: {
  href?: string;
  onClick?: () => void;
  variant?: string;
  pathname: string;
  children: React.ReactNode;
  leftIcon: React.ReactElement;
}) {
  return (
    <Button
      as={!onClick ? NextLink : undefined}
      href={!onClick ? href : undefined}
      variant={pathname === href ? "solid" : variant}
      onClick={onClick}
      leftIcon={
        leftIcon ? (
          <Box mr={2} fontSize={"2xl"}>
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
      rounded={"lg"}
      // fontSize={"lg"}
      fontWeight={"900"}
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
}: {
  type?: string;
  title?: string | null | undefined;
}) {
  const pathname = usePathname();
  const { currentUser, isAuthLoaded } = useAuthContext();
  const {
    isOpen: isLogoutOpen,
    onOpen: onLogoutOpen,
    onClose: onLogoutClose,
  } = useDisclosure();
  const { push } = useRouter();

  return (
    <>
      <DeleteDialog
        isOpen={isLogoutOpen}
        onClose={onLogoutClose}
        onDelete={() => {
          onLogoutClose();
          push("/auth/logout");
        }}
        title={"Log Out"}
        body={"Are you sure you want to log out?"}
        buttonText={"Log Out"}
      />
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
            <Flex position={"relative"} w={"172px"} h={"100%"}>
              <NextImage
                src={useColorModeValue(
                  "/images/logo-black.png",
                  "/images/logo-white.png"
                )}
                priority={true}
                fill={true}
                quality={48}
                alt={"Restrafes XCS"}
                style={{
                  objectFit: "contain",
                }}
              />
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
            href={"https://xcs-docs.restrafes.co/"}
            pathname={pathname}
            leftIcon={<AiFillInfoCircle />}
          >
            Help & Information
          </NavLink>
          {currentUser ? (
            <NavLink
              // href={"/auth/logout"}
              onClick={onLogoutOpen}
              pathname={pathname}
              leftIcon={<BiSolidExit />}
            >
              Log Out
            </NavLink>
          ) : (
            <NavLink
              href={"/auth/login"}
              pathname={pathname}
              leftIcon={<BiSolidExit />}
            >
              Log In
            </NavLink>
          )}
        </VStack>
      </Flex>

      <Flex
        flexDir={"row"}
        id="platform-nav-horizontal"
        position={"sticky"}
        top={0}
        zIndex={499}
      >
        {/* Horizontal Bar */}
        <Flex
          as={"header"}
          w={"100vw"}
          h={"6rem"}
          align={"center"}
          justify={"space-between"}
          px={8}
          bg={useColorModeValue("white", "gray.800")}
          borderY={"1px solid"}
          borderX={"1px solid"}
          borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Flex
            as={NextLink}
            href={"/platform/home"}
            display={{ base: "flex", md: "none" }}
            position={"relative"}
            w={"64px"}
            h={"100%"}
          >
            <NextImage
              src={useColorModeValue(
                "/images/logo-black.png",
                "/images/logo-white.png"
              )}
              priority={true}
              fill={true}
              quality={50}
              alt={"Restrafes XCS"}
              style={{
                objectFit: "contain",
              }}
            />
          </Flex>
          <Spacer />

          <HStack align={"center"} justify={"flex-end"} spacing={4}>
            {/* Notifications */}
            {/* <Popover>
              <PopoverTrigger>
                <Button
                  variant={"unstyled"}
                  rounded={"full"}
                  onClick={() => {}}
                  aria-label="Notifications"
                >
                  {<FaBell size={24} />}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                m={0}
                my={{ base: 5, md: 7 }}
                mx={{ base: 0, md: 2 }}
                zIndex={2}
                minW={{ base: "100vw", md: "320px" }}
                bg={useColorModeValue("white", "none")}
                backdropFilter={"blur(2em)"}
                rounded={"xl"}
              >
                <PopoverCloseButton />
                <PopoverHeader>
                  <Text fontWeight={"900"}>Notifications</Text>
                </PopoverHeader>
                <PopoverBody>
                  <Text fontSize={"md"}>The service is unavailable.</Text>
                </PopoverBody>
              </PopoverContent>
            </Popover> */}

            {/* Avatar */}
            <AvatarPopover currentUser={currentUser} onLogoutOpen={onLogoutOpen} />

            {/* Theme Button */}
            {/* <Box display={{ base: "none", md: "flex" }}>
              <ThemeButton />
            </Box> */}

            {/* Mobile Nav */}
            <Box display={{ base: "flex", md: "none" }} zIndex={512}>
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
                    href="https://xcs-docs.restrafes.co/"
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
    </>
  );
}
