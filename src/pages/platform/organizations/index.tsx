/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@chakra-ui/react";
import NextLink from "next/link";

export default function PlatformOrganizations() {
  const [organizations, setOrganizations] = useState<any>([]);
  const { idToken } = useAuthContext();
  const toast = useToast();

  useEffect(() => {
    if (!idToken) return;
    fetch("/api/v1/self/organizations", {
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

  return (
    <>
      <Head>
        <title>EVE XCS - Organizations</title>
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>Organizations</Heading>
        <Flex>
          {organizations.map((organization: any) => (
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
                  view button
                </Button>
              </Stack>
            </Box>
          ))}
        </Flex>
      </Container>
    </>
  );
}

PlatformOrganizations.getLayout = (page: any) => <Layout>{page}</Layout>;
