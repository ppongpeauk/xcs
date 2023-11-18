import Section from '@/components/section';
import Layout from '@/layouts/PublicLayout';
import {
  Alert,
  Anchor,
  Button,
  Center,
  Container,
  Flex,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  UnstyledButton,
  rem
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconAccessPoint, IconInfoCircle, IconKey, IconMailFilled, IconQuestionMark } from '@tabler/icons-react';
import NextLink from 'next/link';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { notifications } from '@mantine/notifications';
import Head from 'next/head';
import { modals } from '@mantine/modals';
import ResetPasswordModal from '@/components/modals/auth/ResetPassword';

export default function Login() {
  // states
  const [opened, { open, close }] = useDisclosure();
  const [formSubmitting, setFormSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [resetOpened, { open: openReset, close: closeReset }] = useDisclosure(false);

  // user
  const { user, currentUser, isAuthLoaded } = useAuthContext();

  // router
  const router = useRouter();

  // form
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    }
  });

  function redirectOnAuth() {
    // check to see if there are any redirect query parameters
    // otherwise, redirect to the platform home
    if (router.query.redirect) {
      router.push(router.query.redirect as string);
    } else {
      router.push('/home');
    }
  }

  // redirect if user is already logged in
  if (user) {
    redirectOnAuth();
  }

  return (
    <>
      <ResetPasswordModal
        open={resetOpened}
        onClose={closeReset}
      />
      <Head>
        <title>Login - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Login - Restrafes XCS"
        />
        <meta
          property="og:site_name"
          content="Restrafes XCS"
        />
        <meta
          property="og:url"
          content="https://xcs.restrafes.co"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:image"
          content="/images/logo-square.jpg"
        />
      </Head>
      <FAQModal
        opened={opened}
        onClose={close}
      />
      <Container fluid>
        <Center h={'calc(100dvh - 128px)'}>
          <Flex
            pos={'relative'}
            direction={'row'}
            w={{ base: '100%', sm: '640px', md: '720px' }}
            style={{
              border: '1px solid var(--mantine-color-default-border)',
              borderRadius: '4px',
              aspectRatio: isMobile ? 'unset' : '3 / 2'
            }}
          >
            <LoadingOverlay
              visible={!isAuthLoaded}
              zIndex={1000}
              overlayProps={{ radius: 'sm', blur: 2 }}
              loaderProps={{ size: 'md', color: 'var(--mantine-color-default-color)' }}
            />
            <Flex
              h={'100%'}
              w={'50%'}
              style={{
                backgroundColor: 'var(--mantine-color-default-border)'
              }}
              display={{ base: 'none', md: 'flex' }}
            />
            <Flex
              py={32}
              px={48}
              direction={'column'}
              w={{ base: '100%', md: '50%' }}
            >
              <Stack gap={0}>
                <Title order={2}>Log in to XCS</Title>
                <Title
                  order={5}
                  fw={'normal'}
                >
                  Please present your credentials to continue.
                </Title>
              </Stack>
              <form
                onSubmit={form.onSubmit((values) => {
                  setFormSubmitting(true);
                  signInWithEmailAndPassword(auth, values.email, values.password)
                    .then(() => {
                      // redirectOnAuth();
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      let errorMessage = error.message;
                      setFormSubmitting(false);
                      switch (errorCode) {
                        case 'auth/invalid-email':
                          errorMessage = 'The email address you provided is invalid.';
                          break;
                        case 'auth/invalid-password':
                          errorMessage = 'Invalid email address or password. Please try again.';
                          break;
                        case 'auth/user-disabled':
                          errorMessage = 'Your account has been disabled.';
                          break;
                        case 'auth/user-not-found':
                          errorMessage = 'Invalid email address or password. Please try again.';
                          break;
                        case 'auth/wrong-password':
                          errorMessage = 'Invalid email address or password. Please try again.';
                          break;
                        case 'auth/too-many-requests':
                          errorMessage = 'Too many attempts. Please try again later.';
                        default:
                          errorMessage = 'An unknown error occurred.';
                      }
                      notifications.show({
                        title: errorMessage,
                        message: 'Please try again.',
                        color: 'red'
                      });
                    })
                    .finally(() => {});
                })}
              >
                <Stack
                  gap={8}
                  mt={16}
                >
                  <TextInput
                    label={'Email address'}
                    placeholder={'Email address'}
                    leftSection={<IconMailFilled size={16} />}
                    {...form.getInputProps('email')}
                  />
                  <PasswordInput
                    label={'Password'}
                    placeholder={'Password'}
                    type={'password'}
                    leftSection={<IconKey size={16} />}
                    {...form.getInputProps('password')}
                  />
                  <Button
                    type={'submit'}
                    variant={'default'}
                    fullWidth
                    mt={8}
                    loading={formSubmitting}
                  >
                    Log in
                  </Button>
                </Stack>
              </form>
              <Stack
                py={8}
                gap={0}
              >
                <Anchor
                  // component={NextLink}
                  // href={'/auth/reset'}
                  onClick={openReset}
                  c={'var(--mantine-color-default-text)'}
                  size="sm"
                  style={{
                    textUnderlineOffset: '0.25rem'
                  }}
                >
                  Forgot your password?
                </Anchor>
                <Text
                  c={'var(--mantine-color-default-text)'}
                  size="sm"
                >
                  Need help?{' '}
                  <UnstyledButton
                    onClick={open}
                    c={'var(--mantine-color-default-text)'}
                    size="sm"
                    fw={'bold'}
                    style={{
                      textUnderlineOffset: '0.25rem',
                      fontSize: 'inherit'
                    }}
                  >
                    View the FAQ.
                  </UnstyledButton>
                </Text>
              </Stack>
            </Flex>
          </Flex>
        </Center>
      </Container>
    </>
  );
}

function FAQModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Flex align={'center'}>
          <IconQuestionMark stroke={2.5} />
          <Title
            order={4}
            ml={10}
            fw={'bold'}
          >
            Frequently Asked Questions (FAQ)
          </Title>
        </Flex>
      }
      centered
    >
      <Stack mb={24}>
        <Stack gap={0}>
          <Text
            fw={'bold'}
            size={'md'}
          >
            What is Restrafes XCS?
          </Text>
          <Text>
            Restrafes XCS is an online access point control platform developed by RESTRAFES & CO that allows
            organizations to manage and control access to their facilities remotely.
          </Text>
        </Stack>
        <Stack gap={0}>
          <Text
            fw={'bold'}
            size={'md'}
          >
            What is my login?
          </Text>
          <Text>
            Your login for Restrafes XCS is the email address that was used to invite you to the platform. If you are
            unsure of your login or did not receive an invitation, please contact your sponsor or email xcs@restrafes.co
            for assistance.
          </Text>
        </Stack>
      </Stack>
    </Modal>
  );
}

Login.getLayout = (page: any) => <Layout>{page}</Layout>;
