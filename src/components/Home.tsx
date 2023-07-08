import Section from "@/components/section";
import {
  Box,
  Container,
  Divider,
  Flex,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// import { Familjen_Grotesk, Manrope } from "next/font/google";
// const font1 = Familjen_Grotesk({ subsets: ["latin"] });

import NextImage from "next/image";

import Marquee from "react-fast-marquee";

export default function Home() {
  return (
    // New Bold Typography Design
    <Flex position={"relative"} flexDir={"column"}>
      <Flex
        position={"relative"}
        flexDir={["column", "row"]}
        h={"calc(100vh - 6rem)"}
        borderBottom={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
      >
        <Flex flexBasis={1} flexGrow={2} order={[2, 1]} w={"full"}>
          <NextImage
            src={"/images/hero5.jpeg"}
            alt={"Home Image"}
            fill={true}
            style={{
              objectFit: "cover",
              objectPosition: "right center",
            }}
          />
        </Flex>
        <Flex
          pos={"absolute"}
          right={0}
          flexBasis={1}
          flexGrow={1}
          align={"center"}
          justify={"center"}
          py={8}
          px={16}
          order={[1, 2]}
          // backdropFilter={"blur(2rem)"}
          // bg={useColorModeValue(
          //   "rgba(255, 255, 255, 0.25)",
          //   "rgba(26, 32, 44, 0.5)"
          // )}
          bg={useColorModeValue("white", "gray.800")}
          w={["full", "full", "50%"]}
          minW={["unset", "480px"]}
          h={"full"}
        >
          <Section>
            <Text
              as={"h1"}
              fontSize={"4xl"}
              fontWeight={"bolder"}
              letterSpacing={"tighter"}
            >
              Streamlined access control is here.
            </Text>
            <Text fontSize={"lg"}>
              EVE XCS is a new way to manage your building&apos;s access
              control.
            </Text>
          </Section>
        </Flex>
      </Flex>
      <Flex position={"relative"}>
        <Flex
          flexDir={"column"}
          w={"full"}
          pos={"relative"}
          fontSize={["4em", "8em", "12em"]}
          lineHeight={1}
          justify={"center"}
          py={24}
        >
          <Marquee
            autoFill={true}
            direction={"left"}
            className={"overflow-hidden"}
          >
            <Text
              as={"h3"}
              fontSize={"0.5em"}
              fontWeight={"900"}
            >
              EVE XCS<Box as={"span"} mx={8}></Box>
            </Text>
          </Marquee>
          <Marquee
            autoFill={true}
            direction={"right"}
            className={"overflow-hidden"}
          >
            <Text
              as={"h3"}
              fontSize={"0.5em"}
              fontWeight={"900"}
            >
              EVE XCS<Box as={"span"} mx={8}></Box>
            </Text>
          </Marquee>
        </Flex>
      </Flex>
    </Flex>
  );
}
