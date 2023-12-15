// react
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';

// components
import {
  Flex,
  Text,
  Button,
  Select,
  TextInput,
  Title,
  Container,
  Image,
  Center,
  Group,
  ActionIcon,
  useMantineColorScheme,
  Stack,
  Box,
  Tooltip,
  Anchor
} from '@mantine/core';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import CreateLocationDialog from '@/components/CreateLocationDialog';
import { Location, Organization } from '@/types';
import { IconClick, IconEdit, IconPencil, IconPlus, IconRefresh, IconSearch, IconX } from '@tabler/icons-react';
import NextLink from 'next/link';

// contexts
import { useAuthContext } from '@/contexts/AuthContext';

// utils
import moment from 'moment';

// layouts
import Layout from '@/layouts/LayoutPlatform';
import { useDebouncedValue } from '@mantine/hooks';
import { default as sortBy } from 'lodash/sortBy';
import CreateLocation from '@/components/modals/locations/CreateLocation';
import InfoLink from '@/components/InfoLink';

export default function PlatformLocations() {
  const { query, push } = useRouter();

  // Fetch locations
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);
  const [filteredLocations, setFilteredLocations] = useState<any>([]);

  // Fetch organizations
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState<boolean>(true);

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const { user } = useAuthContext();

  const searchRef = useRef<HTMLInputElement>(null);
  const { colorScheme } = useMantineColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 200);
  const [records, setRecords] = useState<any[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'name',
    direction: 'asc'
  });

  const {
    isOpen: isCreateLocationModalOpen,
    onOpen: onCreateLocationModalOpen,
    onClose: onCreateLocationModalClose
  } = useDisclosure();

  const refreshOrganizations = useCallback(async () => {
    if (!user) return;
    await user.getIdToken().then(async (token: string) => {
      await fetch('/api/v2/me/organizations', {
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
        });
    });
  }, [selectedOrganization, user]);

  const filterLocations = useCallback(
    (query: string) => {
      if (!query) {
        setFilteredLocations(locations);
        return;
      }
      const filtered = locations.filter((location: Location) => {
        return location.name.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredLocations(filtered);
    },
    [locations]
  );

  useEffect(() => {
    if (!user) return;
    refreshOrganizations();
  }, [user, refreshOrganizations]);

  useEffect(() => {
    if (!user || !selectedOrganization) return;
    refreshLocations();
    localStorage.setItem('defaultOrganization', selectedOrganization.id);
  }, [selectedOrganization, user, refreshLocations]);

  useEffect(() => {
    if (!organizations) return;
    setSelectedOrganization(organizations[0]);
  }, [organizations]);

  useEffect(() => {
    if (!query.organization) {
      const defaultOrganization = localStorage.getItem('defaultOrganization');
      if (organizations && defaultOrganization) {
        const organizationOption = organizations.find((organization: any) => organization.id === defaultOrganization);
        if (!organizationOption) return;
        setSelectedOrganization(organizationOption);
      }
      return;
    }
    const organization = organizations.find((organization: any) => organization.id === query.organization);
    setSelectedOrganization(organization);
  }, [organizations, query.organization]);

  useEffect(() => {
    if (!locations) return;
    setFilteredLocations(locations);
    setRecords(sortBy(locations, 'name'));
  }, [locations]);

  useEffect(() => {
    const data = sortBy(locations, sortStatus.columnAccessor) as Location[];
    let newRecords = data;
    setRecords(sortStatus.direction === 'desc' ? newRecords.reverse() : newRecords);

    setRecords(
      newRecords.filter(({ name }) => {
        if (debouncedQuery !== '' && !`${name}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())) {
          return false;
        }
        return true;
      })
    );
  }, [sortStatus, debouncedQuery]);

  return (
    <>
      <Head>
        <title>Locations - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Manage Locations - Restrafes XCS"
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
          content="/images/logo-square.jpg"
        />
      </Head>
      {/* <CreateLocationDialog
        isOpen={isCreateLocationModalOpen}
        onClose={onCreateLocationModalClose}
        selectedOrganization={selectedOrganization}
        onCreate={(id) => {
          push(`/locations/${id}/general`);
        }}
      /> */}
      <CreateLocation
        opened={isCreateLocationModalOpen}
        onClose={onCreateLocationModalClose}
        refresh={refreshLocations}
        organization={selectedOrganization as Organization}
      />
      {/* main container */}
      <Container
        size={'100%'}
        pt={16}
      >
        {/* page title */}
        <Title fw={'bold'}>
          Locations
          <InfoLink
            title="Locations"
            description="Locations are the places where your experiences are hosted. Each Roblox experience corresponds to a location."
          />
        </Title>
        {/* buttons */}
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          display={'flex'}
          justify={'flex-start'}
          gap={8}
          py={16}
        >
          <Tooltip.Floating
            disabled={!!selectedOrganization}
            label={'Select an organization before creating a location.'}
          >
            <span>
              <Button
                leftSection={<IconPlus size={16} />}
                color={'dark.5'}
                onClick={onCreateLocationModalOpen}
                disabled={!selectedOrganization}
              >
                New Location
              </Button>
            </span>
          </Tooltip.Floating>
          <Select
            disabled={organizationsLoading || organizations.length === 0}
            value={selectedOrganization?.id}
            onChange={(id: string | null) => {
              const organization = organizations.find((organization: Organization) => organization.id === id);
              setSelectedOrganization(organization);
            }}
            readOnly={organizationsLoading}
            data={
              organizations.map((organization: Organization) => ({
                label: organization.name,
                value: organization.id
              })) || []
            }
            allowDeselect={false}
          />
          <Flex
            w={'fit-content'}
            gap={8}
          >
            <Button
              aria-label={'Refresh'}
              color="dark.5"
              onClick={refreshLocations}
              p={0}
              style={{
                aspectRatio: 1
              }}
            >
              <IconRefresh size={16} />
            </Button>
          </Flex>
        </Flex>
        {/* main table */}
        <DataTable
          minHeight={480}
          noRecordsText="No locations found."
          records={records}
          withTableBorder
          withColumnBorders
          striped
          highlightOnHover
          pinLastColumn
          columns={[
            {
              accessor: 'name',
              title: 'Name',
              sortable: true,
              filter: (
                <TextInput
                  label="Location Name"
                  description="Show locations which names include the specified text"
                  placeholder="Search location..."
                  leftSection={<IconSearch size={16} />}
                  rightSection={
                    <ActionIcon
                      size="sm"
                      variant="transparent"
                      c="dimmed"
                      onClick={() => setSearchQuery('')}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
              ),
              filtering: searchQuery !== '',
              render: ({ roblox, name, id }) => {
                return (
                  <Flex
                    direction={'row'}
                    align={'center'}
                    gap={16}
                    my={4}
                  >
                    <Anchor
                      component={NextLink}
                      href={`/locations/${id}/general`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Image
                        src={roblox?.place?.thumbnail || '/images/default-avatar-location.png'}
                        alt={name}
                        w={48}
                        h={48}
                        style={{
                          borderRadius: 4
                        }}
                      />
                    </Anchor>
                    <Flex direction={'column'}>
                      <Text
                        lh={1}
                        fw={'bold'}
                      >
                        {name}
                      </Text>
                      <Text
                        size="sm"
                        c={'dark.2'}
                      >
                        {roblox?.place?.name}
                      </Text>
                    </Flex>
                  </Flex>
                );
              }
            },
            {
              accessor: 'createdAt',
              title: 'Created',
              sortable: true,
              render: (row: any) => <Text>{moment(row.createdAt).fromNow()}</Text>
            },
            {
              accessor: 'updatedAt',
              title: 'Last Updated',
              sortable: true,
              render: (row: any) => <Text>{moment(row.updatedAt).fromNow()}</Text>
            },
            {
              accessor: 'actions',
              title: (
                <Center>
                  <IconClick size={16} />
                </Center>
              ),
              width: '0%',
              textAlign: 'right',
              render: (cell) => (
                <Group
                  gap={8}
                  mx={4}
                  justify="right"
                  wrap="nowrap"
                >
                  {cell?.roblox?.place && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        push(`https://www.roblox.com/games/${cell?.roblox?.place?.rootPlaceId}/game`);
                      }}
                      color={colorScheme === 'dark' ? 'white' : 'dark.5'}
                    >
                      View Experience
                    </Button>
                  )}
                  <Button
                    variant="default"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      push(`/locations/${cell.id}/general`);
                    }}
                    leftSection={<IconEdit size={16} />}
                  >
                    Manage
                  </Button>
                </Group>
              )
            }
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          rowExpansion={{
            content: ({ record }) => (
              <Box p={16}>
                <Text c={!!record.description ? 'unset' : 'dark.2'}>
                  {record.description || 'No description available.'}
                </Text>
              </Box>
            )
          }}
        />
      </Container>
    </>
  );
}

PlatformLocations.getLayout = (page: any) => <Layout>{page}</Layout>;
