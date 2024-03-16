/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';

import { useColorModeValue, useToast } from '@chakra-ui/react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import Layout from '@/layouts/LayoutPlatform';

import LocationAccessPoints from '@/components/location/LocationAccessPoints';
import LocationInfo from '@/components/location/LocationInfoNew';
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
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
  IconCode,
  IconExternalLink,
  IconGridDots,
  IconHistory,
  IconLiveView,
  IconLocation,
  IconSettings,
  IconShadow,
  IconTimeline,
  IconTimelineEvent,
  IconTrees,
  IconUsers,
  IconUsersGroup
} from '@tabler/icons-react';
import NextLink from 'next/link';
import { useMantineColorScheme } from '@mantine/core';
import { useAsideContext } from '@/contexts/NavAsideContext';
import InfoLink from '@/components/InfoLink';
import LocationRoutines from '@/components/location/LocationRoutines';
import { Organization } from '@/types';
import OrganizationInfo from '@/components/organization/OrganizationInfo';
import OrganizationMembers from '@/components/organization/OrganizationMembers';
import OrganizationEvents from '@/components/organization/OrganizationEvents';
import OrganizationOverview from '@/components/organization/OrganizationOverview';

export default function PlatformOrganization() {
  const router = useRouter();
  const { query, push } = router;
  const { user } = useAuthContext();

  const [data, setData] = useState<Organization>();

  const toast = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { colorScheme } = useMantineColorScheme();
  const { openHelp } = useAsideContext();

  const breadcrumbItems = [
    { title: 'Platform', href: '/home' },
    { title: data?.name, href: `/organizations/${data?.id}` }
  ].map((item, index) => (
    <Anchor
      component={NextLink}
      href={item.href}
      key={index}
      size="md"
      c={'var(--mantine-color-text)'}
    >
      {item.title || 'Loading'}
    </Anchor>
  ));

  let refreshData = useCallback(() => {
    setData(undefined);
    user.getIdToken().then((token: string) => {
      fetch(`/api/v2/organizations/${query.id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          if (res.status === 404) {
            return push('/404');
          } else if (res.status === 403 || res.status === 401) {
            return push('/organizations');
          }
        })
        .then((data) => {
          setData(data);
        });
    });
  }, [push, query.id, toast, user]);

  // Fetch location data
  useEffect(() => {
    if (!query.id) return;
    if (!user) return;
    if (data) return;
    refreshData();
  }, [query, user, data, refreshData]);

  const iconStyle = { width: rem(14), height: rem(14) };

  return (
    <>
      <Head>
        <title>{data?.name} - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Manage Organization - Restrafes XCS"
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
          visible={!data}
        >
          <Breadcrumbs
            separator="→"
            style={{}}
          >
            {breadcrumbItems}
          </Breadcrumbs>
        </Skeleton>
        {/* Organization */}
        <Group>
          <Tooltip.Floating label={data?.name}>
            {/* <IconUsersGroup size={32} /> */}
            <Avatar
              size={64}
              src={data?.avatar}
              style={{
                borderRadius: '8px'
              }}
            />
          </Tooltip.Floating>
          <Skeleton
            visible={!data}
            w={'fit-content'}
          >
            <Title
              fw={'bold'}
              order={2}
            >
              {data?.name || 'Unknown Organization'}
            </Title>
            <Text
              size={'sm'}
              c={'var(--mantine-color-placeholder)'}
              fw={'bold'}
            >
              by {data?.owner?.displayName} (@{data?.owner?.username})
            </Text>
          </Skeleton>
        </Group>
        <Divider my={24} />
        {/* Tabs */}
        <Tabs
          color={colorScheme === 'dark' ? 'dark.5' : 'black'}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          defaultValue={'settings'}
          value={router.query.activeTab as string}
          onChange={(value) => router.push(`/organizations/${data?.id}/${value}`)}
          keepMounted={false}
          variant="pills"
        >
          <Tabs.List
            style={{ gap: 0 }}
            fw={'bold'}
          >
            <Tabs.Tab
              value="overview"
              leftSection={<IconGridDots style={iconStyle} />}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              leftSection={<IconSettings style={iconStyle} />}
            >
              General Settings
            </Tabs.Tab>
            <Tabs.Tab
              value="event-log"
              leftSection={<IconTimelineEvent style={iconStyle} />}
            >
              Event Log
            </Tabs.Tab>
            <Tabs.Tab
              value="members"
              leftSection={<IconUsers style={iconStyle} />}
            >
              Members
            </Tabs.Tab>
            <Tabs.Tab
              value="locations"
              leftSection={<IconLocation style={iconStyle} />}
              rightSection={<IconExternalLink size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                push(`/locations?organization=${data?.id}`);
              }}
            >
              Locations
            </Tabs.Tab>
            <Tabs.Tab
              value="public-page"
              leftSection={<IconTrees style={iconStyle} />}
              rightSection={<IconExternalLink size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                push(`/organizations/${data?.id}`);
              }}
            >
              Public Page
            </Tabs.Tab>
          </Tabs.List>

          <Box
            pl={isMobile ? 0 : 32}
            pt={isMobile ? 16 : 0}
            w={'100%'}
          >
            <Tabs.Panel value="overview">
              <OrganizationOverview
                query={query}
                data={data as Organization}
                refreshData={refreshData}
              />
            </Tabs.Panel>
            <Tabs.Panel value="settings">
              <OrganizationInfo
                query={query}
                data={data}
                refreshData={refreshData}
              />
            </Tabs.Panel>
            <Tabs.Panel value="members">
              <OrganizationMembers
                data={data as Organization}
                refreshData={refreshData}
              />
            </Tabs.Panel>
            <Tabs.Panel value="event-log">
              <OrganizationEvents organization={data as Organization} />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Container>
    </>
  );
}

PlatformOrganization.getLayout = (page: any) => <Layout>{page}</Layout>;
