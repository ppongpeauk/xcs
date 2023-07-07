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
  Image,
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
import { FaBuilding, FaUserAlt } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";

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

  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);

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
        if (data?.organizations?.length === 0) {
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

  useEffect(() => {
    if (!query.organization) return;
    const organization = organizations.find(
      (organization: any) => organization.id === query.organization
    );
    setSelectedOrganization(organization);
  }, [organizations, query.organization]);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      setIdToken(token);
    });
  }, [user]);

  // const experienceToThumbnail = useCallback((placeId: string) => {
  //   if (!placeId) return;
  //   const url = fetch(
  //     `https://thumbnails.roblox.com/v1/places/gameicons?placeIds=${placeId}&returnPolicy=PlaceHolder&size=256x256&format=Png&isCircular=false`,
  //     {
  //       method: "GET",
  //       headers: {
  //         "Accept": "application/json",
  //       }
  //     })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const thumbnail = data.data[0].imageUrl;
  //       return thumbnail;
  //     });
  //   return url;
  // }, []);

  return (
    <>
      <Head>
        <title>EVE XCS – Locations</title>
        <meta property="og:title" content="EVE XCS - Manage Locations" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.jpeg" />
      </Head>
      <CreateLocationDialog
        isOpen={isCreateLocationModalOpen}
        onClose={onCreateLocationModalClose}
        selectedOrganization={selectedOrganization}
        onCreate={(id) => {
          push(`/platform/locations/${id}`);
        }}
      />
      <Container maxW={"full"} p={8}>
        <Heading>Locations</Heading>
        <HStack
          display={"flex"}
          py={4}
          justify={"flex-start"}
          align={"flex-end"}
          spacing={4}
        >
          <FormControl w={"fit-content"}>
            <FormLabel>Organization</FormLabel>
            <>
              <Select
                value={selectedOrganization?.name}
                onChange={(e) => {
                  const organization = organizations.find(
                    (organization: any) => organization.name === e.target.value
                  );
                  setSelectedOrganization(organization);
                }}
                minW={"200px"}
                isReadOnly={organizationsLoading}
                // icon={<FaBuilding />}
                // iconSize="sm"
              >
                {organizations?.map((organization: any) => (
                  <option key={organization.id} value={organization.name}>
                    {organization.name}
                  </option>
                ))}
              </Select>
            </>
          </FormControl>
          <Button
            leftIcon={<MdOutlineAddCircle />}
            onClick={onCreateLocationModalOpen}
            isDisabled={!selectedOrganization}
          >
            Create
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
            <Text>You are currently not a member of any organization.</Text>
          ) : (
            <Flex>
              {locations.length === 0 ? (
                <Text>
                  This organization does not have any locations yet.{" "}
                  <Text as={"span"}>
                    <Button
                      variant={"link"}
                      color={"unset"}
                      textDecor={"underline"}
                      textUnderlineOffset={4}
                      onClick={onCreateLocationModalOpen}
                      _hover={{
                        color: useColorModeValue("gray.600", "gray.400"),
                      }}
                    >
                      Create one
                    </Button>
                  </Text>{" "}
                  to get started.
                </Text>
              ) : (
                <Stack direction={"row"}>
                  {locations?.map((location: any) => (
                    <Flex
                      key={location.id}
                      w={"384px"}
                      h={"auto"}
                      py={4}
                      px={8}
                      borderWidth={1}
                      borderRadius={"xl"}
                      borderColor={useColorModeValue("gray.200", "gray.700")}
                      mr={4}
                      aspectRatio={2 / 1}
                      align={"center"}
                      justify={"space-between"}
                      flexDir={"column"}
                    >
                      <Box mb={4} w={"full"}>
                        <Heading size={"lg"} mb={2}>
                          {location.name}
                        </Heading>
                        {/* <Image
                        src={experienceToThumbnail(location?.roblox?.placeId)}
                        alt={location.name}
                      /> */}
                        <Text fontSize={"sm"} mb={2}>
                          {location.description}
                        </Text>
                        <Text fontSize={"xs"}>
                          Updated at{" "}
                          {new Date(location.updatedAt).toDateString()}
                        </Text>
                      </Box>
                      <Stack w={"full"}>
                        <Button
                          as={NextLink}
                          href={`/platform/locations/${location.id}`}
                          variant={"solid"}
                          w={"full"}
                        >
                          View
                        </Button>
                      </Stack>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Flex>
          )}
        </Box>
      </Container>
    </>
  );
}

PlatformLocations.getLayout = (page: any) => <Layout>{page}</Layout>;
