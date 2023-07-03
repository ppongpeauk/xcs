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

export default function Footer() {
  return (
    <>
      <Flex
        as="footer"
        position={"sticky"}
        top={0}
        flexDir={"column"}
        w={"100vw"}
        h={"6rem"}
        border={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        p={4}
        zIndex={50}
        align={"center"}
        justify={"center"}
      >
        <Text>© EVE Labs LLC. All rights reserved.</Text>
      </Flex>
    </>
  )
}