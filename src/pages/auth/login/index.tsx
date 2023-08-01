/* eslint-disable react-hooks/rules-of-hooks */
// Next
import { useContext } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

// Icons
import { FaUser } from 'react-icons/fa';
import { MdEmail, MdPin } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';

// Authentication
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

// Components
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Section from '@/components/section';

export default function Login() {
  const router = useRouter();
  const pathname = usePathname();

  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function redirectOnAuth() {
    // Check to see if there are any redirect query parameters
    // otherwise, redirect to the platform home
    if (router.query.redirect) {
      router.push(router.query.redirect as string);
    } else {
      router.push('/platform/home');
    }
  }

  if (user) {
    redirectOnAuth();
  }

  return (
    !user && (
      <>
        <Head>
          <title>Restrafes XCS – Login</title>
          <meta
            name="description"
            content="Restrafes XCS - Login"
          />
          <link
            rel="icon"
            href="/favicon.ico"
          />
          <meta
            name="og:site_name"
            content="Restrafes XCS"
          />
          <meta
            name="og:title"
            content="Restrafes XCS - Login"
          />
          <meta
            name="og:description"
            content="Authenticate into Restrafes XCS."
          />
          <meta
            name="og:type"
            content="website"
          />
          <meta
            name="og:url"
            content="https://xcs.restrafes.co/login"
          />
          <meta
            property="og:image"
            content="/images/logo-square.jpeg"
          />
          <meta
            name="og:locale"
            content="en_US"
          />
        </Head>
        <Nav type={"login"} />
        <Modal
          onClose={onClose}
          isOpen={isOpen}
          isCentered
          size={'md'}
          motionPreset='slideInBottom'
        >
          <ModalOverlay />
          <ModalContent bg={useColorModeValue('white', 'gray.800')}>
            <ModalHeader>Frequently Asked Questions (FAQ)</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <>
                <Text fontWeight={'bold'}>What is Restrafes XCS?</Text>
                <Text>
                  Restrafes XCS is an online access point control platform developed by RESTRAFES & CO that allows
                  organizations to manage and control access to their facilities remotely.
                </Text>
              </>
              <br />
              <>
                <Text fontWeight={'bold'}>What is my login?</Text>
                <Text>
                  Your login for Restrafes XCS is the email address that was used to invite you to the platform. If you
                  are unsure of your login or did not receive an invitation, please contact your sponsor or email
                  xcs@restrafes.co for assistance.
                </Text>
              </>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Section>
          <Box
            position={'relative'}
            minH={"calc(100dvh - 6rem)"}
            h={'calc(100dvh - 6rem)'}
          >
            <Flex
              position={'relative'}
              align={'center'}
              justify={'center'}
              height={'100%'}
            >
              <Flex
                position={'relative'}
                flexDir={'row'}
                align={{ base: 'center', md: 'flex-start' }}
                outline={['0px solid', '1px solid']}
                outlineColor={['unset', useColorModeValue('gray.200', 'gray.700')]}
                rounded={'lg'}
                maxW={"container.md"}
                overflow={'hidden'}
                height={{ base: 'auto', md: '500px' }}
                bottom={{ base: 'unset', md: '3rem' }}
              >
                <Image flex={"0 0 auto"} display={{ base: "none", md: "flex" }} src={'/images/login4.jpeg'} alt={'Login'} objectFit={'cover'} w={'sm'} h={"full"} />
                <Flex flex={"1 1 auto"} flexDir={'column'} justify={"center"} align={"flex-start"} py={8} px={10}>
                  <Box
                    w={'full'}
                  >
                    <Text
                      fontSize={"3xl"}
                      fontWeight={'bold'}
                    >
                      Log in to XCS
                    </Text>
                    <Text color={"gray.500"} fontSize={'md'}>Please present your credentials to continue.</Text>
                  </Box>
                  <br />
                  <Box px={[0, 4]} w={"full"}>
                    <Formik
                      initialValues={{
                        email: '',
                        password: '',
                      }}
                      onSubmit={(values, actions) => {
                        signInWithEmailAndPassword(auth, values.email, values.password)
                          .then(() => {
                            redirectOnAuth();
                          })
                          .catch((error) => {
                            const errorCode = error.code;
                            let errorMessage = error.message;
                            switch (errorCode) {
                              case 'auth/invalid-email':
                                errorMessage = 'The email address you provided is invalid.';
                                break;
                              case 'auth/invalid-password':
                                errorMessage = "Invalid email address or password. Please try again.";
                                break;
                              case 'auth/user-disabled':
                                errorMessage = 'Your account has been disabled.';
                                break;
                              case 'auth/user-not-found':
                                errorMessage = "Invalid email address or password. Please try again.";
                                break;
                              case 'auth/wrong-password':
                                errorMessage = "Invalid email address or password. Please try again.";
                                break;
                              case 'auth/too-many-requests':
                                errorMessage = 'Too many attempts. Please try again later.';
                              default:
                                errorMessage = 'An unknown error occurred.';
                            }
                            toast({
                              title: errorMessage,
                              status: 'error',
                              duration: 5000,
                              isClosable: true
                            });
                          })
                          .finally(() => {
                            actions.setSubmitting(false);
                          });
                      }}
                    >
                      {(props) => (
                        <Form>
                          <Field name="email">
                            {({ field, form }: any) => (
                              <FormControl mt={2}>
                                <FormLabel>Email</FormLabel>
                                <InputGroup>
                                  <InputLeftElement pointerEvents="none">
                                    <MdEmail color="gray.300" />
                                  </InputLeftElement>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Email"
                                    variant={'outline'}
                                  />
                                </InputGroup>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="password">
                            {({ field, form }: any) => (
                              <FormControl my={2}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                  <InputLeftElement pointerEvents="none">
                                    <RiLockPasswordFill color="gray.300" />
                                  </InputLeftElement>
                                  <Input
                                    {...field}
                                    type={'password'}
                                    placeholder="Password"
                                    variant={'outline'}
                                  />
                                </InputGroup>
                              </FormControl>
                            )}
                          </Field>
                          <Button
                            my={2}
                            w={'full'}
                            isLoading={props.isSubmitting}
                            type={'submit'}
                          >
                            Log in
                          </Button>
                        </Form>
                      )}
                    </Formik>
                    <Text fontSize={'sm'}>
                      <Link
                        as={NextLink}
                        href="/auth/recover"
                        textUnderlineOffset={4}
                      >
                        Forgot your password?
                      </Link>
                    </Text>
                    {/* <Text fontSize={"sm"}>
                    <Link
                      as={NextLink}
                      href="/auth/activate"
                      textUnderlineOffset={4}
                    >
                      Activate an account.
                    </Link>
                  </Text> */}
                    <Text fontSize={'sm'}>
                      Need help?{' '}
                      <Box
                        as="button"
                        onClick={onOpen}
                        textDecor={'underline'}
                        textUnderlineOffset={4}
                        transition={'all 0.15s ease'}
                        _hover={{ color: ['gray.300', 'gray.500'] }}
                      >
                        View the FAQ.
                      </Box>
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Box>
        </Section>
        <Footer />
      </>
    )
  );
}
