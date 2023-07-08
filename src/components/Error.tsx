import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Error() {
  return (
    <Container maxW={"container.md"} py={16}>
      <Heading as={"h1"} size={"xl"} mb={2}>
        Looks like you&apos;ve hit a snag.
      </Heading>
      <Text fontSize={"lg"} mb={4}>
        This could be because the page you&apos;re looking for does not exist or
        you do not have permission to view it.
      </Text>
      <Flex flexDir={"row"}>
        <Link as={NextLink} href={"/"} _hover={{ textDecoration: "none" }}>
          <Button colorScheme={"blue"} mr={2}>
            Go Home
          </Button>
        </Link>
      </Flex>
    </Container>
  );
}
