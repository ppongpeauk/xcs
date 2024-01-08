import { useAuthContext } from '@/contexts/AuthContext';
import { type AccessPoint, type Organization } from '@/types';
import { useToast } from '@chakra-ui/react';
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Center,
  Flex,
  Modal,
  SegmentedControl,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
  useMantineColorScheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAccessPoint,
  IconApiApp,
  IconCode,
  IconElevator,
  IconLocation,
  IconPencil,
  IconPlus,
  IconSparkles
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateApp({
  opened,
  onClose,
  refresh
}: {
  opened: boolean;
  onClose: () => void;
  refresh: () => void;
}) {
  const { user } = useAuthContext();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const toast = useToast();

  const form = useForm({
    initialValues: {
      type: 'normal',
      template: null,
      name: '',
      description: ''
    },

    validate: {
      name: (value) => {
        if (!value) {
          return 'Name is required.';
        } else if (value.length < 3) {
          return 'Name must be at least 3 characters.';
        } else if (value.length > 50) {
          return 'Name must be at most 50 characters.';
        }
        return false;
      },
      description: (value) => {
        if (value && value.length > 512) {
          return 'Description must be at most 512 characters.';
        }
        return false;
      }
    }
  });

  return (
    <>
      <Modal
        withinPortal
        zIndex={10}
        opened={opened}
        onClose={() => {
          onClose();
          form.reset();
          setCreated(false);
          setApiKey('');
        }}
        title={
          <Flex align={'center'}>
            <IconCode
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
            <Text
              ml={10}
              fw={'bold'}
            >
              New Application
            </Text>
          </Flex>
        }
        centered
        radius={'md'}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            setFormSubmitting(true);
            user.getIdToken().then((token: any) => {
              fetch('/api/v2/me/apps', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  name: values.name,
                  description: values.description
                })
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
                .then((data) => {
                  notifications.show({
                    message: data.message,
                    color: 'green'
                  });
                  setApiKey(data.apiKey);
                  setCreated(true);
                  form.reset();
                  refresh();
                })
                .catch((error) => {
                  notifications.show({
                    title: 'There was an error creating the app.',
                    message: error.message,
                    color: 'red'
                  });
                })
                .finally(() => {
                  setFormSubmitting(false);
                });
            });
          })}
        >
          <Box>
            <Flex
              direction={'column'}
              gap={8}
            >
              {created ? (
                <>
                  <Text size="sm">
                    Your application has successfully been created. You can now use the API key below to access the API.
                  </Text>
                  <TextInput
                    label="API Key"
                    name="name"
                    readOnly
                    value={apiKey}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                  />
                  <Text
                    size="sm"
                    fw={'bold'}
                    c={'red.6'}
                  >
                    Disclaimer: This will be the only time you will be able to see this key. If you lose it, you will
                    have to create a new application.
                  </Text>
                  <Button
                    mt={8}
                    ml={'auto'}
                    color="dark.5"
                    type="submit"
                    loading={formSubmitting}
                    onClick={() => {
                      onClose();
                      form.reset();
                      setCreated(false);
                      setApiKey('');
                    }}
                  >
                    Close
                  </Button>
                </>
              ) : (
                <>
                  <TextInput
                    name="name"
                    label="Name"
                    description="The name of this app."
                    placeholder="My App"
                    withAsterisk
                    {...form.getInputProps('name')}
                  />
                  <Textarea
                    name="description"
                    label="Description"
                    description="A short description of this app. (optional)"
                    placeholder="This app is used for..."
                    minRows={2}
                    {...form.getInputProps('description')}
                  />
                  <Button
                    mt={8}
                    ml={'auto'}
                    leftSection={<IconPlus size={16} />}
                    color="dark.5"
                    type="submit"
                    loading={formSubmitting}
                  >
                    Create
                  </Button>
                </>
              )}
            </Flex>
          </Box>
        </form>
      </Modal>
    </>
  );
}
