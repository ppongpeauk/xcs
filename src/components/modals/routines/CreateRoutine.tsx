import { useAuthContext } from '@/contexts/AuthContext';
import { AccessPoint } from '@/types';
import { Spacer, useToast } from '@chakra-ui/react';
import {
  Autocomplete,
  Box,
  Button,
  Center,
  Flex,
  Modal,
  MultiSelect,
  SegmentedControl,
  Select,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  rem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAccessPoint,
  IconAt,
  IconElevator,
  IconEye,
  IconPencil,
  IconPlus,
  IconTimelineEvent,
  IconTimelineEventFilled
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function CreateRoutine({
  opened,
  onClose,
  location,
  refresh
}: {
  opened: boolean;
  onClose: () => void;
  location: any;
  refresh: () => void;
}) {
  const { user } = useAuthContext();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const toast = useToast();
  const { push } = useRouter();

  const form = useForm({
    initialValues: {
      type: 'normal',
      template: null,
      name: '',
      description: '',
      tags: []
    },

    validate: {}
  });

  return (
    <>
      <Modal
        withinPortal
        zIndex={10}
        opened={opened}
        onClose={onClose}
        title={
          <Flex align={'center'}>
            <IconTimelineEvent
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
            <Text
              ml={10}
              fw={'bold'}
            >
              Create Routine
            </Text>
          </Flex>
        }
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            setFormSubmitting(true);
            user.getIdToken().then((token: any) => {
              fetch(`/api/v2/routines`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  name: values.name,
                  description: values.description,
                  locationId: location.id,
                  templateId: null,
                  tags: values.tags
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
                  toast({
                    title: data.message,
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                  });
                  form.reset();
                  refresh();
                  onClose();
                  // push(`/access-points/${data.accessPointId}`);
                })
                .catch((error) => {
                  notifications.show({
                    title: 'There was an error creating the routine.',
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
              <TextInput
                name="name"
                label="Name"
                description="The name of this routine."
                placeholder="Office Access Hours 7am-10pm"
                withAsterisk
                {...form.getInputProps('name')}
              />
              <Textarea
                name="description"
                label="Description"
                description="A short description of this routine. (optional)"
                placeholder="This routine is for the office access hours from 7am to 10pm."
                minRows={2}
                {...form.getInputProps('description')}
              />
              <Text
                size="xs"
                c={'dark.2'}
              >
                You will be able to configure this routine after it is created.
              </Text>
              <Button
                mt={16}
                ml={'auto'}
                leftSection={<IconPlus size={16} />}
                color="dark.5"
                type="submit"
                loading={formSubmitting}
              >
                Create
              </Button>
            </Flex>
          </Box>
        </form>
      </Modal>
    </>
  );
}
