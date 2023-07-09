/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
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
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { IoSparkles } from "react-icons/io5";
import { VscVerifiedFilled } from "react-icons/vsc";
import Tilt from "react-parallax-tilt";

// Types
import { User } from "@/types";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";

function OrganizationItem({ organization }: { organization: any }) {
  return (
    <StackItem p={1}>
      <Link
        as={NextLink}
        href={`/platform/organizations/${organization.id}`}
        w={"auto"}
        h={"auto"}
        transition={"filter 0.2s ease-in-out"}
        _hover={{
          filter: useColorModeValue("opacity(0.75)", "brightness(0.75)"),
        }}
      >
        <Avatar
          name={organization?.name}
          src={organization?.avatar}
          objectFit={"cover"}
          aspectRatio={1 / 1}
          rounded={"md"}
        />
      </Link>
    </StackItem>
  );
}

export default function Profile({ username }: { username?: string }) {
  const router = useRouter();
  const { currentUser, user: authUser } = useAuthContext();
  const [user, setUser] = useState<any | undefined>(undefined);
  const toast = useToast();

  useEffect(() => {
    if (!currentUser) return;
    if (!username) return;
    setUser(undefined);
    authUser.getIdToken().then((token: any) => {
      fetch(`/api/v1/users/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
    });
  }, [username, currentUser, router, toast]);

  return (
    <>
      <Head>
        {user ? (
          <title>{`EVE XCS - ${user?.name?.first}'s Profile`}</title>
        ) : (
          <title>{`EVE XCS - Profile`}</title>
        )}
      </Head>
      <Container
        display={"flex"}
        maxW={"full"}
        px={8}
        pt={8}
        flexDir={"column"}
      >
        <Box pos={"relative"} width={{ base: "full", md: "min-content" }}>
          {/* Badge */}
          <Flex
            w={{ base: "300px", md: "300px" }}
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
              w={{ base: "90%", md: "75%" }}
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
                <Avatar
                  src={user?.avatar}
                  borderRadius={0}
                  w={"100%"}
                  h={"auto"}
                />
              </Skeleton>
            </Box>
            {/* Name */}
            <Box mb={8} w={"full"}>
              <Skeleton isLoaded={!!user}>
                <Text
                  as={"h1"}
                  fontSize={"3xl"}
                  fontWeight={"900"}
                  textAlign={"center"}
                >
                  {user?.name?.first || "First"} {user?.name?.last || "Last"}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!!user}>
                <Flex flexDir={"column"} align={"center"} justify={"center"}>
                  <Text as={"h2"} size={"md"} textAlign={"center"} zIndex={1}>
                    @{user?.username || "username"}
                  </Text>
                  {user?.platform.staff && (
                    <Flex align={"center"}>
                      <Icon as={IoSparkles} size={"xl"} mr={1} />
                      <Text
                        as={"h2"}
                        fontWeight={"900"}
                        textAlign={"center"}
                        zIndex={1}
                      >
                        Staff Member
                      </Text>
                    </Flex>
                  )}
                  {/* <Icon as={VscVerifiedFilled} ml={1} h={"100%"} /> */}
                </Flex>
              </Skeleton>
            </Box>
          </Flex>
        </Box>
        <Box my={8}>
          <Box w={{ base: "full", md: "384px" }} rounded={"lg"}>
            <Text as={"h1"} fontSize={"2xl"} fontWeight={"900"}>
              About Me
            </Text>
            <Text as={"h2"} size={"md"}>
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
              <Text as={"h1"} fontSize={"2xl"} fontWeight={"900"}>
                Organizations
              </Text>
              <Box w={"full"} h={"full"} p={2}>
                <Skeleton isLoaded={!!user}>
                  {user?.organizations?.length ? (
                    user?.organizations?.map((org: any) => (
                      <OrganizationItem key={org.id} organization={org} />
                    ))
                  ) : (
                    <Text as={"h2"} size={"md"}>
                      This user is not in any organizations.
                    </Text>
                  )}
                </Skeleton>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
