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
import { IconAccessPoint, IconAt, IconElevator, IconEye, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateAccessPoint({
  opened,
  onClose,
  location,
  accessPoints,
  tagsOptions,
  refresh
}: {
  opened: boolean;
  onClose: () => void;
  location: any;
  accessPoints: any;
  tagsOptions: any;
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
            <IconAccessPoint
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
            <Text
              ml={10}
              fw={'bold'}
            >
              Create Access Point
            </Text>
          </Flex>
        }
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            setFormSubmitting(true);
            user.getIdToken().then((token: any) => {
              fetch(`/api/v1/locations/${location.id}/access-points`, {
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
                  toast({
                    title: 'There was an error creating the access point.',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                  });
                })
                .finally(() => {
                  setFormSubmitting(false);
                });
            });
          })}
        >
          <Box>
            {/* <SegmentedControl
              name="type"
              mb={16}
              fullWidth
              data={[
                {
                  value: 'normal',
                  label: (
                    <Center>
                      <IconAccessPoint style={{ width: rem(16), height: rem(16) }} />
                      <Box ml={10}>Normal</Box>
                    </Center>
                  )
                },
                {
                  value: 'elevator',
                  label: (
                    <Center>
                      <IconElevator style={{ width: rem(16), height: rem(16) }} />
                      <Box ml={10}>Elevator</Box>
                    </Center>
                  ),
                  disabled: true
                }
              ]}
              {...form.getInputProps('type')}
            /> */}
            <Flex
              direction={'column'}
              gap={8}
            >
              <TextInput
                name="name"
                label="Name"
                description="The name of this access point."
                placeholder="Front Door"
                withAsterisk
                {...form.getInputProps('name')}
              />
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
                data={tagsOptions}
                placeholder="Add tags..."
                clearable
                {...form.getInputProps('tags')}
              />
              <Autocomplete
                label="Copy Configuration"
                description="Select a configuration to copy from. (optional)"
                placeholder="Select an access point..."
                disabled={accessPoints.length === 0}
                leftSection={
                  <IconAccessPoint
                    style={{ width: rem(18), height: rem(18) }}
                    stroke={1.5}
                  />
                }
                data={
                  (accessPoints || []).map((ap: AccessPoint) => ({
                    value: ap.id,
                    label: ap.name
                  })) || []
                }
                {...form.getInputProps('template')}
              />
              <Button
                mt={16}
                ml={'auto'}
                leftSection={<IconPencil size={16} />}
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
