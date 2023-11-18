import { useAuthContext } from '@/contexts/AuthContext';
import Layout from '@/layouts/PlatformLayout';
import { Organization } from '@/types';
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Skeleton,
  Text,
  Title,
  Tooltip,
  TypographyStylesProvider
} from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import {
  IconArrowsJoin,
  IconCircleCheck,
  IconDoorEnter,
  IconDoorExit,
  IconEdit,
  IconEditCircle,
  IconGitPullRequest
} from '@tabler/icons-react';
import { BiSolidExit } from 'react-icons/bi';
import moment from 'moment';
import { modals } from '@mantine/modals';
import * as DOMPurify from 'dompurify';

export default function Organization() {
  const { push, query } = useRouter();
  const { id } = query;
  const { user, isAuthLoaded } = useAuthContext();
  const [organization, setOrganization] = useState<Organization>();

  const refreshData = useCallback(async () => {
    const token = await user
      ?.getIdToken()
      .then((token: string) => token)
      .catch(() => null);
    await fetch(`/api/v2/organizations/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      } as any
    }).then(async (res) => {
      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setOrganization(data);
      } else {
        // push('/404');
      }
    });
  }, [user, id]);

  useEffect(() => {
    if (!id || !isAuthLoaded) return;
    refreshData();
  }, [user, id, refreshData, isAuthLoaded]);

  return (
    <>
      <Head>
        <title>{organization?.name} - Restrafes XCS</title>
        <meta
          property="og:title"
          content={`${organization?.name} - Restrafes XCS`}
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
      <Container
        size={'100%'}
        pt={16}
        style={{
          textUnderlineOffset: '4px'
        }}
        h={'1200px'}
      >
        <Flex
          w={'100%'}
          h={'100%'}
        >
          {/* left section */}
          <Box
            miw={'300px'}
            w={'50%'}
            h={'fit-content'}
            style={{
              position: 'sticky',
              top: 'calc(64px + 16px + 1rem)'
            }}
          >
            <Paper
              w={'100%'}
              style={{
                borderRadius: '16px'
              }}
            >
              {/* Location Title and Organization */}
              <Group>
                <Tooltip.Floating label={organization?.name}>
                  <Avatar
                    src={organization?.avatar}
                    alt={organization?.name}
                    size={128}
                    style={{
                      borderRadius: '8px'
                    }}
                  />
                </Tooltip.Floating>
                <Skeleton
                  visible={!organization}
                  w={'fit-content'}
                >
                  <Title
                    order={2}
                    fw={'bold'}
                  >
                    {organization?.name || 'Unknown Organization'}
                  </Title>

                  <Title
                    size={'md'}
                    fw={'normal'}
                    c={'dark.2'}
                  >
                    By{' '}
                    <Anchor
                      component={NextLink}
                      href={`/@${organization?.owner?.username}`}
                      c={'dark.2'}
                    >
                      {organization?.owner?.displayName || 'Unknown Owner'}
                    </Anchor>
                  </Title>
                </Skeleton>
              </Group>
            </Paper>
            <Paper
              withBorder
              mt={16}
              p={16}
            >
              <Title order={4}>About {organization?.name}</Title>
              <Text
                size={'sm'}
                c={!organization?.description ? 'dark.2' : undefined}
              >
                {organization?.description || 'No description provided.'}
              </Text>
              <Text
                size={'xs'}
                c={'dark.2'}
              >
                Created on {moment(organization?.createdAt).format('MMMM Do YYYY')}
              </Text>
            </Paper>
            <Group mt={16}>
              <Button
                component={NextLink}
                href={`/organizations/${id}/overview`}
                variant={'filled'}
                color="gray.8"
                leftSection={<IconEditCircle size={16} />}
              >
                Manage Organization
              </Button>
              <Button
                variant={'filled'}
                color="red"
                leftSection={<BiSolidExit size={16} />}
                onClick={() => {
                  modals.openConfirmModal({
                    zIndex: 1000,
                    title: <Title order={4}>Leave {organization?.name}?</Title>,
                    children: <Text size="sm">Are you sure you want to leave {organization?.name}?</Text>,
                    labels: { confirm: 'Leave organization', cancel: 'Nevermind' },
                    confirmProps: { color: 'red' },
                    onCancel: () => {},
                    onConfirm: () => {
                      user.getIdToken().then((token: string) => {
                        fetch(`/api/v2/me/organizations/${organization?.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` }
                        })
                          .then((res) => {
                            if (res.status === 200) return res.json();
                            throw new Error(`Failed to leave organization. (${res.status})`);
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
              >
                Leave
              </Button>
            </Group>
          </Box>
          {/* right section */}
          <Box
            w={'50%'}
            pl={16}
          ></Box>
        </Flex>
      </Container>
    </>
  );
}

Organization.getLayout = (page: any) => <Layout>{page}</Layout>;
