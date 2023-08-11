import { useCallback, useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Portal,
  Skeleton,
  SkeletonCircle,
  Stack,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast
} from '@chakra-ui/react';

import { AiOutlineUser } from 'react-icons/ai';
import { IoSave } from 'react-icons/io5';

import { Field, Form, Formik } from 'formik';

import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function SettingsProfile() {
  const { currentUser, refreshCurrentUser, user, isAuthLoaded } = useAuthContext();
  const { push } = useRouter();

  const defaultImage = `${process.env.NEXT_PUBLIC_ROOT_URL}/images/default-avatar.png`;
  const [image, setImage] = useState<null | undefined | string>(undefined);
  const [croppedImage, setCroppedImage] = useState<null | string>(null);

  const toast = useToast();

  const avatarChooser = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(async (e: any) => {
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
  }, []);

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
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    setImage(currentUser?.avatar);
  }, [currentUser]);

  return (
    <>
      {isAuthLoaded && currentUser && (
        <Box w={'fit-content'}>
          <Formik
            enableReinitialize={true}
            initialValues={{
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
                  .then((data) => {
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
                        displayName: currentUser?.displayName as string,
                        username: currentUser?.username as string,
                        bio: currentUser?.bio as string,
                        email: currentUser?.email?.address as string
                      }
                    });

                    if (values.email !== currentUser?.email?.address) {
                      toast({
                        title: 'You&apos;ve been logged out.',
                        description: 'Because you&apos;ve changed your email address, you have been logged out. Please log in again to continue using Restrafes XCS.',
                        status: 'info',
                        duration: 5000,
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
                  mb={4}
                >
                  <SkeletonCircle
                    isLoaded={!!isAuthLoaded}
                    w={'fit-content'}
                    h={'fit-content'}
                  >
                    <Avatar
                      size={'2xl'}
                      src={image || ''}
                    />
                  </SkeletonCircle>
                  <VStack
                    ml={4}
                    align={'center'}
                    justify={'center'}
                  >
                    <Input
                      ref={avatarChooser}
                      onChange={handleChange}
                      display={'none'}
                      type={'file'}
                      accept="image/*"
                    />
                    <Button
                      variant={'outline'}
                      size={'sm'}
                      onClick={() => {
                        avatarChooser.current?.click();
                      }}
                    >
                      Choose Icon
                    </Button>
                    <Button
                      variant={'outline'}
                      size={'sm'}
                      onClick={() => {
                        removeAvatar();
                      }}
                    >
                      Remove Icon
                    </Button>
                  </VStack>
                </Flex>
                <HStack>
                  <Field name="displayName">
                    {({ field, form }: any) => (
                      <FormControl w={'fit-content'}>
                        <FormLabel>Display Name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder={currentUser?.username}
                            variant={'outline'}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="username">
                    {({ field, form }: any) => (
                      <FormControl w={'fit-content'}>
                        <FormLabel>Username</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            isDisabled={true}
                            type="text"
                            autoComplete="off"
                            placeholder="Username"
                            variant={'outline'}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <Field name="email">
                  {({ field, form }: any) => (
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <InputGroup mb={2}>
                        <Input
                          {...field}
                          type="email"
                          autoComplete="off"
                          placeholder="Email address"
                          variant={'outline'}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Field name="bio">
                  {({ field, form }: any) => (
                    <FormControl>
                      <FormLabel>About Me</FormLabel>
                      <InputGroup mb={2}>
                        <Textarea
                          {...field}
                          type="text"
                          autoComplete="off"
                          placeholder="Hello, world!"
                          variant={'outline'}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                {/* <Field name="enabled">
                  {({ field, form }: any) => (
                    <FormControl width={"fit-content"}>
                      <FormLabel>Enabled</FormLabel>
                      <InputGroup mb={2}>
                        <Switch
                          {...field}
                          placeholder="Enabled"
                          variant={"outline"}
                          defaultChecked={currentUser?.enabled}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field> */}
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: 2, md: 4 }}
                  pt={2}
                >
                  <Button
                    mb={2}
                    isLoading={props.isSubmitting}
                    leftIcon={<IoSave />}
                    type={'submit'}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      )}
    </>
  );
}
