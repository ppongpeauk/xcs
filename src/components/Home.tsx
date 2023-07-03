import Section from "@/components/section";
import { Box, Container, Flex, Image, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Flex position={"relative"} flexDir={"column"}>
      <Flex
        position={"relative"}
        flexDir={["column", "row"]}
        minH={"calc(100vh - 6rem)"}
      >
        <Flex flexBasis={1} flexGrow={1} order={[2, 1]}>
          <Image src={"/images/hero3.jpg"} objectFit={"cover"} />
        </Flex>
        <Flex
          flexBasis={1}
          flexGrow={1}
          align={"center"}
          justify={"center"}
          p={8}
          order={[1, 2]}
        >
          <Section>
            <Text
              as={"h1"}
              fontSize={"3xl"}
              fontWeight={"bolder"}
              letterSpacing={"tighter"}
            >
              Control your building from anywhere.
            </Text>
            <Text fontSize={"lg"}>
              Welcome to the future of access control.
            </Text>
          </Section>
        </Flex>
      </Flex>
    </Flex>
  );
}
