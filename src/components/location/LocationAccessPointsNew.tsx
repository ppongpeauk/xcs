/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { DataTable, type DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';

import CreateAccessPointDialog from '@/components/CreateAccessPointDialog';
import { useAuthContext } from '@/contexts/AuthContext';
import { AccessPoint, Location } from '@/types';
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
  useMantineColorScheme
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
  IconPlus
} from '@tabler/icons-react';
import { default as sortBy } from 'lodash/sortBy';
import { default as moment } from 'moment';
import { useRouter } from 'next/navigation';
import CreateAccessPoint from '../modals/access-points/CreateAccessPoint';
import { modals } from '@mantine/modals';

const PAGE_SIZE = 15;

export default function LocationAccessPoints({ idToken, location, refreshData }: any) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<any>>({
    columnAccessor: 'name',
    direction: 'asc'
  });
  const [query, setQuery] = useState('');
  const [tagQuery, setTagQuery] = useState<string[]>([]);

  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [records, setRecords] = useState<any[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [accessPoints, setAccessPoints] = useState<any>(null);
  const { user } = useAuthContext();
  const { push } = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const [isCreateModalOpen, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);

  const [tagsOptions, setTagsOptions] = useState<any>([]);

  // get tags
  useEffect(() => {
    if (!accessPoints) return;
    let res = [] as string[];
    accessPoints?.accessPoints?.forEach((accessPoint: any) => {
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
  }, [accessPoints]);

  useEffect(() => {
    const data = sortBy(accessPoints?.accessPoints, sortStatus.columnAccessor) as AccessPoint[];
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

  useEffect(() => {
    if (!location) return;
    if (!user) return;
    user.getIdToken().then((token: string) => {
      fetch(`/api/v1/locations/${location.id}/access-points`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          throw new Error(`Failed to fetch access points. (${res.status})`);
        })
        .then((data) => {
          setAccessPoints(data);
          setRecords(sortBy(data.accessPoints, 'name'));
        })
        .catch((err) => {});
    });
  }, [location, user]);

  return (
    <>
      <CreateAccessPoint
        opened={isCreateModalOpen}
        onClose={closeCreateModal}
        location={location}
        accessPoints={accessPoints?.accessPoints || []}
        tagsOptions={tagsOptions}
        refresh={refreshData}
      />

      <Button.Group pb={16}>
        <Button
          leftSection={<IconPlus size={'16px'} />}
          variant={'default'}
          onClick={openCreateModal}
        >
          New Access Point
        </Button>
        {/* <BulkActionMenu
          selectedRecords={selectedRecords}
          location={location}
          refresh={refreshData}
        /> */}
        <Button
          variant="default"
          onClick={() => {
            refreshData();
          }}
        >
          <IconRefresh size={16} />
        </Button>
      </Button.Group>

      {/* Main Datatable */}
      <DataTable
        minHeight={480}
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        pinLastColumn
        noRecordsText="No access points found."
        columns={[
          {
            accessor: 'name',
            title: 'Name',
            sortable: true,
            filter: (
              <TextInput
                label="Access Point Name"
                description="Show all access points which names include the specified text."
                placeholder="Search access point..."
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
            render: ({ name, config: { active, armed } }) => {
              return (
                <Flex style={{ gap: 8, alignItems: 'center' }}>
                  <Text style={{ background: 'transparent' }}>{name}</Text>
                </Flex>
              );
            }
          },
          {
            accessor: 'tags',
            title: 'Tags',
            hidden: tagsOptions.length === 0,
            filter: (
              <MultiSelect
                label="Tags"
                description="Show all access points that possess the specified tags."
                data={tagsOptions}
                value={tagQuery}
                placeholder="Search tags..."
                onChange={setTagQuery}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: tagQuery.length > 0,
            render: ({ tags }) => {
              return (
                <Flex style={{ gap: 8, alignItems: 'center' }}>
                  {(tags || []).map((tag: any) => {
                    return (
                      <Pill
                        key={tag}
                        bg={colorScheme === 'dark' ? 'dark.4' : undefined}
                      >
                        {tag}
                      </Pill>
                    );
                  })}
                </Flex>
              );
            }
          },
          {
            accessor: 'id',
            title: 'ID',
            textAlign: 'left',
            width: 120,
            render: ({ id }) => {
              return (
                <Flex align={'center'}>
                  <Code style={{ background: 'transparent' }}>{id}</Code>
                  <Tooltip.Floating label="Copy ID">
                    <Flex align={'center'}>
                      <CopyButton value={id}>
                        {({ copied, copy }) => (
                          <ActionIcon
                            variant="transparent"
                            size="xs"
                            color={colorScheme === 'dark' ? 'white' : 'black'}
                            onClick={copy}
                          >
                            {copied ? <IconCheck /> : <IconCopy />}
                          </ActionIcon>
                        )}
                      </CopyButton>
                    </Flex>
                  </Tooltip.Floating>
                </Flex>
              );
            }
          },
          {
            accessor: 'status',
            title: 'Status',
            render: ({ config: { active, armed } }) => {
              return (
                <>
                  <Flex style={{ gap: 8 }}>
                    <Tooltip.Floating label={active ? 'Active' : 'Not Active'}>
                      <Box>
                        {active ? (
                          <IconBolt size={16} />
                        ) : (
                          <IconBoltOff
                            color="red"
                            size={16}
                          />
                        )}{' '}
                      </Box>
                    </Tooltip.Floating>
                    <Tooltip.Floating label={armed ? 'Armed' : 'Not Armed'}>
                      <Box>
                        {armed ? (
                          <IconLock size={16} />
                        ) : (
                          <IconLockOpen
                            color="red"
                            size={16}
                          />
                        )}{' '}
                      </Box>
                    </Tooltip.Floating>
                  </Flex>
                </>
              );
            }
          },
          {
            accessor: 'updatedAt',
            title: 'Last Updated',
            render: ({ updatedAt }) => {
              return <Text style={{ background: 'transparent' }}>{moment(updatedAt).fromNow()}</Text>;
            },
            sortable: true
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
                      title: <Title order={4}>Delete access point?</Title>,
                      children: <Text size="sm">Are you sure you want to delete this access point?</Text>,
                      labels: { confirm: 'Delete access point', cancel: "No, don't delete it" },
                      confirmProps: { color: 'red' },
                      onConfirm: () => {
                        user.getIdToken().then((token: string) => {
                          fetch(`/api/v1/access-points/${cell.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                          })
                            .then((res) => {
                              if (res.status === 200) return res.json();
                              throw new Error(`Failed to delete access point. (${res.status})`);
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
                  <IconRecycle size={16} />
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
        selectedRecords={selectedRecords}
        onSelectedRecordsChange={setSelectedRecords}
        // page={page}
        // onPageChange={setPage}
        // totalRecords={records.length}
        // recordsPerPage={2}
        // paginationActiveBackgroundColor={'dark.4'}
        // paginationActiveTextColor="white"
      />
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
