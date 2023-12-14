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
  IconUserPlus,
  IconMailAi,
  IconMailForward,
  IconUser
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
import InfoLink from '../InfoLink';

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
  const { user, currentUser } = useAuthContext();
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

      <Title
        order={2}
        py={4}
        pb={16}
      >
        Member Management
        <InfoLink
          title="Member Management"
          description="Manage all members in this organization by adding, removing, and editing their permissions."
        />
      </Title>
      <Flex>
        <Button.Group pb={16}>
          <Button
            leftSection={<IconUserPlus size={'16px'} />}
            variant={'default'}
            onClick={openCreateModal}
            size="xs"
          >
            Add / Invite Member
          </Button>
          <Button
            leftSection={<IconLinkPlus size={'16px'} />}
            variant={'default'}
            onClick={openCreateModal}
            size="xs"
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
            size="xs"
          >
            <IconRefresh size={16} />
          </Button>
        </Button.Group>
      </Flex>

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
              render: ({ username, displayName, avatar, id, joined }) => {
                return (
                  <Flex
                    style={{ gap: 12, alignItems: 'center' }}
                    py={4}
                  >
                    <Tooltip.Floating label={displayName}>
                      <Image
                        src={avatar || '/images/default-avatar.png'}
                        alt={displayName}
                        width={36}
                        height={36}
                        radius={'xl'}
                        style={{
                          filter: `grayscale(${joined === false ? '100%' : '0%'})`
                        }}
                      />
                    </Tooltip.Floating>
                    <Stack
                      gap={0}
                      c={joined === false ? 'var(--mantine-color-placeholder)' : 'unset'}
                    >
                      <Text
                        style={{ background: 'transparent' }}
                        size={'sm'}
                        fw={'bold'}
                      >
                        {displayName}
                      </Text>
                      <Text
                        style={{ background: 'transparent' }}
                        size={'xs'}
                      >
                        @{username}
                        {data?.owner?.id === id && (
                          <Text
                            component="span"
                            fw={'normal'}
                          >
                            {' '}
                            — Organization Owner
                          </Text>
                        )}
                        {joined === false && (
                          <Text
                            component="span"
                            fw={'bold'}
                          >
                            {' '}
                            — Invitation Pending
                          </Text>
                        )}
                      </Text>
                    </Stack>
                  </Flex>
                );
              }
            },
            {
              accessor: 'type',
              title: 'Type',
              sortable: true,
              render: (cell) => {
                return (
                  <Text
                    style={{ background: 'transparent' }}
                    size={'sm'}
                    fw={'bold'}
                  >
                    {switchCaseMemberType(cell.type)}
                  </Text>
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
                  <Tooltip label="Edit">
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
                  </Tooltip>
                  {cell.type === 'user' && (
                    <Tooltip label="View Profile">
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => {
                          push(`/@${cell.username}`);
                        }}
                        color={colorScheme === 'dark' ? 'white' : 'black'}
                      >
                        <IconUser size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                  {cell.id !== data?.owner?.id && cell.id !== currentUser?.id && (
                    <Tooltip label="Remove Member">
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
                                fetch(`/api/v2/organizations/${data?.id}/members/${cell.uuid || cell.id}`, {
                                  method: 'DELETE',
                                  headers: { Authorization: `Bearer ${token}` }
                                })
                                  .then((res) => {
                                    if (res.status === 200) return res.json();
                                    throw new Error(`Failed to remove member. (${res.status})`);
                                  })
                                  .then((res) => {
                                    refreshMembers();
                                    notifications.show({
                                      message: res.message,
                                      color: 'green'
                                    });
                                  })
                                  .catch((err) => {
                                    notifications.show({
                                      title: 'There was an error removing the member.',
                                      message: err.message,
                                      color: 'red'
                                    });
                                  });
                              });
                            }
                          });
                        }}
                        color={'red'}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              )
            }
          ]}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          records={records}
          // rowExpansion={{
          //   content: ({ record }) => (
          //     <Box p={16}>
          //       <Text c={!!record.description ? 'unset' : 'dark.2'}>
          //         {record.description || 'No description available.'}
          //       </Text>
          //     </Box>
          //   )
          // }}
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

function switchCaseMemberType(type: string) {
  switch (type) {
    case 'user':
      return 'XCS';
    case 'roblox':
      return 'Roblox (User)';
    case 'roblox-group':
      return 'Roblox (Group)';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
}
