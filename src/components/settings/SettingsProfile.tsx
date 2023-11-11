/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useRef, useState } from 'react';

import { useToast } from '@chakra-ui/react';

import { Flex, Button, Box, Avatar, Title, rem, TextInput, Group, Textarea, Input } from '@mantine/core';
import { Field, Form, Formik } from 'formik';

import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { IconDeviceFloppy, IconDeviceLaptop, IconIdBadge, IconMail, IconUpload, IconUser } from '@tabler/icons-react';

export default function SettingsProfile() {
  const { currentUser, refreshCurrentUser, user, isAuthLoaded } = useAuthContext();
  const { push } = useRouter();

  const defaultImage = `${process.env.NEXT_PUBLIC_ROOT_URL}/images/default-avatar.png`;
  const [image, setImage] = useState<null | undefined | string>(undefined);

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

  return (
    <>
      {
        <Box w={'fit-content'}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              emailEditable: false,
              displayName: currentUser?.displayName as string,
              username: currentUser?.username as string,
              bio: currentUser?.bio as string,
              email: currentUser?.email?.address as string
            }}
            onSubmit={(values, actions) => {
              user.getIdToken().then((token: string) => {
                fetch('/api/v1/me', {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    displayName: values.displayName || currentUser?.username,
                    bio: values.bio,
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
                    toast({
                      title: data.message,
                      status: 'success',
                      duration: 3000,
                      isClosable: true
                    });

                    refreshCurrentUser();
                    // refresh form values
                    actions.resetForm({
                      values: {
                        emailEditable: false,
                        displayName: currentUser?.displayName as string,
                        username: currentUser?.username as string,
                        bio: currentUser?.bio as string,
                        email: currentUser?.email?.address as string
                      }
                    });

                    if (values.email !== currentUser?.email?.address) {
                      toast({
                        title: "You've been logged out.",
                        description:
                          "Because you've changed your email address, you have been logged out. Please log in again with your new email address to continue using Restrafes XCS.",
                        status: 'info',
                        duration: 9000,
                        isClosable: true
                      });
                      push('/auth/logout');
                    }
                  })
                  .catch((err) => {
                    toast({
                      title: 'There was a problem while updating your profile.',
                      description: err.message,
                      status: 'error',
                      duration: 3000,
                      isClosable: true
                    });
                  })
                  .finally(() => {
                    actions.setSubmitting(false);
                  });
              });
            }}
          >
            {(props) => (
              <Form>
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
                    <Field name="displayName">
                      {({ field, form }: any) => (
                        <TextInput
                          label="Display Name"
                          placeholder="Display Name"
                          required
                          error={form.errors.displayName}
                          onChange={field.onChange}
                          leftSection={<IconDeviceLaptop size={16} />}
                          {...field}
                        />
                      )}
                    </Field>
                    <Field name="username">
                      {({ field, form }: any) => (
                        <TextInput
                          label="Username"
                          placeholder="Username"
                          required
                          error={form.errors.username}
                          onChange={field.onChange}
                          disabled
                          leftSection={<IconUser size={16} />}
                          {...field}
                        />
                      )}
                    </Field>
                  </Flex>
                  <Field name="email">
                    {({ field, form }: any) => (
                      <TextInput
                        label="Email"
                        placeholder="Email"
                        required
                        error={form.errors.email}
                        onChange={field.onChange}
                        leftSection={<IconMail size={16} />}
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="bio">
                    {({ field, form }: any) => (
                      <Textarea
                        label="About Me"
                        description="Tell us a little bit about yourself."
                        placeholder="Hello, world!"
                        error={form.errors.bio}
                        onChange={field.onChange}
                        {...field}
                      />
                    )}
                  </Field>
                </Flex>
                <Button
                  mt={8}
                  loading={props.isSubmitting}
                  leftSection={<IconDeviceFloppy size={16} />}
                  type={'submit'}
                  color={'dark.5'}
                >
                  Save Changes
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      }
    </>
  );
}
