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
  Box
} from '@mantine/core';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import CreateLocationDialog from '@/components/CreateLocationDialog';
import { Location, Organization } from '@/types';
import { IconClick, IconEdit, IconPencil, IconRefresh, IconSearch, IconX } from '@tabler/icons-react';

// contexts
import { useAuthContext } from '@/contexts/AuthContext';

// utils
import moment from 'moment';

// layouts
import Layout from '@/layouts/PlatformLayout';
import { useDebouncedValue } from '@mantine/hooks';
import { default as sortBy } from 'lodash/sortBy';
import CreateOrganization from '@/components/modals/organizations/CreateOrganization';

export default function PlatformOrganizations() {
  const { query, push } = useRouter();

  // Fetch locations
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState<boolean>(true);
  const [filteredOrganizations, setFilteredOrganizations] = useState<any>([]);

  // Fetch organizations
  const [organizations, setOrganizations] = useState<any>([]);

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  const { user } = useAuthContext();

  const { colorScheme } = useMantineColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(searchQuery, 200);
  const [records, setRecords] = useState<any[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'name',
    direction: 'asc'
  });

  const {
    isOpen: isCreateOrganizationModalOpen,
    onOpen: onCreateOrganizationModalOpen,
    onClose: onCreateOrganizationModalClose
  } = useDisclosure();

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
        });
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    refreshOrganizations();
  }, [user, refreshOrganizations]);

  useEffect(() => {
    if (!organizations) return;
    setSelectedOrganization(organizations[0]);
  }, [organizations]);

  useEffect(() => {
    if (!organizations) return;
    setFilteredOrganizations(organizations);
    setRecords(sortBy(organizations, 'name'));
  }, [organizations]);

  useEffect(() => {
    const data = sortBy(organizations, sortStatus.columnAccessor) as Location[];
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
        <title>Organizations - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Manage Organizations - Restrafes XCS"
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
      <CreateOrganization
        opened={isCreateOrganizationModalOpen}
        onClose={onCreateOrganizationModalClose}
        refresh={refreshOrganizations}
        organization={selectedOrganization as Organization}
      />
      {/* main container */}
      <Container
        size={'100%'}
        pt={16}
      >
        {/* page title */}
        <Title fw={'bold'}>Organizations</Title>
        {/* buttons */}
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          display={'flex'}
          justify={'flex-start'}
          gap={8}
          py={16}
        >
          <Button
            leftSection={<IconPencil size={16} />}
            color={'dark.5'}
            onClick={onCreateOrganizationModalOpen}
            disabled={!selectedOrganization}
          >
            New Organization
          </Button>
          <Flex
            w={'fit-content'}
            gap={8}
          >
            <Button
              aria-label={'Refresh'}
              color="dark.5"
              onClick={refreshOrganizations}
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
          minHeight={400}
          noRecordsText="No organizations found."
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
                  label="Organization Name"
                  description="Show organizations which names include the specified text"
                  placeholder="Search organization..."
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
              render: ({ avatar, owner, name }) => {
                return (
                  <Flex
                    direction={'row'}
                    align={'center'}
                    gap={16}
                    my={4}
                  >
                    <Image
                      src={avatar || '/images/default-avatar-organization.png'}
                      alt={name}
                      w={48}
                      h={48}
                      style={{
                        borderRadius: 4
                      }}
                    />
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
                        By {owner.displayName}
                      </Text>
                    </Flex>
                  </Flex>
                );
              }
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
                  <Button
                    variant="filled"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      push(`/organizations/${cell.id}/general`);
                    }}
                    color={colorScheme === 'dark' ? 'dark.5' : 'dark.5'}
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
              <Box>
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

PlatformOrganizations.getLayout = (page: any) => <Layout>{page}</Layout>;
