// Components
import ThemeButton from "@/components/ThemeButton";
import {
  Avatar,
  Box,
  Button,
  Code,
  Container,
  Flex,
  HStack,
  Image,
  Link,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";

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
  const { user, logout } = useAuthContext();
  const pathname = usePathname();

  return (
    <Flex
      as="nav"
      position={"sticky"}
      top={0}
      w={"100vw"}
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
        borderRight={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
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
          <Flex>
            <Image
              src={useColorModeValue(
                "/images/logo-black.png",
                "/images/logo-white.png"
              )}
              h={"24px"}
              alt={"EVE XCS"}
              objectFit={"contain"}
            />
            <Code
              ml={2}
              fontSize={"xs"}
              h={"fit-content"}
              px={"4px"}
              fontWeight={"bold"}
              bg={useColorModeValue("gray.900", "white")}
              color={useColorModeValue("white", "gray.900")}
              letterSpacing={"tighter"}
            >
              BETA
            </Code>
          </Flex>
          {/* <Text fontSize={"2xl"} fontWeight={"bold"} letterSpacing={"tighter"}>
          EVE XCS
        </Text> */}
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
        {!user ? (
          <NavLink href={"/auth/login"} pathname={pathname}>
            Login
          </NavLink>
        ) : (
          <>
            <NavLink href={"/platform/home"} pathname={pathname}>
              Access Platform
            </NavLink>
          </>
        )}
        <ThemeButton />
        {/* <Avatar size={"md"} src="/images/avatar.jpg" mx={2} /> */}
      </HStack>
    </Flex>
  );
}
