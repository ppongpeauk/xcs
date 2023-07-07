/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Link,
  Select,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";

import CreateOrganizationDialog from "@/components/CreateOrganizationDialog";
import JoinOrganizationDialog from "@/components/JoinOrganizationDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { MdOutlineAddCircle, MdOutlineJoinRight } from "react-icons/md";

export default function PlatformOrganizations() {
  const { push, query } = useRouter();
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationsLoading, setOrganizationsLoading] =
    useState<boolean>(true);
  const [queryLoading, setQueryLoading] = useState<boolean>(true);
  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [initialInviteCodeValue, setInitialInviteCodeValue] = useState<
    string | null
  >(null);
  const toast = useToast();

  const {
    isOpen: isCreateOrganizationModalOpen,
    onOpen: onCreateOrganizationModalOpen,
    onClose: onCreateOrganizationModalClose,
  } = useDisclosure();

  const {
    isOpen: isJoinOrganizationModalOpen,
    onOpen: onJoinOrganizationModalOpen,
    onClose: onJoinOrganizationModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (!idToken) return;
    setOrganizationsLoading(true);
    fetch("/api/v1/me/organizations", {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    }).then((res) => {
      if (res.status !== 200) {
        throw new Error("failed to fetch organizations");
      }
      res
        .json()
        .then((data) => {
          setOrganizations(data.organizations);
          setOrganizationsLoading(false);
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    });
  }, [idToken, toast]);

  const joinOrganizationPrompt = (inviteCode: string) => {
    setQueryLoading(true);
    setInitialInviteCodeValue(inviteCode);
    setQueryLoading(false);
    onJoinOrganizationModalOpen();
  };

  const onCreateOrganization = () => {
    onCreateOrganizationModalClose();
    toast({
      title: "Success",
      description: "Organization created successfully",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  useEffect(() => {
    if (!query) return;
    if (query.invitation) {
      joinOrganizationPrompt(query.invitation as string);
    } else {
      setTimeout(() => {
        setQueryLoading(false);
      }, 100);
    }
  }, [query.invitation]);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      setIdToken(token);
    });
  }, [user]);

  return (
    <>
      <Head>
        <title>EVE XCS — Organizations</title>
        <meta property="og:title" content="EVE XCS - Manage Organizations" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="/images/hero3.jpg" />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <CreateOrganizationDialog
        isOpen={isCreateOrganizationModalOpen}
        onClose={onCreateOrganizationModalClose}
        onCreate={(id) => {
          push(`/platform/organizations/${id}`);
        }}
      />
      {!queryLoading && (
        <JoinOrganizationDialog
          isOpen={isJoinOrganizationModalOpen}
          onClose={onJoinOrganizationModalClose}
          onJoin={(id) => {
            push(`/platform/organizations/${id}`);
          }}
          initialValue={initialInviteCodeValue || ""}
        />
      )}
      <Container maxW={"full"} p={8}>
        <Heading>Organizations</Heading>
        <HStack
          display={"flex"}
          py={4}
          justify={"flex-start"}
          align={"flex-end"}
          spacing={4}
        >
          <FormControl w={"fit-content"}>
            <Button
              variant={"solid"}
              leftIcon={<MdOutlineAddCircle />}
              onClick={onCreateOrganizationModalOpen}
            >
              Create
            </Button>
          </FormControl>
          <FormControl w={"fit-content"}>
            <Button
              variant={"solid"}
              leftIcon={<MdOutlineJoinRight />}
              onClick={onJoinOrganizationModalOpen}
            >
              Join
            </Button>
          </FormControl>
        </HStack>
        <Box>
          {organizationsLoading ? (
            <Stack>
              <Skeleton height={4} width={"50%"} />
              <Skeleton height={4} width={"50%"} />
              <Skeleton height={4} width={"50%"} />
            </Stack>
          ) : organizations.length !== 0 ? (
            <Stack direction={"row"}>
              {organizations.map((organization: any) => (
                <Box
                  key={organization.id}
                  w={"384px"}
                  h={"max-content"}
                  py={4}
                  px={8}
                  borderWidth={1}
                  borderRadius={"xl"}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  mr={4}
                >
                  <Box p={2}>
                    <Heading size={"md"}>{organization.name}</Heading>
                    <Text>ID: {organization.id}</Text>
                    <Text>Created at {organization.createdAt}</Text>
                  </Box>
                  <Stack p={2}>
                    <Button
                      as={NextLink}
                      href={`/platform/organizations/${organization.id}`}
                      variant={"solid"}
                    >
                      View
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <Text>
              You are currently not a member of any organization.{" "}
              <Text as={"span"}>
                <Button
                  minW={"unset"}
                  variant={"link"}
                  color={"unset"}
                  textDecor={"underline"}
                  textUnderlineOffset={4}
                  onClick={onCreateOrganizationModalOpen}
                  _hover={{
                    color: useColorModeValue("gray.600", "gray.400"),
                  }}
                >
                  Create
                </Button>
              </Text>{" "}
              or{" "}
              <Text as={"span"}>
                <Button
                  minW={"unset"}
                  variant={"link"}
                  color={"unset"}
                  textDecor={"underline"}
                  textUnderlineOffset={4}
                  onClick={onJoinOrganizationModalOpen}
                  _hover={{
                    color: useColorModeValue("gray.600", "gray.400"),
                  }}
                >
                  join
                </Button>
              </Text>{" "}
              an organization to get started.
            </Text>
          )}
        </Box>
      </Container>
    </>
  );
}

PlatformOrganizations.getLayout = (page: any) => <Layout>{page}</Layout>;
