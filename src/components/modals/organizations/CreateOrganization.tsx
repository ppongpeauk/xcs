import { useAuthContext } from '@/contexts/AuthContext';
import { type AccessPoint, type Organization } from '@/types';
import { useToast } from '@chakra-ui/react';
import {
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
import { IconAccessPoint, IconElevator, IconLocation, IconPencil, IconPlus, IconUsersGroup } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateOrganization({
  opened,
  onClose,
  refresh,
  organization
}: {
  opened: boolean;
  onClose: () => void;
  refresh: () => void;
  organization: Organization;
}) {
  const { user } = useAuthContext();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const toast = useToast();
  const { push } = useRouter();
  const { colorScheme } = useMantineColorScheme();

  const form = useForm({
    initialValues: {
      name: '',
      description: ''
    },

    validate: {
      name: (value) => {
        if (!value) return 'Please enter a name.';
        if (value.length < 3) return 'Name must be at least 3 characters.';
        if (value.length > 32) return 'Name must be less than 32 characters.';
        return null;
      }
    }
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
            <IconUsersGroup
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
            <Text
              ml={10}
              fw={'bold'}
            >
              Create Organization
            </Text>
          </Flex>
        }
        centered
      >
        <form
          onSubmit={form.onSubmit((values) => {
            setFormSubmitting(true);
            user.getIdToken().then((token: any) => {
              fetch('/api/v1/organizations', {
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
                  toast({
                    title: data.message,
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                  });
                  form.reset();
                  refresh();
                  onClose();
                })
                .catch((error) => {})
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
                description="The name of this organization."
                placeholder="ACME Inc."
                withAsterisk
                {...form.getInputProps('name')}
              />
              <Textarea
                name="description"
                label="Description"
                description="A short description of this organization."
                placeholder="ACME Inc. is a company that..."
                minRows={2}
                {...form.getInputProps('description')}
              />
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