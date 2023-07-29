// Components
import ThemeButton from "@/components/ThemeButton";
import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Code,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Skeleton,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextImage from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import { BiSolidLogIn } from "react-icons/bi";
import { IoCube } from "react-icons/io5";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import { Suspense, forwardRef } from "react";

// eslint-disable-next-line react/display-name
const MenuLink = forwardRef((props: any, ref: any) => (
  <Link _hover={{ textDecor: "unset" }} as={NextLink} ref={ref} {...props} />
));

function NavLink({
  href,
  variant = "ghost",
  pathname,
  children,
}: {
  href: string;
  variant?: string;
  pathname: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      as={NextLink}
      variant={pathname === href ? "solid" : variant}
      href={href}
    >
      {children}
    </Button>
  );
}

export default function Nav({ type }: { type?: string }) {
  const { currentUser, isAuthLoaded } = useAuthContext();
  const pathname = usePathname();

  return (
    <Suspense>
      <Flex
        as="nav"
        position={"sticky"}
        top={0}
        // w={"100vw"}
        h={"6rem"}
        align={"center"}
        bg={useColorModeValue("white", "gray.800")}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        zIndex={50}
      >
        {/* Title */}
        <Flex
          align={"center"}
          justify={"center"}
          w={"240px"}
          h={"full"}
          // borderRight={"1px solid"}
          // borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Flex
            as={NextLink}
            href={"/"}
            align={"center"}
            justify={"center"}
            h={"100%"}
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
        <Spacer />
        {/* Links */}
        <HStack
          align={"center"}
          h={"100%"}
          px={[4, 8]}
          // borderLeft={"1px solid"}
          // borderColor={useColorModeValue("gray.200", "gray.700")}
          spacing={2}
        >
          <Box display={{ base: "none", md: "flex" }}>
            <Skeleton isLoaded={isAuthLoaded}>
              {currentUser ? (
                <NavLink href={"/platform/home"} pathname={pathname}>
                  Control Panel
                </NavLink>
              ) : (
                <NavLink href={"/auth/login"} pathname={pathname}>
                  Login
                </NavLink>
              )}
            </Skeleton>
          </Box>

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
                <MenuItem as={MenuLink} icon={<AiFillHome />} href="/">
                  Home
                </MenuItem>
                {currentUser ? (
                  <MenuItem
                    as={MenuLink}
                    icon={<IoCube />}
                    href="/platform/home"
                  >
                    Control Panel
                  </MenuItem>
                ) : (
                  <MenuItem
                    as={MenuLink}
                    icon={<BiSolidLogIn />}
                    href="/auth/login"
                  >
                    Login
                  </MenuItem>
                )}
                <MenuDivider />
                <ThemeButton menu={true} />
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Flex>
    </Suspense>
  );
}
