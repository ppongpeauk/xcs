import { useAuthContext } from '@/contexts/AuthContext';
import { AccessPoint } from '@/types';
import { Spacer, useToast } from '@chakra-ui/react';
import {
  Anchor,
  Autocomplete,
  Box,
  Button,
  Center,
  Flex,
  JsonInput,
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
  IconBucket,
  IconElevator,
  IconEye,
  IconJson,
  IconPencil,
  IconPlus
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateAccessPointBulk({
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
            <IconJson
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
            <Text
              ml={10}
              fw={'bold'}
            >
              Bulk Import
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
              fetch(`/api/v1/locations/${location.id}/access-points/bulk`, {
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
            <Flex
              direction={'column'}
              gap={8}
            >
              <JsonInput
                label="JSON"
                description="Paste JSON here to bulk import access points."
                required
                placeholder='{"name": "Access Point Name", "description": "Access Point Description"}'
                autosize
                minRows={5}
              />
              <Text size={'sm'}>
                Learn more about importing access points via JSON{' '}
                <Anchor
                  c={'inherit'}
                  href="https://xcs.restrafes.co/docs/importing-access-points"
                  target="_blank"
                  style={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '0.25rem'
                  }}
                >
                  here
                </Anchor>
                .
              </Text>
              <Button
                mt={16}
                ml={'auto'}
                leftSection={<IconPlus size={16} />}
                color="dark.5"
                type="submit"
                loading={formSubmitting}
              >
                Import
              </Button>
            </Flex>
          </Box>
        </form>
      </Modal>
    </>
  );
}
