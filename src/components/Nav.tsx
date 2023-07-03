// Components
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Link,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import ThemeButton from "./ThemeButton";

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
      mx={2}
    >
      {children}
    </Button>
  );
}

export default function Nav({ type }: { type?: string }) {
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
      borderBottom={"1px solid"}
      borderColor={useColorModeValue("gray.300", "gray.700")}
      zIndex={50}
    >
      {/* Title */}
      <Box
        h={"full"}
        borderRight={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
      >
        <Flex
          as={NextLink}
          href={"/"}
          align={"center"}
          h={"100%"}
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
            px={[4, 8]}
            h={"24px"}
            alt={"EVE XCS"}
            objectFit={"cover"}
          />
          {/* <Text fontSize={"2xl"} fontWeight={"bold"} letterSpacing={"tighter"}>
          EVE XCS
        </Text> */}
        </Flex>
      </Box>
      <Spacer />
      {/* Links */}
      <Flex
        align={"center"}
        h={"100%"}
        px={[4, 8]}
        borderLeft={"1px solid"}
        borderColor={useColorModeValue("gray.200", "gray.700")}
      >
        <NavLink href={"/login"} pathname={pathname}>
          Login
        </NavLink>
        <ThemeButton />
      </Flex>
    </Flex>
  );
}
