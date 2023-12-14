import { useAuthContext } from '@/contexts/AuthContext';
import { Location, Organization } from '@/types';
import { useDisclosure, useToast } from '@chakra-ui/react';
import {
  Avatar,
  Box,
  Button,
  FileButton,
  Flex,
  Input,
  Space,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
  rem
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  Icon123,
  IconDeviceFloppy,
  IconDownload,
  IconHttpDelete,
  IconRecycle,
  IconUpload,
  IconUsersGroup
} from '@tabler/icons-react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function OrganizationInfo({
  query,
  data,
  refreshData
}: {
  query: any;
  data: Organization | any;
  refreshData: any;
}) {
  const defaultImage = `${process.env.NEXT_PUBLIC_ROOT_URL}/images/default-avatar-organization.png`;
  const [avatar, setAvatar] = useState<any>(null);

  const handleAvatarChange = useCallback(async (file: any) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);

    // check if file is an image
    if (file.type.split('/')[0] !== 'image') {
      return;
    }

    reader.onloadend = () => {
      setAvatar(reader.result as any);
    };
  }, []);

  const removeAvatar = useCallback(() => {
    // download default avatar and set it as the image
    fetch(defaultImage)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setAvatar(reader.result as any);
        };
      });
  }, [defaultImage]);

  const [formSubmitting, setFormSubmitting] = useState(false);
  const { user } = useAuthContext();
  const { push } = useRouter();
  const toast = useToast();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      name: data?.name,
      description: data?.description
    },
    validate: {
      name: (value) => {
        if (!value) {
          return 'Please enter a name.';
        }
        if (value.length < 3) {
          return 'Name must be at least 3 characters long.';
        }
        return false;
      },
      description: (value) => {
        if (value.length > 512) {
          return 'Description must be less than 512 characters long.';
        }
        return false;
      }
    }
  });

  useEffect(() => {
    if (!data) return;
    form.setInitialValues({
      name: data?.name,
      description: data?.description
    });
    form.reset();
    setAvatar(data?.avatar);
  }, [data, query]);

  const onDelete = () => {
    user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${query.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then((json: any) => {
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
          push(`/organizations`);
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        })
        .finally(() => {
          onDeleteDialogClose();
        });
    });
  };

  const showDeleteModal = () =>
    modals.openConfirmModal({
      zIndex: 1000,
      title: <Title order={4}>Delete organization?</Title>,
      children: <Text size="sm">Are you sure you want to delete this organization?</Text>,
      labels: { confirm: 'Delete organization', cancel: 'Nevermind' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: () => {
        onDelete();
      },
      radius: 'md'
    });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        setFormSubmitting(true);
        const token = await user.getIdToken();
        await fetch(`/api/v1/organizations/${query.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            avatar: avatar !== data?.avatar ? avatar : undefined
          })
        })
          .then((res: any) => {
            if (res.status === 200) {
              return res.json();
            } else {
              return res.json().then((json: any) => {
                throw new Error(json.message);
              });
            }
          })
          .then((data) => {
            notifications.show({
              message: 'Successfully updated the organization.',
              color: 'green',
              autoClose: 5000
            });
            refreshData();
          })
          .catch((error) => {
            notifications.show({
              title: 'There was an error updating the location.',
              message: error.message,
              color: 'red',
              autoClose: 5000
            });
          })
          .finally(() => {
            setFormSubmitting(false);
          });
      })}
    >
      <Flex
        style={{
          flexDirection: 'column',
          gap: '0.5rem',
          width: 'fit-content'
        }}
      >
        <Flex
          id={'avatar-picker'}
          my={8}
          gap={16}
        >
          <Avatar
            size={rem(128)}
            src={avatar || defaultImage}
            style={{
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          <Flex
            ml={6}
            direction={'column'}
            align={'flex-start'}
            justify={'center'}
            gap={4}
          >
            {/* actual avatar upload button */}
            <FileButton
              onChange={handleAvatarChange}
              accept="image/*"
            >
              {(props) => (
                <Button
                  variant={'filled'}
                  color={'dark.5'}
                  fullWidth
                  size={'xs'}
                  leftSection={<IconUpload size={16} />}
                  {...props}
                >
                  Choose Icon
                </Button>
              )}
            </FileButton>
            <Button
              variant={'default'}
              color={'dark.5'}
              fullWidth
              size={'xs'}
              onClick={() => {
                removeAvatar();
              }}
            >
              Remove Icon
            </Button>
          </Flex>
        </Flex>
        <TextInput
          label="Name"
          withAsterisk
          description="The name of this organization."
          placeholder="ACME Inc."
          w={240}
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Description"
          description="A description of this organization."
          placeholder="Organization description..."
          w={320}
          autosize
          minRows={4}
          maxRows={8}
          {...form.getInputProps('description')}
        />
      </Flex>

      <Flex
        mt={8}
        style={{
          flexDirection: 'row',
          gap: '0.5rem'
        }}
        w={'fit-content'}
      >
        <Button
          type="submit"
          color="dark.5"
          loading={formSubmitting}
          leftSection={<IconDeviceFloppy size={'16px'} />}
          mr={'auto'}
        >
          Save Changes
        </Button>
        <Button
          color="red"
          leftSection={<IconRecycle size={'16px'} />}
          onClick={() => {
            showDeleteModal();
          }}
        >
          Delete
        </Button>
      </Flex>
    </form>
  );
}
