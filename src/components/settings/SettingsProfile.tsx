/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@chakra-ui/react';

import { Flex, Button, Box, Avatar, Title, rem, TextInput, Group, Textarea, Input, Tooltip } from '@mantine/core';
import { Field, Form, Formik } from 'formik';

import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import {
  IconDeviceFloppy,
  IconDeviceLaptop,
  IconHome,
  IconIdBadge,
  IconMail,
  IconUpload,
  IconUser
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export default function SettingsProfile() {
  const { currentUser, refreshCurrentUser, user, isAuthLoaded } = useAuthContext();
  const { push } = useRouter();

  const defaultImage = `https://${process.env.NEXT_PUBLIC_ROOT_URL}/images/default-avatar.png`;
  const [image, setImage] = useState<null | undefined | string>(undefined);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const toast = useToast();

  const avatarChooser = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    async (e: any) => {
      console.log(e.target.files[0]);
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // check if file is an image
      if (file.type.split('/')[0] !== 'image') {
        toast({
          title: 'File is not an image.',
          status: 'error',
          duration: 3000,
          isClosable: true
        });
        return;
      }

      reader.onloadend = () => {
        setImage(reader.result as string);
      };
    },
    [toast]
  );

  const removeAvatar = useCallback(() => {
    // download default avatar and set it as the image
    fetch(defaultImage)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
      });
  }, [defaultImage]);

  useEffect(() => {
    if (!currentUser) return;
    setImage(currentUser?.avatar);
  }, [currentUser]);

  const form = useForm({
    validateInputOnBlur: true,
    initialValues: {
      displayName: currentUser?.displayName as string,
      username: currentUser?.username as string,
      bio: currentUser?.bio as string,
      website: currentUser?.website || ('' as string),
      email: currentUser?.email?.address as string
    },
    validate: {
      displayName: (value) => {
        if (!value) {
          return 'Display Name is required.';
        }
        if (value.length > 32) {
          return 'Display Name must be less than 32 characters.';
        }
        return false;
      },
      bio: (value) => {
        if (value.length > 512) {
          return 'Bio must be less than 512 characters.';
        }
        return false;
      },
      website: (value) => {
        if (value.length > 256) {
          return 'Website must be less than 256 characters.';
        }
        const regex = /^(https?:\/\/)/i;
        if (!regex.test(value) && value.length > 0) {
          return 'Invalid website address.';
        }
        return false;
      },
      email: (value) => {
        if (!value) {
          return 'Email is required.';
        }
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!regex.test(value) && value !== currentUser?.email?.address) {
          return 'Invalid email address.';
        }
        return false;
      }
    }
  });

  useEffect(() => {
    if (!currentUser) return;
    form.setInitialValues({
      displayName: currentUser?.displayName as string,
      username: currentUser?.username as string,
      bio: currentUser?.about?.bio || currentUser?.bio || ('' as string),
      website: currentUser?.about?.website || ('' as string),
      email: currentUser?.email?.address as string
    });
    form.reset();
  }, [currentUser]);

  return (
    <>
      {
        <Box w={'fit-content'}>
          <form
            onSubmit={form.onSubmit(async (values) => {
              setFormSubmitting(true);
              const token = await user.getIdToken();
              fetch('/api/v2/me', {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  displayName: values.displayName || currentUser?.username,
                  bio: values.bio,
                  website: values.website,
                  email: values.email !== currentUser?.email?.address ? values.email : undefined,
                  avatar: image !== currentUser?.avatar ? image : undefined
                })
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
                .then(async (data) => {
                  notifications.show({
                    message: data.message,
                    color: 'green'
                  });

                  refreshCurrentUser();
                  if (values.email !== currentUser?.email?.address) {
                    push('/auth/logout');
                  }
                })
                .catch((error) => {
                  notifications.show({
                    title: 'There was a problem while updating your profile.',
                    message: error.message,
                    color: 'red'
                  });
                })
                .finally(() => {
                  setFormSubmitting(false);
                });
            })}
          >
            <Flex
              id={'avatar-picker'}
              mb={16}
              gap={16}
            >
              <Avatar
                size={rem(128)}
                src={image || ''}
                style={{
                  objectFit: 'cover'
                }}
              />
              <Flex
                ml={6}
                direction={'column'}
                align={'flex-start'}
                justify={'center'}
                gap={4}
              >
                {/* invisible avatar upload button */}
                <Input
                  ref={avatarChooser}
                  onChange={handleChange}
                  display={'none'}
                  type={'file'}
                  accept="image/*"
                />
                {/* actual avatar upload button */}
                <Button
                  variant={'filled'}
                  color={'dark.5'}
                  fullWidth
                  size={'xs'}
                  onClick={() => {
                    avatarChooser.current?.click();
                  }}
                  leftSection={<IconUpload size={16} />}
                >
                  Choose Icon
                </Button>
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
            <Flex
              direction={'column'}
              gap={4}
            >
              <Flex gap={4}>
                <TextInput
                  label="Display Name"
                  placeholder="Display Name"
                  required
                  leftSection={<IconDeviceLaptop size={16} />}
                  {...form.getInputProps('displayName')}
                />
                <Tooltip.Floating label="Your username cannot be changed.">
                  <span>
                    <TextInput
                      label="Username"
                      placeholder="Username"
                      required
                      disabled
                      leftSection={<IconUser size={16} />}
                      {...form.getInputProps('username')}
                    />
                  </span>
                </Tooltip.Floating>
              </Flex>
              <TextInput
                label="Email"
                placeholder="Email"
                required
                leftSection={<IconMail size={16} />}
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Website"
                placeholder="https://xcs.restrafes.co"
                leftSection={<IconHome size={16} />}
                {...form.getInputProps('website')}
              />
              <Textarea
                label="About Me"
                description="Tell us a little bit about yourself."
                placeholder="Hello, world!"
                autosize
                minRows={4}
                maxRows={8}
                {...form.getInputProps('bio')}
              />
            </Flex>
            <Button
              mt={8}
              leftSection={<IconDeviceFloppy size={16} />}
              type={'submit'}
              color={'dark.5'}
              loading={formSubmitting}
              disabled={currentUser?.platform?.features?.demo?.enabled}
            >
              Save Changes
            </Button>
          </form>
        </Box>
      }
    </>
  );
}
