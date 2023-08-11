/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Code,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  Skeleton,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';

import { Link } from '@chakra-ui/next-js';
import { FaBuilding, FaUserAlt } from 'react-icons/fa';
import { MdOutlineAddCircle } from 'react-icons/md';

import { AsyncSelect, CreatableSelect, Select } from 'chakra-react-select';
import moment from 'moment';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import Layout from '@/layouts/PlatformLayout';

import CreateLocationDialog from '@/components/CreateLocationDialog';
import { Location } from '@/types';
import { BiGrid, BiRefresh } from 'react-icons/bi';
import { BsListUl } from 'react-icons/bs';


function TableEntry({ key, location, skeleton }: { key: number | string, location?: Location, skeleton?: boolean }) {
  const toRelativeTime = useMemo(() => (date: string) => {
    return moment(new Date(date)).fromNow();
  }, []);

  return <>
    <Tr key={key}>
      <Td>
        <Stack flexDir={'row'} align={'center'}>
          <Skeleton isLoaded={!skeleton}>
            <Avatar as={Link} href={location?.roblox?.place ? `https://www.roblox.com/games/${location?.roblox?.place?.rootPlaceId}/game` : `/locations/${location?.id}`} target={location?.roblox?.place ? '_blank' : '_self'} transition={'opacity 0.2s ease-out'} _hover={{ opacity: 0.75 }} _active={{ opacity: 0.5 }} borderRadius={'lg'} size={'md'} src={location?.roblox?.place?.thumbnail || '/images/default-avatar.png'} />
          </Skeleton>

          <Flex flexDir={'column'} mx={2} justify={'center'}>
            <Skeleton isLoaded={!skeleton}>
              <Text fontWeight={'bold'}>
                {!skeleton ? location?.name : "Location Name"}
              </Text>
              {!skeleton && location?.roblox?.place && (
                <Text variant={'subtext'}>
                  {location?.roblox?.place?.name}
                </Text>
              )}
              <Flex align={'center'} color={'gray.500'} gap={1}>
                <Icon as={BiRefresh} />
                <Text size={'sm'}>
                  {!skeleton ? toRelativeTime(location?.updatedAt as string) : "Last Updated"}
                </Text>
              </Flex>
              <Text variant={'subtext'}>
                {!skeleton ? location?.description || "No description available." : "Location Description"}
              </Text>
            </Skeleton>
          </Flex>
        </Stack>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <ButtonGroup>
            {
              location?.roblox?.place && (
                <Button
                  as={Link}
                  href={`https://www.roblox.com/games/${location?.roblox?.place?.rootPlaceId}/game`}
                  target='_blank'
                  size={"sm"}
                  variant={"solid"}
                  colorScheme='gray'
                  textDecor={"unset !important"}
                >
                  View Experience
                </Button>
              )
            }
            <Button
              as={Link}
              href={`/locations/${location?.id}/general`}
              size={"sm"}
              variant={"solid"}
              colorScheme='blue'
              textDecor={"unset !important"}
            >
              View Details
            </Button>
          </ButtonGroup>
        </Skeleton>
      </Td>
    </Tr >
  </>
}

