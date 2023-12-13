/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';
import { useCallback, useEffect, useState } from 'react';

import CreateAccessPointDialog from '@/components/CreateAccessPointDialog';
import { useAuthContext } from '@/contexts/AuthContext';
import { AccessPoint, Location, Organization } from '@/types';
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Center,
  Code,
  CopyButton,
  Divider,
  Flex,
  Group,
  MultiSelect,
  Pill,
  PillGroup,
  Space,
  Stack,
  TagsInput,
  Text,
  TextInput,
  Title,
  Tooltip,
  Menu,
  rem,
  useMantineColorScheme,
  LoadingOverlay,
  Image
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {
  IconArrowsLeftRight,
  IconBolt,
  IconBoltOff,
  IconCheck,
  IconClick,
  IconClipboard,
  IconClipboardCheck,
  IconCopy,
  IconEdit,
  IconEye,
  IconLock,
  IconLockAccess,
  IconLockAccessOff,
  IconLockOff,
  IconLockOpen,
  IconPencil,
  IconRecycle,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconShield,
  IconShieldOff,
  IconTrash,
  IconX,
  IconMessageCircle,
  IconPhoto,
  IconBoxMultiple,
  IconTag,
  IconTagOff,
  IconPlus,
  IconLinkPlus,
  IconRowRemove,
  IconTrashX,
  IconUserPlus
} from '@tabler/icons-react';
import { default as sortBy } from 'lodash/sortBy';
import { default as moment } from 'moment';
import { useRouter } from 'next/navigation';
import CreateAccessPoint from '../modals/access-points/CreateAccessPoint';
import { modals } from '@mantine/modals';
import CreateRoutine from '../modals/routines/CreateRoutine';
import { notifications } from '@mantine/notifications';
import CreateOrganization from '../modals/organizations/CreateOrganization';
import CreateMember from '../modals/organizations/CreateMember';

