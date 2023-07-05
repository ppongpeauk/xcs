import {
  Box,
  Flex,
  Image,
  Link,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import NextLink from "next/link";
import ThemeButton from "./ThemeButton";

export default function Footer() {
  return (
    <>
      <Flex
        as="footer"
        position={"sticky"}
        top={0}
        flexDir={"column"}
        w={"100%"}
        h={"6rem"}
        borderTop={"1px solid"}
        borderBottom={"1px solid"}
        borderRight={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        p={4}
        zIndex={50}
        align={"center"}
        justify={"center"}
      >
        <Text>
          <Text as={"span"} fontWeight={"bold"} letterSpacing={"tighter"}>
            © RESTRAFES & CO LLC.
          </Text>{" "}
          All rights reserved.
        </Text>
        <Text color={"gray.400"} fontSize={"xs"} letterSpacing={"tighter"}>
          Commit: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "dev"} ({process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || "dev"})
        </Text>
      </Flex>
    </>
  );
}
