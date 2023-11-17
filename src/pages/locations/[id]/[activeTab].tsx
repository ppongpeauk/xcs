/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';

import { useColorModeValue, useToast } from '@chakra-ui/react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import Layout from '@/layouts/PlatformLayout';

import LocationAccessPoints from '@/components/location/LocationAccessPointsNew';
import LocationInfo from '@/components/location/LocationInfoNew';
import {
  Anchor,
  Badge,
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Flex,
  Group,
  Skeleton,
  Stack,
  Tabs,
  Text,
  Title,
  Tooltip,
  rem
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconAccessPoint,
  IconBroadcast,
  IconHistory,
  IconLiveView,
  IconLocation,
  IconSettings,
  IconTimeline,
  IconTimelineEvent,
  IconUsersGroup
} from '@tabler/icons-react';
import NextLink from 'next/link';
import { useMantineColorScheme } from '@mantine/core';
import { useAsideContext } from '@/contexts/NavAsideContext';
import InfoLink from '@/components/InfoLink';
import LocationRoutines from '@/components/location/LocationRoutines';

export default function PlatformLocation() {
  const router = useRouter();
  const { query, push } = router;
  const { user } = useAuthContext();
  const [location, setLocation] = useState<any>(null);
  const toast = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { colorScheme } = useMantineColorScheme();
  const { openHelp } = useAsideContext();
  const breadcrumbItems = [
    { title: 'Platform', href: '/home' },
    { title: location?.organization?.name, href: `/organizations/${location?.organization?.id}` },
    { title: 'Locations', href: `/locations?organization=${location?.organization.id}` },
    { title: location?.name, href: `/locations/${location?.id}/general` }
  ].map((item, index) => (
    <Anchor
      component={NextLink}
      href={item.href}
      key={index}
      size="md"
      fw={'bold'}
      c={'var(--mantine-color-text)'}
    >
      {item.title || 'Loading'}
    </Anchor>
  ));

  let refreshData = useCallback(() => {
    setLocation(null);
    user.getIdToken().then((token: string) => {
      fetch(`/api/v1/locations/${query.id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          if (res.status === 404) {
            return push('/404');
          } else if (res.status === 403 || res.status === 401) {
            toast({
              title: 'Unauthorized.',
              description: 'You are not authorized to view this location.',
              status: 'error',
              duration: 5000,
              isClosable: true
            });
            return push('/organizations');
          }
        })
        .then((data) => {
          setLocation(data.location);
        });
    });
  }, [push, query.id, toast, user]);

  // Fetch location data
  useEffect(() => {
    if (!query.id) return;
    if (!user) return;
    if (location) return;
    refreshData();
  }, [query, user, location, refreshData]);

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      <Head>
        <title>{location?.name} - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Manage Location - Restrafes XCS"
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
      >
        {/* Breadcrumbs */}
        <Skeleton
          mb={16}
          visible={!location}
        >
          <Breadcrumbs
            separator="→"
            style={{}}
          >
            {breadcrumbItems}
          </Breadcrumbs>
        </Skeleton>
        {/* Location Title and Organization */}
        <Group>
          <Tooltip.Floating label={'Location'}>
            <IconLocation size={32} />
          </Tooltip.Floating>
          <Skeleton
            visible={!location}
            w={'fit-content'}
          >
            <Title fw={'bold'}>{location?.name || 'Unknown Location'}</Title>
            <Title
              size={'md'}
              fw={'normal'}
            >
              {location?.organization.name || 'Unknown Organization'}
            </Title>
          </Skeleton>
        </Group>
        <Divider my={24} />
        {/* Tabs */}
        <Tabs
          color={colorScheme === 'dark' ? 'white' : 'black'}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          defaultValue={'settings'}
          value={router.query.activeTab as string}
          onChange={(value) => router.push(`/locations/${location?.id}/${value}`)}
        >
          <Tabs.List>
            <Tabs.Tab
              value="general"
              leftSection={<IconSettings style={iconStyle} />}
            >
              General Settings
            </Tabs.Tab>
            <Tabs.Tab
              value="access-groups"
              leftSection={<IconUsersGroup style={iconStyle} />}
            >
              Roles &amp; Permissions
            </Tabs.Tab>
            <Tabs.Tab
              value="event-log"
              leftSection={<IconHistory style={iconStyle} />}
            >
              Event Logs
            </Tabs.Tab>
            <Tabs.Tab
              value="access-points"
              leftSection={<IconAccessPoint style={iconStyle} />}
            >
              Access Points
            </Tabs.Tab>
            <Tabs.Tab
              value="routines"
              leftSection={<IconTimelineEvent style={iconStyle} />}
            >
              Routines
            </Tabs.Tab>
          </Tabs.List>

          <Box
            pl={isMobile ? 0 : 32}
            pt={isMobile ? 16 : 0}
            w={'100%'}
          >
            <Tabs.Panel value="general">
              <Title
                order={2}
                py={4}
              >
                General Settings
              </Title>
              <LocationInfo
                query={query}
                location={location}
                refreshData={refreshData}
              />
            </Tabs.Panel>

            <Tabs.Panel value="access-points">
              <Title
                order={2}
                pt={4}
                mb={16}
              >
                Access Points
                <InfoLink
                  title="Access Points"
                  description={
                    <Stack>
                      <Text>
                        Access points are card readers, keypads, and other devices that facilitate access to an entry.
                      </Text>
                      <Text>
                        Routines, temporary access, and always-allowed configurations can be set up for each access
                        point.
                      </Text>
                    </Stack>
                  }
                />
              </Title>
              <LocationAccessPoints
                location={location}
                refreshData={refreshData}
              />
            </Tabs.Panel>

            <Tabs.Panel value="routines">
              <Title
                order={2}
                pt={4}
                mb={16}
              >
                Routines
                <InfoLink
                  title="Routines"
                  description="Location routines allow you to set up schedules."
                />
              </Title>
              <LocationRoutines
                location={location}
                refreshData={refreshData}
              />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </>
  );
}

PlatformLocation.getLayout = (page: any) => <Layout>{page}</Layout>;
