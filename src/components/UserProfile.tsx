import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Image,
  Link,
  Skeleton,
  Stack,
  StackItem,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

// Types
import { User } from "@/types";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";

function OrganizationItem() {
  return (
    <StackItem p={1}>
      <Link
        href={"/organization/fellers"}
        w={"auto"}
        h={"auto"}
        transition={"filter 0.2s ease-in-out"}
        _hover={{
          filter: useColorModeValue("opacity(0.75)", "brightness(0.75)"),
        }}
      >
        <Image
          src={
            "https://cdn.discordapp.com/attachments/813308393208414219/1123233338392584263/Screenshot_20230623-114505_Instagram.png"
          }
          alt={"EVE XCS"}
          w={12}
          h={"auto"}
          objectFit={"cover"}
          aspectRatio={1 / 1}
          rounded={"lg"}
        />
      </Link>
    </StackItem>
  );
}

export default function Profile({ username }: { username?: string }) {
  const router = useRouter();
  const { currentUser } = useAuthContext();

  const [user, setUser] = useState<any | undefined>(undefined);

  useEffect(() => {
    // TEMP
    setUser(currentUser);
  }, [currentUser]);

  return (
    <>
      <Head>
        <title>
          EVE XCS - {user ? `${user.name}'s Profile` : "User Profile"}
        </title>
      </Head>
      <Container
        display={"flex"}
        maxW={"container.xl"}
        px={8}
        pt={8}
        flexDir={"column"}
      >
        <Box pos={"relative"} width={["full", "min-content"]}>
          {/* Badge */}
          <Flex
            w={["100%", "300px"]}
            h={"auto"}
            aspectRatio={1 / 1.6}
            rounded={"xl"}
            bg={useColorModeValue("gray.100", "gray.700")}
            border={"2px solid"}
            borderColor={useColorModeValue("gray.300", "gray.600")}
            p={8}
            align={"center"}
            flexDir={"column"}
            justify={"space-between"}
            flexGrow={1}
          >
            {/* Punch Hole */}
            <Flex
              h={"24px"}
              w={"24px"}
              px={12}
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.800")}
              border={"2px solid"}
              borderColor={useColorModeValue("gray.300", "gray.600")}
              justifySelf={"center"}
            />
            {/* Avatar */}
            <Box
              w={["90%", "75%"]}
              h={"auto"}
              objectFit={"cover"}
              justifySelf={"center"}
              rounded={"lg"}
              zIndex={1}
              overflow={"hidden"}
              border={"2px solid"}
              borderColor={useColorModeValue("gray.300", "gray.600")}
            >
              <Suspense fallback={<Skeleton />}>
                <Image
                  src={user?.avatar}
                  alt={user?.name}
                  w={"100%"}
                  h={"auto"}
                />
              </Suspense>
            </Box>
            {/* Name */}
            <Box mb={8}>
              <Heading
                as={"h1"}
                size={"lg"}
                textAlign={"center"}
                zIndex={1}
                mb={2}
              >
                {user?.name.first} {user?.name.last}
              </Heading>
              <Text as={"h2"} size={"md"} textAlign={"center"} zIndex={1}>
                @{user?.username}
              </Text>
            </Box>
          </Flex>
        </Box>
        <Box mt={4}>
          <Box my={4} w={["full", "300px"]} rounded={"lg"}>
            <Heading as={"h2"} size={"md"} mb={2}>
              About Me
            </Heading>
            <Text as={"h2"} size={"md"} mb={4}>
              {user?.bio}
            </Text>
          </Box>
        </Box>
        <Flex flexDir={["column", "row"]}>
          {/* Organizations */}
          <Box py={4} w={["full", "300px"]} mr={[0, 16]}>
            <Flex
              w={"full"}
              h={"fit-content"}
              flexDir={"column"}
              align={"flex-start"}
              justify={"flex-start"}
              flexGrow={1}
            >
              <Heading as={"h2"} size={"md"} mb={2}>
                Organizations
              </Heading>
              <Box w={"full"} h={"full"}>
                <OrganizationItem />
                <OrganizationItem />
                <OrganizationItem />
                <OrganizationItem />
                <OrganizationItem />
                <OrganizationItem />
                <OrganizationItem />
                <OrganizationItem />
              </Box>
            </Flex>
          </Box>
          <Box py={6} w={"full"}>
            <Flex
              w={"full"}
              h={"fit-content"}
              flexDir={"column"}
              align={"flex-start"}
              justify={"flex-start"}
              flexGrow={1}
            >
              <Heading as={"h2"} size={"md"} mb={2}>
                Connected Experiences
              </Heading>
              <Box w={"full"} h={"full"}>
                <Text
                  as={"h2"}
                  size={"md"}
                  mb={2}
                  color={useColorModeValue("gray.500", "gray.400")}
                >
                  No connected experiences yet.
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
