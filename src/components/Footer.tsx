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
        flexDir={"row"}
        w={"100%"}
        h={"6rem"}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        p={4}
        zIndex={50}
        align={"center"}
        justify={"center"}
      >
        <Text>
          <Text as={"span"} fontWeight={"bold"} letterSpacing={"tighter"}>
            © RESTRAFES & CO. LLC.
          </Text>{" "}
          All rights reserved.
        </Text>
        <ThemeButton />
      </Flex>
    </>
  );
}
