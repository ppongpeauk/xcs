import { Anchor, Button, Flex, LoadingOverlay, Paper, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEditCircle, IconPlus, IconTrash } from '@tabler/icons-react';
import CreateApp from '../modals/developer/CreateApp';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { notifications } from '@mantine/notifications';
import { default as moment } from 'moment';
import { modals } from '@mantine/modals';

interface App {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

function AppRow({ app, refresh }: { app: App; refresh: () => void }) {
  const { user } = useAuthContext();

  return (
    <Flex
      direction={'row'}
      align={'center'}
    >
      {/* info */}
      <Flex direction={'column'}>
        <Text fw={'bold'}>{app.name}</Text>
        <Text size={'xs'}>{app.description}</Text>
        <Text size={'xs'}>Created {moment(app.createdAt).calendar()}</Text>
      </Flex>
      {/* actions */}
      <Flex
        direction={'row'}
        ml={'auto'}
        gap={8}
      >
        {/* <Button
          variant={'outline'}
          size={'xs'}
          leftSection={<IconEditCircle size={16} />}
        >
          Edit
        </Button> */}
        <Button
          color="red"
          variant={'outline'}
          size={'xs'}
          leftSection={<IconTrash size={16} />}
          onClick={() => {
            modals.openConfirmModal({
              zIndex: 1000,
              title: <Title order={4}>Delete application?</Title>,
              children: (
                <Text size="sm">Are you sure you want to delete this application? This action cannot be undone.</Text>
              ),
              labels: { confirm: 'Delete', cancel: 'Nevermind' },
              confirmProps: { color: 'red' },
              onCancel: () => {},
              onConfirm: async () => {
                const token = await user?.getIdToken();
                try {
                  const response = await fetch(`/api/v2/me/apps/${app.id}`, {
                    method: 'DELETE',
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                  const data = await response.json();
                  console.log(data);
                  notifications.show({
                    message: 'Application deleted.',
                    color: 'green'
                  });
                  refresh();
                } catch (e) {
                  notifications.show({
                    message: 'Failed to delete application.',
                    color: 'red'
                  });
                }
              },
              radius: 'md'
            });
          }}
        >
          Delete
        </Button>
      </Flex>
    </Flex>
  );
}

export default function SettingsDeveloper() {
  const { user, currentUser } = useAuthContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const refreshApps = useCallback(async () => {
    setLoading(true);
    setError(false);
    const token = await user?.getIdToken();
    try {
      const response = await fetch('/api/v2/me/apps', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setApps(data);
      console.log(data);
    } catch (e) {
      notifications.show({
        message: 'Failed to fetch applications.',
        color: 'red'
      });
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && currentUser) refreshApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentUser]);

  return (
    <>
      <CreateApp
        opened={opened}
        onClose={close}
        refresh={refreshApps}
      />
      <Flex
        direction="column"
        pb={16}
      >
        <Text size={'sm'}>
          You can create apps to use with the API. Apps can be used to create your own custom integrations.
        </Text>
        <Anchor
          size={'sm'}
          href="/api/docs"
          target="_blank"
          w={'fit-content'}
          style={{
            textUnderlineOffset: 4
          }}
        >
          Learn more about the Consumer API.
        </Anchor>
      </Flex>
      <Button
        variant="default"
        leftSection={<IconPlus size={16} />}
        onClick={open}
      >
        Create a new app
      </Button>
      <Flex
        pos="relative"
        direction="column"
        mt={16}
      >
        <LoadingOverlay
          visible={loading || !currentUser}
          zIndex={6}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ size: 'sm', color: 'var(--mantine-color-default-color)' }}
        />

        <Paper
          shadow="sm"
          radius="sm"
          p={16}
          withBorder
        >
          {!apps.length ? (
            <Text
              size="sm"
              style={{
                textAlign: 'center'
              }}
            >
              {error ? 'Unable to fetch applications. Please try again later.' : "You don't have any applications yet."}
            </Text>
          ) : (
            <Flex
              gap={8}
              direction={'column'}
            >
              {apps.map((app: App) => (
                <AppRow
                  key={app.id}
                  app={app}
                  refresh={refreshApps}
                />
              ))}
            </Flex>
          )}
        </Paper>
      </Flex>
    </>
  );
}
