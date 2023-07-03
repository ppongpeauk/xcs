import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Select,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/AuthContext";

export default function PlatformLocations() {
  // Fetch locations
  const [locations, setLocations] = useState<any>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);

  // Fetch organizations
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationsLoading, setOrganizationsLoading] =
    useState<boolean>(true);

  const [selectedOrganization, setSelectedOrganization] = useState<any>();

  const { idToken } = useAuthContext();

  useEffect(() => {
    if (!idToken) return;
    setOrganizationsLoading(true);
    fetch("/api/v1/self/organizations", {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganizations(data.organizations);
      })
      .finally(() => {
        setOrganizationsLoading(false);
      });
  }, [idToken]);

  useEffect(() => {
    if (!selectedOrganization) return;
    setLocationsLoading(true);
    fetch(`/api/v1/organizations/${selectedOrganization.id}/locations`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.locations);
      })
      .finally(() => {
        setLocationsLoading(false);
      });
  }, [idToken, selectedOrganization]);

  useEffect(() => {
    if (!organizations) return;
    setSelectedOrganization(organizations[0]);
  }, [organizations]);

  return (
    <>
      <Head>
        <title>EVE XCS - Locations</title>
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>Locations Page</Heading>
        {organizationsLoading ? (
          <Skeleton height={4} width={"128px"} />
        ) : (
          <Box p={4}>
            <Text>Organization</Text>
            <Select
              w={"fit-content"}
              value={selectedOrganization?.name}
              onChange={(e) => {
                const organization = organizations.find(
                  (organization: any) => organization.name === e.target.value
                );
                setSelectedOrganization(organization);
              }}
            >
              {organizations?.map((organization: any) => (
                <option key={organization.id} value={organization.name}>
                  {organization.name}
                </option>
              ))}
            </Select>
          </Box>
        )}

        {locationsLoading ? (
          <Skeleton height={4} width={"128px"} />
        ) : (
          <Flex>
            {locations.length === 0 ? (
              <Box
                h={"full"}
                p={4}
                borderWidth={1}
                borderRadius={"md"}
                borderColor={"gray.200"}
                boxShadow={"lg"}
                mr={4}
              >
                <Text>empty</Text>
              </Box>
            ) : (
              locations?.map((location: any) => (
                <Box
                  key={location.id}
                  h={"full"}
                  p={4}
                  borderWidth={1}
                  borderRadius={"md"}
                  borderColor={"gray.200"}
                  boxShadow={"lg"}
                  mr={4}
                >
                  <Box p={2}>
                    <Heading size={"md"}>{location.name}</Heading>
                    <Text>ID: {location.id}</Text>
                    <Text>Created at {location.createdAt}</Text>
                  </Box>
                  <Stack p={2}>
                    <Button as={NextLink} href={`/platform/locations/${location.id}`} variant={"outline"}>very fancy view button</Button>
                  </Stack>
                </Box>
              ))
            )}
          </Flex>
        )}
      </Container>
    </>
  );
}

PlatformLocations.getLayout = (page: any) => <Layout>{page}</Layout>;
