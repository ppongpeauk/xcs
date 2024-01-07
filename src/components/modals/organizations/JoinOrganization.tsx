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
  PinInput,
  SegmentedControl,
  Select,
  Text,
  TextInput,
  Textarea,
  rem,
  useMantineColorScheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAccessPoint,
  IconArrowsJoin,
  IconArrowsJoin2,
  IconElevator,
  IconLocation,
  IconPencil,
  IconPlus,
  IconUsersGroup
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

export default function JoinOrganization({
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

  const form = useForm({
    initialValues: {
      code: ''
    },

    validate: {
      code: (value) => {
        if (!value) return 'Please enter a code.';
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
              Join Organization
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
              fetch('/api/v2/me/organizations/join', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  code: values.code
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
                .then((data: any) => {
                  notifications.show({
                    message: data.message,
                    color: 'green'
                  });
                  form.reset();
                  refresh();
                  onClose();
                })
                .catch((error) => {
                  notifications.show({
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
                label={'Invitation Code'}
                description={'Enter the invitation code you received from your organization.'}
                placeholder={'ABC123'}
                required
                {...form.getInputProps('code')}
              />
              <Button
                mt={16}
                ml={'auto'}
                leftSection={<IconArrowsJoin size={16} />}
                color="dark.5"
                type="submit"
                loading={formSubmitting}
              >
                Join
              </Button>
            </Flex>
          </Box>
        </form>
      </Modal>
    </>
  );
}
