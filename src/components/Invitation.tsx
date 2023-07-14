/* eslint-disable react-hooks/rules-of-hooks */
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Section from "./section";

export default function Invitation({ invite }: { invite: any }) {
  const { query, push } = useRouter();
  const toast = useToast();
  const [isAcceptLoading, setIsAcceptLoading] = useState<boolean>(false);
  const { user, currentUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  let { id: queryId } = query;
  const id = queryId?.length ? queryId[0] : null;

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const acceptInvite = async () => {
    setIsAcceptLoading(true);
    if (invite.type === "organization") {
      push(`/platform/organizations/?invitation=${query.id}`);
    } else if (invite.type === "xcs") {
      push(`/auth/activate/${query.id}`);
    }
  };

  const inviteTypeSwitch = (type: string) => {
    switch (type) {
      case "organization":
        return "join their organization";
      case "xcs":
        return (
          <>
            create an account on{" "}
            <Text as={"span"} fontWeight={"bold"} whiteSpace={"nowrap"}>
              EVE XCS
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>EVE XCS – Invitation</title>
      </Head>
      <Container maxW={"container.lg"} h={"100vh"}>
        <Flex
          pos={"relative"}
          flexDir={"column"}
          align={"center"}
          justify={"center"}
          h={"full"}
          bottom={[0, 8]}
        >
          <Link as={NextLink} my={8} href={"/"}>
            <Image
              src={useColorModeValue(
                "/images/logo-black.png",
                "/images/logo-white.png"
              )}
              alt={"EVE XCS Logo"}
              w={"auto"}
              h={"24px"}
              objectFit={"contain"}
              transition={"filter 0.2s ease"}
              _hover={{
                filter: useColorModeValue("opacity(0.75)", "brightness(0.75)"),
              }}
              _active={{
                filter: useColorModeValue("opacity(0.5)", "brightness(0.5)"),
              }}
            />
          </Link>

          <Flex
            w={["full", "480px"]}
            aspectRatio={invite ? 1 / 1.25 : "unset"}
            rounded={"xl"}
            border={["none", "1px solid"]}
            borderColor={["none", useColorModeValue("gray.300", "gray.600")]}
            direction={"column"}
            align={"center"}
            justify={"space-between"}
            p={[4, 8]}
          >
            <Box w={"full"}>
              <Skeleton isLoaded={!loading}>
                <Text
                  as={"h2"}
                  fontSize={"3xl"}
                  fontWeight={"900"}
                  letterSpacing={"tighter"}
                  w={"full"}
                  textAlign={"center"}
                >
                  {invite
                    ? invite.type === "organization"
                      ? "You've recieved an invitation"
                      : "You're invited!"
                    : "Invitation not found"}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!loading}>
                <Text fontSize={"lg"} mb={2}>
                  {invite ? (
                    <>
                      {invite?.from?.displayName || invite?.from?.name.first} has invited you to{" "}
                      {inviteTypeSwitch(invite?.type)}.
                      {invite?.type === "organization" ? (
                        <Text as={"span"} fontWeight={"bold"}>
                          {" "}
                          ({invite.organization.name})
                        </Text>
                      ) : null}
                    </>
                  ) : (
                    <>
                      The invitation you are looking for is either invalid or no
                      longer exists.
                    </>
                  )}
                </Text>
              </Skeleton>
            </Box>
            {invite ? (
              <>
                <Flex
                  align={"center"}
                  justify={"center"}
                  flexGrow={1}
                  w={"full"}
                  p={[4, 8]}
                >
                  <Skeleton
                    display={"flex"}
                    isLoaded={!loading}
                    objectFit={"contain"}
                    justifyContent={"center"}
                    rounded={"full"}
                  >
                    <Avatar
                      src={invite?.from?.avatar}
                      w={"full"}
                      h={"auto"}
                      maxW={"240px"}
                      aspectRatio={1 / 1}
                      outline={"1px solid"}
                      outlineColor={useColorModeValue("gray.300", "gray.600")}
                      fontSize={"3xl"}
                    />
                  </Skeleton>
                </Flex>
                <Box w={"full"}>
                  <Skeleton isLoaded={!loading}>
                    {currentUser || invite.type === "xcs" ? (
                      <Button
                        w={"full"}
                        my={2}
                        isLoading={isAcceptLoading}
                        onClick={acceptInvite}
                      >
                        {invite?.type === "xcs"
                          ? "Register & Accept"
                          : "Accept Invitation"}
                      </Button>
                    ) : (
                      <Button
                        w={"full"}
                        my={2}
                        isLoading={isAcceptLoading}
                        onClick={() => {
                          setIsAcceptLoading(true);
                          push("/login?redirect=/invitation/" + query.id);
                        }}
                      >
                        Login to Accept
                      </Button>
                    )}
                  </Skeleton>
                  <Skeleton isLoaded={!loading}>
                    <Text fontSize={"sm"} my={2}>
                      By accepting this invitation, you agree to the{" "}
                      <Text as={"span"} fontWeight={"bold"}>
                        EVE XCS
                      </Text>{" "}
                      <Text
                        as={"span"}
                        fontWeight={"bold"}
                        whiteSpace={"nowrap"}
                      >
                        <Link
                          as={NextLink}
                          href={"/terms"}
                          textDecor={"underline"}
                          textUnderlineOffset={4}
                        >
                          Terms of Service
                        </Link>
                      </Text>{" "}
                      and{" "}
                      <Text
                        as={"span"}
                        fontWeight={"bold"}
                        whiteSpace={"nowrap"}
                      >
                        <Link
                          as={NextLink}
                          href={"/privacy"}
                          textDecor={"underline"}
                          textUnderlineOffset={4}
                        >
                          Privacy Policy
                        </Link>
                        .
                      </Text>
                    </Text>
                  </Skeleton>
                </Box>
              </>
            ) : (
              <>
                <Box w={"full"}>
                  <Button as={NextLink} href={"/"} w={"full"} mt={4}>
                    Return to Home
                  </Button>
                </Box>
              </>
            )}
          </Flex>
        </Flex>
      </Container>
    </>
  );
}
