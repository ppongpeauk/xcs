/* eslint-disable react-hooks/rules-of-hooks */
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
  SkeletonCircle,
  SkeletonText,
  Stack,
  StackItem,
  Text,
  useColorModeValue,
  useToast,
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
  const { idToken, currentUser, user: authUser } = useAuthContext();
  const [user, setUser] = useState<any | undefined>(undefined);
  const toast = useToast();

  useEffect(() => {
    if (!idToken || !currentUser) return;
    if (!username) return;
    setUser(undefined);
    fetch(`/api/v1/users/${username}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then((res) => {
        if (res.status === 404) return router.push("/404");
        return res.json();
      })
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        toast({
          title: "User not found",
          description: "Could not find user",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  }, [idToken, username, currentUser, router, toast]);

  return (
    <>
      <Head>
        <title>{`EVE XCS - ${user?.name?.first}'s Profile`}</title>
      </Head>
      <Container
        display={"flex"}
        maxW={"full"}
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
            bg={useColorModeValue("white", "gray.700")}
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
              aspectRatio={1 / 1}
            >
              <Skeleton isLoaded={!!user}>
                <Image
                  src={user?.avatar || "/images/logo.jpg"}
                  alt={user?.name}
                  w={"100%"}
                  h={"auto"}
                />
              </Skeleton>
            </Box>
            {/* Name */}
            <Box mb={8} w={"full"}>
              <Skeleton isLoaded={!!user}>
                <Heading
                  as={"h1"}
                  size={"lg"}
                  textAlign={"center"}
                  zIndex={1}
                  mb={2}
                >
                  {user?.name?.first || "First"} {user?.name?.last || "Last"}
                </Heading>
              </Skeleton>
              <Skeleton isLoaded={!!user}>
                <Text as={"h2"} size={"md"} textAlign={"center"} zIndex={1}>
                  @{user?.username || "username"}
                </Text>
              </Skeleton>
            </Box>
          </Flex>
        </Box>
        <Box mt={4}>
          <Box my={4} w={["full", "300px"]} rounded={"lg"}>
            <Heading as={"h2"} size={"md"} mb={2}>
              About Me
            </Heading>
            <Text as={"h2"} size={"md"} mb={4}>
              <Skeleton isLoaded={!!user}>
                {user?.bio || "This user has not set a bio yet."}
              </Skeleton>
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
                <Skeleton isLoaded={!!user}>
                  <OrganizationItem />
                  <OrganizationItem />
                  <OrganizationItem />
                  <OrganizationItem />
                  <OrganizationItem />
                  <OrganizationItem />
                  <OrganizationItem />
                  <OrganizationItem />
                </Skeleton>
              </Box>
            </Flex>
          </Box>
          <Box py={4} w={"full"}>
            <Flex
              w={"fit-content"}
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
                  <Skeleton isLoaded={!!user}>
                    No connected experiences yet.
                  </Skeleton>
                </Text>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
