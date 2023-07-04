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

  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);

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
        if (data.organizations.length === 0) {
          setLocationsLoading(false);
        }
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
        <HStack
          display={"flex"}
          py={2}
          justify={"flex-start"}
          align={"flex-end"}
          spacing={4}
        >
          <FormControl w={"fit-content"}>
            <FormLabel>Organization</FormLabel>
            {selectedOrganization ? (
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
            ) : null}
          </FormControl>
          <Button
            leftIcon={<BsBuildingFillAdd />}
            onClick={onCreateLocationModalOpen}
            isDisabled={!selectedOrganization}
          >
            Create Location
          </Button>
        </HStack>

        <Box>
          {locationsLoading ? (
            <Stack>
              <Skeleton height={4} width={"50%"} />
              <Skeleton height={4} width={"50%"} />
              <Skeleton height={4} width={"50%"} />
            </Stack>
          ) : organizations.length === 0 ? (
            <Text>
              You are currently not a member of any organization. Create or join
              an organization to get started.
            </Text>
          ) : (
            <Flex>
              {locations.length === 0 ? (
                <Text>dawg this shit&apos;s empty</Text>
              ) : (
                locations?.map((location: any) => (
                  <Box
                    key={location.id}
                    w={"240px"}
                    h={"max-content"}
                    px={4}
                    borderWidth={1}
                    borderRadius={"xl"}
                    borderColor={useColorModeValue("gray.200", "gray.700")}
                    mr={4}
                  >
                    <Box my={4}>
                      <Heading size={"md"} mb={2}>
                        {location.name}
                      </Heading>
                      <Text fontSize={"sm"} mb={2}>
                        {location.description}
                      </Text>
                      <Text fontSize={"sm"}>
                        Updated at {new Date(location.updatedAt).toDateString()}
                      </Text>
                    </Box>
                    <Stack my={4}>
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
        </Box>
      </Container>
    </>
  );
}

PlatformLocations.getLayout = (page: any) => <Layout>{page}</Layout>;