export default function OrganizationMembers({ data, refreshData }: { data: Organization; refreshData: () => void }) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'name',
    direction: 'asc'
  });
  const [query, setQuery] = useState('');
  const [tagQuery, setTagQuery] = useState<string[]>([]);

  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [members, setMembers] = useState<any>(null);
  const { user } = useAuthContext();
  const { push } = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const [isCreateModalOpen, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);

  const [tagsOptions, setTagsOptions] = useState<any>([]);

  // get tags
  useEffect(() => {
    if (!members) return;
    let res = [] as string[];
    members?.forEach((accessPoint: any) => {
      res = [...res, ...(accessPoint?.tags || [])];
    });
    res = [...(new Set(res as any) as any)];
    setTagsOptions([
      ...(new Set(
        res.map((value: string) => {
          return {
            value,
            label: value as string
          };
        })
      ) as any)
    ]);
  }, [members]);

  useEffect(() => {
    const data = sortBy(members, sortStatus.columnAccessor) as AccessPoint[];
    let newRecords = data;
    setRecords(sortStatus.direction === 'desc' ? newRecords.reverse() : newRecords);

    setRecords(
      newRecords.filter(({ name, tags }) => {
        if (debouncedQuery !== '' && !`${name}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())) {
          return false;
        }

        if (tagQuery.length && !tagQuery.some((d) => tags.includes(d))) {
          return false;
        }
        return true;
      })
    );
  }, [sortStatus, debouncedQuery, tagQuery]);

  const refreshMembers = useCallback(async () => {
    if (!user || !data) return;
    const token = await user.getIdToken();
    fetch(`/api/v2/organizations/${data?.id}/members`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error(`Failed to fetch members. (${res.status})`);
      })
      .then((data) => {
        setMembers(data);
        setRecords(sortBy(data, 'name'));
      })
      .catch((error) => {
        notifications.show({
          title: 'There was an error fetching members.',
          message: error.message,
          color: 'red'
        });
      });
  }, [location, user, data]);

  useEffect(() => {
    if (!location) return;
    if (!user || !data) return;
    console.log('refreshing members');
    refreshMembers();
  }, [location, user, data]);

  return (
    <>
      <CreateMember
        opened={isCreateModalOpen}
        onClose={closeCreateModal}
        organization={data}
        refresh={refreshData}
      />

      <Button.Group pb={16}>
        <Button
          leftSection={<IconUserPlus size={'16px'} />}
          variant={'default'}
          onClick={openCreateModal}
        >
          Add Member
        </Button>
        <Button
          leftSection={<IconLinkPlus size={'16px'} />}
          variant={'default'}
          onClick={openCreateModal}
        >
          Create Invite Link
        </Button>
        {/* <BulkActionMenu
          selectedRecords={selectedRecords}
          location={location}
          refresh={refreshData}
        /> */}
        <Button
          variant="default"
          onClick={() => {
            refreshMembers();
          }}
        >
          <IconRefresh size={16} />
        </Button>
      </Button.Group>

      {/* Main Datatable */}
      <Box pos={'relative'}>
        <LoadingOverlay
          visible={!members}
          zIndex={4}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ size: 'md', color: 'var(--mantine-color-default-color)' }}
        />
        <DataTable
          minHeight={480}
          withTableBorder
          withColumnBorders
          striped
          highlightOnHover
          pinLastColumn
          noRecordsText="No members found."
          columns={[
            {
              accessor: 'name',
              title: 'Name',
              sortable: true,
              filter: (
                <TextInput
                  label="Member Name"
                  description="Show all members which names include the specified text."
                  placeholder="Search member..."
                  leftSection={<IconSearch size={16} />}
                  rightSection={
                    <ActionIcon
                      size="sm"
                      variant="transparent"
                      c="dimmed"
                      onClick={() => setQuery('')}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  }
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                />
              ),
              filtering: query !== '',
              render: ({ username, displayName, avatar }) => {
                return (
                  <Flex style={{ gap: 12, alignItems: 'center' }}>
                    <Image
                      src={avatar}
                      alt={displayName}
                      width={48}
                      height={48}
                      radius={'xl'}
                    />
                    <Stack gap={0}>
                      <Text
                        style={{ background: 'transparent' }}
                        size={'sm'}
                        fw={'bold'}
                      >
                        {displayName}
                      </Text>
                      <Text
                        style={{ background: 'transparent' }}
                        size={'sm'}
                      >
                        @{username}
                      </Text>
                    </Stack>
                  </Flex>
                );
              }
            },
            {
              accessor: 'createdAt',
              title: 'Join Date',
              sortable: true,
              render: (cell) => moment(cell.joinedAt).calendar()
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
                  gap={4}
                  justify="right"
                  wrap="nowrap"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      push(`/access-points/${cell.id}`);
                    }}
                    color={colorScheme === 'dark' ? 'white' : 'black'}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => {
                      modals.openConfirmModal({
                        title: <Title order={4}>Remove member from organization?</Title>,
                        children: <Text size="sm">Are you sure you want to remove this member?</Text>,
                        labels: { confirm: 'Remove member', cancel: 'Nevermind' },
                        confirmProps: { color: 'red' },
                        onConfirm: () => {
                          user.getIdToken().then((token: string) => {
                            fetch(`/api/v1/access-points/${cell.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` }
                            })
                              .then((res) => {
                                if (res.status === 200) return res.json();
                                throw new Error(`Failed to remove member. (${res.status})`);
                              })
                              .then(() => {
                                refreshData();
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          });
                        }
                      });
                    }}
                    color={'red'}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              )
            }
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          records={records}
          rowExpansion={{
            content: ({ record }) => (
              <Box p={16}>
                <Text c={!!record.description ? 'unset' : 'dark.2'}>
                  {record.description || 'No description available.'}
                </Text>
              </Box>
            )
          }}
          // selectedRecords={selectedRecords}
          // onSelectedRecordsChange={setSelectedRecords}
          // page={1}
          // onPageChange={() => {}}
          // totalRecords={records.length}
          // recordsPerPage={16}
          // paginationActiveTextColor={colorScheme === 'dark' ? 'dark' : 'gray'}
        />
      </Box>
    </>
  );
}

function BulkActionMenu({
  selectedRecords,
  location,
  refresh
}: {
  selectedRecords: AccessPoint[];
  location: Location;
  refresh: () => void;
}) {
  return (
    <>
      <Menu
        shadow="md"
        width={200}
      >
        <Menu.Target>
          <Button
            variant={'default'}
            leftSection={<IconBoxMultiple size={16} />}
            // disabled={selectedRecords.length === 0}
            disabled
          >
            Bulk Actions
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Tags</Menu.Label>
          <Menu.Item
            disabled
            leftSection={<IconTag size={16} />}
          >
            Add Tag
          </Menu.Item>
          <Menu.Item
            disabled
            leftSection={<IconTagOff size={16} />}
          >
            Remove Tag
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            color="red"
            leftSection={<IconRecycle size={16} />}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