export default function PlatformLocations() {
  const { query, push } = useRouter();

  // Fetch locations
  const [locations, setLocations] = useState<any>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);
  const [filteredLocations, setFilteredLocations] = useState<any>([]);

  // Fetch organizations
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState<boolean>(true);

  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);

  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);

  const [view, setView] = useState<'list' | 'grid' | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const {
    isOpen: isCreateLocationModalOpen,
    onOpen: onCreateLocationModalOpen,
    onClose: onCreateLocationModalClose
  } = useDisclosure();

  const toRelativeTime = useMemo(() => (date: string) => {
    return moment(new Date(date)).fromNow();
  }, []);

  const refreshOrganizations = useCallback(async () => {
    if (!user) return;
    await user.getIdToken().then(async (token: string) => {
      await fetch('/api/v1/me/organizations', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          setOrganizations(data.organizations);
          if (data?.organizations?.length === 0) {
            setOrganizationsLoading(false);
          }
        })
        .finally(() => {
          setOrganizationsLoading(false);
        });
    });
  }, [user]);

  const refreshLocations = useCallback(async () => {
    if (!user) return;
    if (!selectedOrganization) return;
    setLocationsLoading(true);
    await user.getIdToken().then(async (token: string) => {
      await fetch(`/api/v1/organizations/${selectedOrganization.id}/locations`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          setTimeout(() => {
            setLocations(data.locations);
            setLocationsLoading(false);
          }, 100);
        })
    });
  }, [selectedOrganization, user]);

  const filterLocations = useCallback((query: string) => {
    if (!query) {
      setFilteredLocations(locations);
      return;
    }
    const filtered = locations.filter((location: Location) => {
      return location.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredLocations(filtered);
  }, [locations]);

  useEffect(() => {
    if (!user) return;
    refreshOrganizations();
  }, [user, refreshOrganizations]);

  useEffect(() => {
    if (!user || !selectedOrganization) return;
    refreshLocations();
  }, [selectedOrganization, user, refreshLocations]);

  useEffect(() => {
    if (!organizations) return;
    setSelectedOrganization(organizations[0]);
  }, [organizations]);

  useEffect(() => {
    if (!query.organization) return;
    const organization = organizations.find((organization: any) => organization.id === query.organization);
    setSelectedOrganization(organization);
  }, [organizations, query.organization]);

  useEffect(() => {
    // load view option from local storage
    const viewOption = localStorage.getItem('locationView');
    if (viewOption) {
      setView(viewOption as 'list' | 'grid');
    } else {
      setView('list');
      localStorage.setItem('locationView', 'list');
    }
  }, []);

  useEffect(() => {
    // cache view option in local storage
    if (!view) return;
    localStorage.setItem('locationView', view);
  }, [view]);

  useEffect(() => {
    if (!locations) return;
    setFilteredLocations(locations);
  }, [locations]);

  return (
    <>
      <Head>
        <title>Restrafes XCS – Locations</title>
        <meta
          property="og:title"
          content="Restrafes XCS - Manage Locations"
        />
        <meta
          property="og:site_name"
          content="Restrafes XCS"
        />
        <meta
          property="og:url"
          content="https://xcs.restrafes.co"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:image"
          content="/images/logo-square.jpeg"
        />
      </Head>
      <CreateLocationDialog
        isOpen={isCreateLocationModalOpen}
        onClose={onCreateLocationModalClose}
        selectedOrganization={selectedOrganization}
        onCreate={(id) => {
          push(`/locations/${id}`);
        }}
      />
      <Container
        maxW={'full'}
        p={8}
      >
        <Text
          as={'h1'}
          fontSize={'4xl'}
          fontWeight={'900'}
        >
          Locations
        </Text>
        <Stack
          flexDir={{ base: 'column', lg: 'row' }}
          display={'flex'}
          justify={'flex-start'}
          gap={4}
          pt={4}
        >
          <Button
            leftIcon={<MdOutlineAddCircle />}
            onClick={onCreateLocationModalOpen}
            isDisabled={!selectedOrganization}
          >
            New Location
          </Button>
          <FormControl w={{ base: 'full', md: '320px' }}>
            <Select
              value={
                {
                  label: selectedOrganization?.name,
                  value: selectedOrganization?.id
                } as any
              }
              onChange={(e: { label: string; value: string }) => {
                const organization = organizations.find((organization: any) => organization.id === e.value);
                setSelectedOrganization(organization);
              }}
              isReadOnly={organizationsLoading}
              options={
                organizations.map((organization: any) => ({
                  label: organization.name,
                  value: organization.id
                })) || []
              }
              variant='filled'
              selectedOptionStyle="check"
            />
          </FormControl>
          <Input
            placeholder={'Search'}
            variant={'filled'}
            w={{ base: 'full', md: 'auto' }}
            ref={searchRef}
            onChange={(e) => {
              filterLocations(e.target.value);
            }}
          />
          <Spacer />
          <Flex w={'fit-content'} gap={4}>
            <ButtonGroup>
              <IconButton aria-label={'Refresh'} icon={<BiRefresh />}
                onClick={refreshLocations}
              />
            </ButtonGroup>
            <ButtonGroup isAttached>
              <IconButton aria-label={'List'} variant={view === "list" ? "solid" : "unselected"} onClick={() => { setView('list') }} icon={<BsListUl />} />
              <IconButton aria-label={'Grid'} variant={view === "grid" ? "solid" : "unselected"} onClick={() => { setView('grid') }} icon={<BiGrid />} />
            </ButtonGroup>
          </Flex>
        </Stack>
        <Box w={"full"}>
          <Flex
            as={Stack}
            direction={'row'}
            h={'full'}
            spacing={4}
            overflow={'auto'}
            flexWrap={'wrap'}
          >
            {
              organizations.length ? (view === 'list' ? (
                <TableContainer
                  py={2}
                  maxW={{ base: 'full' }}
                  overflowY={'auto'}
                  flexGrow={1}
                  px={4}
                >
                  <Table size={{ base: 'md', md: 'md' }}>
                    <Thead>
                      <Tr>
                        <Th>Location</Th>
                        <Th isNumeric>Actions</Th>
                      </Tr>
                    </Thead>
                    {/* display list of organizations */}
                    <Tbody>
                      {
                        locationsLoading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <TableEntry key={i} location={undefined} skeleton={true} />
                          ))
                        ) : (filteredLocations.map((location: Location) => (
                          <TableEntry key={location.id as string} location={location} skeleton={false} />
                        )))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Flex py={8} gap={4} wrap={'wrap'}>
                  {
                    locationsLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <Flex key={i} flexDir={'column'} w={{ base: 'full', md: '224px' }}>
                          <Skeleton>
                            <Flex
                              border={'1px solid'}
                              borderRadius={'lg'}
                              borderColor={useColorModeValue('gray.200', 'gray.700')}
                              aspectRatio={1}
                            >
                            </Flex>
                          </Skeleton>
                          <Flex py={4} flexDir={'column'} textUnderlineOffset={4} gap={2}>
                            <Skeleton>
                              <Heading
                                as={'h3'}
                                size={'md'}
                                fontWeight={'bold'}
                              >
                                Location
                              </Heading>
                            </Skeleton>
                            <Skeleton>
                              <Text color={"gray.500"}>
                                Author
                              </Text>
                            </Skeleton>
                            <Flex align={'center'} color={'gray.500'} gap={1} fontSize={'md'}>
                              <Skeleton>
                                <Text color={'gray.500'}>
                                  Updated Date
                                </Text>
                              </Skeleton>
                            </Flex>
                          </Flex>
                        </Flex>
                      ))
                    ) : (
                      filteredLocations.map((location: Location) => (
                        <Flex key={location.id} flexDir={'column'} w={{ base: 'full', md: '224px' }}>
                          {/* icon */}
                          <Flex
                            border={'1px solid'}
                            borderRadius={'lg'}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                            aspectRatio={1}
                          >
                            <Link href={`/locations/${location.id}/general`}>
                              <Avatar
                                ignoreFallback={true}
                                borderRadius={'lg'}
                                size={'lg'}
                                src={location?.roblox?.place?.thumbnail || '/images/default-avatar.png'}
                                cursor={'pointer'}
                                w={'full'}
                                h={'full'}
                                transition={'opacity 0.2s ease-out'} _hover={{ opacity: 0.75 }} _active={{ opacity: 0.5 }}
                              />
                            </Link>
                          </Flex>
                          {/* text */}
                          <Flex p={4} flexDir={'column'} textUnderlineOffset={4}>
                            <Heading
                              as={'h3'}
                              size={'md'}
                              fontWeight={'bold'}
                            >
                              <Link href={`/locations/${location.id}/edit`}>
                                {location.name}
                              </Link>
                            </Heading>
                            <Flex align={'center'} color={'gray.500'} gap={1} fontSize={'md'}>
                              <Icon as={BiRefresh} />
                              <Text color={'gray.500'}>
                                {!organizationsLoading ? toRelativeTime(location.updatedAt) : "Last Updated"}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      ))
                    )
                  }
                </Flex>
              )) : null}
            {
              !locationsLoading && filteredLocations.length === 0 && (
                <Flex
                  flexDir={'column'}
                  align={'center'}
                  justify={'center'}
                  w={'full'}
                  h={'full'}
                  py={4}
                >
                  <Text fontSize={'2xl'} fontWeight={'bold'}>No Locations Found</Text>
                  <Text color={'gray.500'}>Try adjusting your search query or creating a new location.</Text>
                </Flex>
              )
            }
            {
              !organizationsLoading && !organizations.length && (
                <Flex
                  flexDir={'column'}
                  align={'center'}
                  justify={'center'}
                  w={'full'}
                  h={'full'}
                  py={16}
                >
                  <Text fontSize={'2xl'} fontWeight={'bold'}>No Organizations Found</Text>
                  <Text color={'gray.500'}>Create or join a new organization to get started.</Text>
                </Flex>
              )
            }
          </Flex>
        </Box>
      </Container >
    </>
  );
}

PlatformLocations.getLayout = (page: any) => <Layout>{page}</Layout>;
