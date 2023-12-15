/*
 * Name: [id].tsx
 * Author: Pete Pongpeauk <pete@ppkl.dev>
 *
 * Copyright (c) 2023 Pete Pongpeauk and contributors
 * License: MIT License
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { modals } from '@mantine/modals';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import Layout from '@/layouts/LayoutPlatform';
import {
  Anchor,
  Text,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Flex,
  Group,
  Skeleton,
  Stack,
  Switch,
  TagsInput,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  useMantineColorScheme,
  ActionIcon,
  CopyButton
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAccessPoint,
  IconCheck,
  IconClipboard,
  IconCopy,
  IconDeviceFloppy,
  IconElevator,
  IconRecycle,
  IconTrash
} from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';

export default function PlatformAccessPoint() {
  const [accessPoint, setAccessPoint] = useState<any>(null);
  const { user, currentUser } = useAuthContext();
  const { push, query } = useRouter();
  const id = query.id as string;
  const { colorScheme } = useMantineColorScheme();
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [occupiedTags, setOccupiedTags] = useState<string[]>([]);

  let refreshData = useCallback(async () => {
    if (!id || !user) return;
    setAccessPoint(null);
    const token = await user.getIdToken().then((idToken: any) => idToken);
    await fetch(`/api/v2/access-points/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        push('/organizations');
        switch (res.status) {
          case 404:
            throw new Error('Access point not found.');
          case 403:
            throw new Error('You do not have permission to view this access point.');
          case 401:
            throw new Error('You do not have permission to view this access point.');
          case 500:
            throw new Error('An internal server error occurred.');
          default:
            throw new Error('An unknown error occurred.');
        }
      })
      .then((data) => {
        setAccessPoint(data);
        form.setValues({
          name: data.name,
          id: data.id,
          description: data.description,
          tags: data.tags,
          active: data.config.active,
          armed: data.config.armed
        });
      })
      .catch((err) => {
        notifications.show({
          title: 'There was an error fetching the access point.',
          message: err.message,
          color: 'red'
        });
      });
  }, [id, user, push]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      type: 'normal',
      name: accessPoint?.name,
      description: '',
      tags: [],
      active: true,
      armed: true,
      id: accessPoint?.id
    },

    validate: {
      name: (value) => {
        if (!value) return 'Please enter a name.';
        if (value.length < 3) return 'Name must be at least 3 characters.';
        if (value.length > 32) return 'Name must be less than 32 characters.';
        return null;
      },
      description: (value) => {
        if (value.length > 256) return 'Description must be less than 256 characters.';
        return null;
      }
    }
  });

  const breadcrumbItems = [
    { title: 'Platform', href: '/home' },
    { title: accessPoint?.organization?.name, href: `/organizations/${accessPoint?.organization?.id}` },
    { title: accessPoint?.location?.name, href: `/locations/${accessPoint?.location?.id}/access-points` },
    { title: accessPoint?.name, href: `/access-points/${accessPoint?.id}` }
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

  return (
    <>
      <Head>
        <title>{accessPoint?.name} - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Manage Access Point - Restrafes XCS"
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
      {/* main container */}
      <Container
        size={'100%'}
        pt={16}
      >
        {/* breadcrumbs */}
        <Skeleton
          mb={16}
          visible={!accessPoint}
        >
          <Breadcrumbs
            separator="→"
            style={{
              textUnderlineOffset: '4px'
            }}
          >
            {breadcrumbItems}
          </Breadcrumbs>
        </Skeleton>
        {/* page title */}
        <Group>
          <Tooltip.Floating label={accessPoint?.type !== 'elevator' ? 'Access Point' : 'Elevator'}>
            {accessPoint?.type !== 'elevator' ? <IconAccessPoint size={32} /> : <IconElevator size={32} />}
          </Tooltip.Floating>
          <Skeleton
            visible={!accessPoint}
            w={'fit-content'}
          >
            <Title fw={'bold'}>{accessPoint?.name || 'Unknown Access Point'}</Title>
            <Title
              size={'md'}
              fw={'normal'}
            >
              {accessPoint?.location?.name || 'Unknown Location'} –{' '}
              {accessPoint?.organization?.name || 'Unknown Organization'}
            </Title>
          </Skeleton>
        </Group>
        <Divider my={24} />
        <Flex>
          {/* form */}
          <form
            onSubmit={form.onSubmit((values) => {
              setFormSubmitting(true);
              user.getIdToken().then(async (idToken: any) => {
                await fetch(`/api/v2/access-points/${id}`, {
                  method: 'PATCH',
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: values.name,
                    description: values.description,
                    tags: values.tags,
                    config: {
                      active: values.active,
                      armed: values.armed
                    }
                  })
                })
                  .then((res) => {
                    if (res.status === 200) return res.json();
                    switch (res.status) {
                      case 404:
                        throw new Error('Access point not found.');
                      case 403:
                        throw new Error('You do not have permission to view this access point.');
                      case 401:
                        throw new Error('You do not have permission to view this access point.');
                      case 500:
                        throw new Error('An internal server error occurred.');
                      default:
                        throw new Error('An unknown error occurred.');
                    }
                  })
                  .then(() => {
                    notifications.show({
                      message: 'Access point updated successfully.',
                      color: 'green'
                    });
                    setFormSubmitting(false);
                    refreshData();
                  })
                  .catch((err) => {
                    notifications.show({
                      title: 'There was an error updating the access point.',
                      message: err.message,
                      color: 'red'
                    });
                    setFormSubmitting(false);
                  });
              });
            })}
          >
            <Stack
              maw={480}
              gap={8}
            >
              <Group>
                <TextInput
                  name="name"
                  label="Name"
                  description="The name of this access point."
                  placeholder="Front Door"
                  withAsterisk
                  {...form.getInputProps('name')}
                />
                <TextInput
                  name="id"
                  label="Unique ID"
                  description="The ID of this access point."
                  placeholder="Access Point ID"
                  readOnly
                  rightSection={
                    <CopyButton value={form.values.id}>
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
                  }
                  {...form.getInputProps('id')}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  style={{
                    width: 'fit-content'
                  }}
                />
              </Group>
              <Textarea
                name="description"
                label="Description"
                description="A short description of this access point. (optional)"
                placeholder="This is the front door of the building."
                minRows={2}
                {...form.getInputProps('description')}
              />
              <TagsInput
                label="Tags"
                description="Use tags to help organize your access points. (optional)"
                data={occupiedTags}
                placeholder="Add tags..."
                clearable
                {...form.getInputProps('tags')}
              />
              <Stack py={8}>
                <Switch
                  label="Active"
                  description="Whether or not this access point is active."
                  {...form.getInputProps('active')}
                  checked={form.values.active}
                />
                <Switch
                  label="Armed"
                  description="Turning this off will disable all security."
                  {...form.getInputProps('armed')}
                  checked={form.values.armed}
                />
              </Stack>
            </Stack>
            <Flex
              mt={16}
              style={{
                flexDirection: 'row',
                gap: '0.5rem'
              }}
              w={'fit-content'}
            >
              <Button
                type="submit"
                color="dark.5"
                leftSection={<IconDeviceFloppy size={'16px'} />}
                mr={'auto'}
                loading={formSubmitting}
              >
                Save Changes
              </Button>
              <Button
                color="red"
                leftSection={<IconTrash size={'16px'} />}
                onClick={() => {
                  modals.openConfirmModal({
                    title: <Title order={4}>Delete access point?</Title>,
                    children: <Text size="sm">Are you sure you want to delete this access point?</Text>,
                    labels: { confirm: 'Delete access point', cancel: 'Nevermind' },
                    confirmProps: { color: 'red' },
                    onConfirm: () => {
                      user.getIdToken().then((token: string) => {
                        fetch(`/api/v1/access-points/${accessPoint.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` }
                        })
                          .then((res) => {
                            if (res.status === 200) return res.json();
                            throw new Error(`Failed to delete access point. (${res.status})`);
                          })
                          .then(() => {
                            push(`/locations/${accessPoint.location.id}/access-points`);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      });
                    },
                    radius: 'md'
                  });
                }}
              >
                Delete
              </Button>
            </Flex>
          </form>
        </Flex>
      </Container>
    </>
  );
}

PlatformAccessPoint.getLayout = (page: any) => <Layout>{page}</Layout>;
