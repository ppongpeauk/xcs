import Section from "@/components/section";
import {
    Box,
    Container,
    Divider,
    Flex,
    Heading,
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
          pos={"relative"}
          flexBasis={1}
          flexGrow={1}
          align={"center"}
          justify={"center"}
          py={8}
          px={[8, 8, 24]}
          order={[1, 2]}
          // backdropFilter={"blur(2rem)"}
          // bg={useColorModeValue(
          //   "rgba(255, 255, 255, 0.25)",
          //   "rgba(26, 32, 44, 0.5)"
          // )}
          bg={useColorModeValue("white", "gray.800")}
          minW={["unset", "50%"]}
          w={["full", "full", "50%"]}
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
            <Text fontSize={"xl"}>
              Restrafes XCS is a new way to manage your building&apos;s access
              control.
            </Text>
          </Section>
        </Flex>
      </Flex>
      <Flex
        w={"100%"}
        minH={"50vh"}
        borderBottom={"1px solid"}
        borderColor={useColorModeValue("gray.300", "gray.700")}
        py={12}
      >
        <Box
          px={[8, 8, 32]}
          flexGrow={1}
          flexBasis={1}
          display={["none", "block"]}
        >
          <Text fontSize={"4xl"} pb={2}>
            Qu&apos;est-ce que Restrafes XCS?
          </Text>
        </Box>
        <Box px={[8, 8, 32]} flexGrow={1} flexBasis={1}>
          <Text fontSize={"4xl"} pb={2}>
            What is Restrafes XCS?
          </Text>
          <Text fontSize={"xl"}>
            Restrafes XCS is a powerful access control system designed to help you
            manage access points for your building. With Restrafes XCS, you can easily
            and securely control who has access to your property, including
            employees and visitors. The system is highly customizable, allowing
            you to set access levels and permissions for different users, and
            offers a range of advanced features such as real-time monitoring,
            reporting, and integration with other security systems. Whether
            you&apos;re looking to enhance the security of your business,
            school, or residential property, Restrafes XCS provides the flexibility
            and reliability you need to manage access with confidence.
          </Text>
        </Box>
      </Flex>
      <Flex position={"relative"}>
        <Flex
          flexDir={"column"}
          w={"full"}
          pos={"relative"}
          fontSize={["4em", "8em", "12em"]}
          lineHeight={1}
          justify={"center"}
          py={16}
        >
          <Marquee
            autoFill={true}
            direction={"left"}
            className={"overflow-hidden"}
          >
            <Text as={"h3"} fontSize={["0.5em", "0.25em"]}>
              Restrafes XCS<Box as={"span"} mx={8}></Box>
            </Text>
          </Marquee>
          <Marquee
            autoFill={true}
            direction={"right"}
            className={"overflow-hidden"}
          >
            <Text as={"h3"} fontSize={["0.5em", "0.25em"]} fontWeight={"900"}>
              Restrafes XCS<Box as={"span"} mx={8}></Box>
            </Text>
          </Marquee>
        </Flex>
      </Flex>
    </Flex>
  );
}
