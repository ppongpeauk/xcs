/* eslint-disable react-hooks/rules-of-hooks */
// React
import { useEffect, useState } from "react";

// Next
import { useRouter } from "next/router";

// Components
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

export async function getServerSideProps({ query }: any) {
  if (!query.id) {
    return {
      props: {
        invite: null,
      },
    };
  }

  const invite = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/invitations/${query.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      if (res.status !== 200) {
        throw new Error("Invalid invitation.");
      }
      return res.json();
    })
    .then((ret) => {
      return ret?.invitation;
    })
    .catch((err) => {
      // console.error(err.message);
      return null;
    });
  return {
    props: {
      invite,
    },
  };
}

export default function Invite({ invite }: any) {
  const { query, push } = useRouter();
  const toast = useToast();
  const [isAcceptLoading, setIsAcceptLoading] = useState<boolean>(false);
  const { user, currentUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // if (!user) return;
    // user.getIdToken().finally(() => {
    //   console.log("User token refreshed.");
    //   setLoading(false);
    // });
    setLoading(false);
  }, [user]);

  const acceptInvite = async () => {
    setIsAcceptLoading(true);
    if (invite.type === "organization") {
      push(`/platform/organizations/?invitation=${query.id}`);
      // await fetch(`/api/v1/invitations/${query.id}`, {
      //   method: "POST",
      // })
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.success) {
      //       toast({
      //         title: "Invitation Accepted",
      //         description: "You have successfully accepted the invite.",
      //         status: "success",
      //         duration: 5000,
      //         isClosable: true,
      //       });
      //     } else {
      //       toast({
      //         title: "Invitation Error",
      //         description: data.message,
      //         status: "error",
      //         duration: 5000,
      //         isClosable: true,
      //       });
      //     }
      //   })
      //   .catch((err) => {
      //     toast({
      //       title: "Unable to accept invitation",
      //       description: err.message,
      //       status: "error",
      //       duration: 5000,
      //       isClosable: true,
      //     });
      //   })
      //   .finally(() => {
      //     setIsAcceptLoading(false);
      //   });
    } else if (invite.type === "xcs") {
      push(`/register/${query.id}`);
    }
  };

  const inviteTypeSwitch = (type: string) => {
    switch (type) {
      case "organization":
        return "join their organization";
      case "xcs":
        return "register for an account";
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>EVE XCS - Invitation</title>
        <meta property="og:site_name" content="EVE XCS" />
        {invite && (
          <>
            <meta
              property="og:title"
              content={"Invitation from " + invite.from?.name.first}
            />
            <meta
              property="og:url"
              content={`https://xcs.restrafes.co/invite/${query.id}`}
            />
            <meta
              property="og:description"
              content={`You've been invited by ${
                invite.from?.name.first
              } to ${inviteTypeSwitch(invite.type)}.`}
            />
          </>
        )}
        <meta property="og:image" content={"https://xcs.restrafes.co/images/logo-white.png"} />
        <meta property="og:type" content="website" />
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
                <Heading
                  as={"h2"}
                  fontSize={"3xl"}
                  mb={2}
                  letterSpacing={"tighter"}
                >
                  {invite
                    ? "You've recieved an invitation"
                    : "Invitation not found"}
                </Heading>
              </Skeleton>
              <Skeleton isLoaded={!loading}>
                <Text fontSize={"md"} mb={2}>
                  {invite ? (
                    <>
                      {invite?.from?.name.first} has invited you to{" "}
                      {inviteTypeSwitch(invite?.type)}
                      {invite?.type === "organization" ? (
                        <Text
                          as={"span"}
                          fontWeight={"bold"}
                          whiteSpace={"nowrap"}
                        >
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
                  <Avatar
                    src={invite?.from?.avatar}
                    w={"min-content"}
                    h={"100%"}
                    maxH={"240px"}
                    aspectRatio={1 / 1}
                    outline={"1px solid"}
                    outlineColor={useColorModeValue("gray.300", "gray.600")}
                    fontSize={"3xl"}
                  />
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
                        {invite.type === "xcs"
                          ? "Register & Accept"
                          : "Accept Invitation"}
                      </Button>
                    ) : (
                      <Button
                        w={"full"}
                        my={2}
                        onClick={() =>
                          push("/login?redirect=/invite/" + query.id)
                        }
                      >
                        Login to Accept
                      </Button>
                    )}
                  </Skeleton>
                  <Skeleton isLoaded={!loading}>
                    <Text fontSize={"sm"} my={2}>
                      By accepting this invitation, you agree to the{" "}
                      <Text
                        as={"span"}
                        fontWeight={"bold"}
                        whiteSpace={"nowrap"}
                      >
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
