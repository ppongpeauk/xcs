import { useAuthContext } from '@/contexts/AuthContext';
import { Organization, OrganizationMember, User } from '@/types';
import {
  Tabs,
  Anchor,
  Avatar,
  Button,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  Tooltip,
  rem,
  Loader,
  LoadingOverlay,
  useMantineColorScheme,
  MantineComponent,
  Box,
  ButtonGroup
} from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconIdBadge,
  IconKey,
  IconKeyframe,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
  IconTrash
} from '@tabler/icons-react';
import { MultiFactorUser } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const iconStyle = { width: rem(14), height: rem(14) };

export default function ManageMember({
  member: { id },
  organization,
  user,
  onClose
}: {
  member: OrganizationMember;
  organization: Organization;
  user: any;
  onClose: (doRefresh: boolean) => void;
}) {
  const { push } = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const [member, setMember] = useState<OrganizationMember>();
  const refreshMember = useCallback(async () => {
    const token = await user.getIdToken();
    await fetch(`/api/v2/organizations/${organization.id}/members/${id}`, {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return res.json().then((json) => {
            throw new Error(json.message);
          });
        }
      })
      .then((json) => {
        setMember(json);
      })
      .catch((err) => {
        notifications.show({
          message: err.message,
          autoClose: 5000,
          color: 'red'
        });
      });
  }, [id, organization.id, user]);

  useEffect(() => {
    refreshMember();
  }, [refreshMember]);

  return (
    <Flex
      pos={'relative'}
      mih={512}
      direction={'column'}
    >
      <>
        {!member ? (
          <Loader
            size={32}
            color="var(--mantine-color-default-color)"
            style={{
              margin: 'auto'
            }}
          />
        ) : (
          <>
            <Group h={'fit-content'}>
              <Tooltip.Floating label={member?.displayName}>
                <Avatar
                  src={member?.avatar}
                  alt={member?.name}
                  radius="100%"
                  size={'xl'}
                  style={{
                    filter: member?.joined ? 'none' : 'grayscale(100%)'
                  }}
                />
              </Tooltip.Floating>
              <Flex
                direction={'column'}
                c={member?.joined ? 'unset' : 'var(--mantine-color-placeholder)'}
              >
                <Title order={5}>{member?.displayName}</Title>
                <Text size={'sm'}>
                  @{member?.username}
                  {member?.id === organization.ownerId ? ' — Organization Owner' : ''}
                  {!member?.joined ? ' — Invitation Pending' : ''}
                </Text>
                <Group
                  mt={8}
                  gap={8}
                >
                  <Button
                    w={128}
                    size="xs"
                    variant={'default'}
                    onClick={() => {
                      push(`/@${member?.username}`);
                      onClose(false);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant={'filled'}
                    size="xs"
                    color={'red'}
                    onClick={() => {
                      modals.openConfirmModal({
                        title: <Title order={4}>Remove member from organization?</Title>,
                        children: <Text size="sm">Are you sure you want to remove this member?</Text>,
                        labels: { confirm: 'Remove member', cancel: 'Nevermind' },
                        confirmProps: { color: 'red' },
                        onConfirm: () => {
                          user.getIdToken().then((token: string) => {
                            fetch(`/api/v2/organizations/${organization?.id}/members/${member?.uuid}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` }
                            })
                              .then((res) => {
                                if (res.status === 200) return res.json();
                                throw new Error(`Failed to remove member. (${res.status})`);
                              })
                              .then((res) => {
                                onClose(true);
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
                  >
                    <IconTrash style={iconStyle} />
                  </Button>
                </Group>
              </Flex>
            </Group>
            <Tabs
              variant="outline"
              defaultValue="gallery"
              pt={16}
            >
              <Tabs.List>
                <Tabs.Tab
                  value="gallery"
                  leftSection={<IconPhoto style={iconStyle} />}
                >
                  Gallery
                </Tabs.Tab>
                <Tabs.Tab
                  value="messages"
                  leftSection={<IconKey style={iconStyle} />}
                >
                  Permissions
                </Tabs.Tab>
                <Tabs.Tab
                  value="swipe-data"
                  leftSection={<IconIdBadge style={iconStyle} />}
                >
                  Swipe Data
                </Tabs.Tab>
                <Tabs.Tab
                  value="settings"
                  leftSection={<IconSettings style={iconStyle} />}
                >
                  Advanced Settings
                </Tabs.Tab>
              </Tabs.List>

              <Flex pt={16}>
                <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

                <Tabs.Panel
                  value="swipe-data"
                  w={'100%'}
                  h={'100%'}
                  style={{ flexGrow: 1 }}
                >
                  <Flex
                    miw={512}
                    w={'100%'}
                    h={'320px'}
                    style={{ flexGrow: 1 }}
                    direction={'column'}
                    pb={16}
                  >
                    <Editor
                      language="json"
                      theme={'vs-dark'}
                      options={{
                        minimap: {
                          enabled: true
                        }
                      }}
                      // value={form.values?.scanData}
                      // onChange={(value) => {
                      //   form.setFieldValue('scanData', value);
                      // }}
                    />
                  </Flex>
                  <Button variant={'default'}>Save Changes</Button>
                </Tabs.Panel>

                <Tabs.Panel value="settings">
                  <></>
                </Tabs.Panel>
              </Flex>
            </Tabs>
          </>
        )}
      </>
    </Flex>
  );
}
