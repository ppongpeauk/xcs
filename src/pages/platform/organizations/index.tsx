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
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { MdOutlineAddCircle, MdOutlineJoinRight } from "react-icons/md";

export default function PlatformOrganizations() {
  const { push } = useRouter();
  const [organizations, setOrganizations] = useState<any>([]);
  const { idToken } = useAuthContext();
  const toast = useToast();

  const {
    isOpen: isCreateOrganizationModalOpen,
    onOpen: onCreateOrganizationModalOpen,
    onClose: onCreateOrganizationModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (!idToken) return;
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
          console.log(data.organizations);
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

  return (
    <>
      <Head>
        <title>EVE XCS - Organizations</title>
      </Head>
      <CreateOrganizationDialog
        isOpen={isCreateOrganizationModalOpen}
        onClose={onCreateOrganizationModalClose}
        onCreate={(id) => {
          push(`/platform/organizations/${id}`);
        }}
      />

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
              leftIcon={<MdOutlineJoinRight />}
              // onClick={onCreateOrganizationModalOpen}
            >
              Join
            </Button>
          </FormControl>
          <FormControl w={"fit-content"}>
            <Button
              variant={"solid"}
              leftIcon={<MdOutlineAddCircle />}
              onClick={onCreateOrganizationModalOpen}
            >
              Create
            </Button>
          </FormControl>
        </HStack>
        <Flex>
          {organizations.length !== 0 ? (
            organizations.map((organization: any) => (
              <Box
                key={organization.id}
                h={"full"}
                p={4}
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
            ))
          ) : (
            <Text>
              You are currently not a member of any organization. Create or join
              an organization to get started.
            </Text>
          )}
        </Flex>
      </Container>
    </>
  );
}

PlatformOrganizations.getLayout = (page: any) => <Layout>{page}</Layout>;
