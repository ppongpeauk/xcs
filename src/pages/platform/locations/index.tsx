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
  IconButton,
  InputGroup,
  Select,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import CreateLocationDialog from "@/components/CreateLocationDialog";
import { useAuthContext } from "@/contexts/AuthContext";
import { BsBuildingFillAdd } from "react-icons/bs";

export default function PlatformLocations() {
  const { query, push } = useRouter();

  // Fetch locations
  const [locations, setLocations] = useState<any>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);

  // Fetch organizations
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationsLoading, setOrganizationsLoading] =
    useState<boolean>(true);

  const [selectedOrganization, setSelectedOrganization] = useState<any>();

  const { idToken } = useAuthContext();

  const {
    isOpen: isCreateLocationModalOpen,
    onOpen: onCreateLocationModalOpen,
    onClose: onCreateLocationModalClose,
  } = useDisclosure();

  useEffect(() => {
    if (!idToken) return;
    setOrganizationsLoading(true);
    fetch("/api/v1/me/organizations", {
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
      <CreateLocationDialog
        isOpen={isCreateLocationModalOpen}
        onClose={onCreateLocationModalClose}
        selectedOrganization={selectedOrganization}
        onCreateLocation={(locationId) => {
          push(`/platform/locations/${locationId}`);
        }}
      />
      <Container maxW={"full"} p={8}>
        <Heading>Locations</Heading>
        {organizationsLoading ? (
          <Skeleton height={4} width={"128px"} />
        ) : (
          <HStack
            display={"flex"}
            py={4}
            justify={"flex-start"}
            align={"center"}
            spacing={4}
          >
            <FormControl w={"fit-content"}>
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
            </FormControl>
            <Button
              leftIcon={<BsBuildingFillAdd />}
              aria-label={"Create Location"}
              onClick={onCreateLocationModalOpen}
            >
              Create Location
            </Button>
          </HStack>
        )}

        {locationsLoading ? (
          <Skeleton height={4} width={"128px"} />
        ) : (
          <Flex>
            {locations.length === 0 ? (
              <Text>dawg this shit&apos;s empty</Text>
            ) : (
              locations?.map((location: any) => (
                <Box
                  key={location.id}
                  w={"240px"}
                  p={4}
                  borderWidth={1}
                  borderRadius={"xl"}
                  borderColor={useColorModeValue("gray.200", "gray.700")}
                  mr={4}
                >
                  <Box p={2}>
                    <Heading size={"md"} mb={2}>{location.name}</Heading>
                    <Text fontSize={"sm"} mb={2}>{location.description}</Text>
                    <Text fontSize={"sm"}>Updated at {(new Date(location.updatedAt)).toDateString()}</Text>
                  </Box>
                  <Stack p={2}>
                    <Button
                      as={NextLink}
                      href={`/platform/locations/${location.id}`}
                      variant={"solid"}
                    >
                      View
                    </Button>
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
