/* eslint-disable react-hooks/rules-of-hooks */
// Next
import Head from "next/head";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

// Components
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Section from "@/components/section";
import {
  Box,
  Button,
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
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import NextLink from "next/link";

// Icons
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

// Authentication
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

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
      router.push("/platform/home");
    }
  }

  if (user) {
    redirectOnAuth();
  }

  return (
    !user && (
      <>
        <Head>
          <title>EVE XCS | Login</title>
        </Head>
        <Nav />
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent bg={useColorModeValue("white", "gray.800")}>
            <ModalHeader>Frequently Asked Questions</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <>
                <Text fontWeight={"bold"}>What is XCS?</Text>
                <Text>
                  EVE XCS is an online access point control platform developed
                  by Restrafes & Co. that allows organizations to manage and
                  control access to their facilities remotely.
                </Text>
              </>
              <br />
              <>
                <Text fontWeight={"bold"}>What is my login?</Text>
                <Text>
                  Your login for EVE XCS is the email address that was used to
                  invite you to the platform. If you are unsure of your login or
                  did not receive an invitation, please contact the authorized
                  member of your organization who manages access control or
                  email xcs@restrafes.co for assistance.
                </Text>
              </>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box position={"relative"} h={"calc(100vh - 6rem)"}>
          <Flex
            position={"relative"}
            align={"center"}
            justify={"center"}
            height={"100%"}
          >
            <Section>
              <Flex
                position={"relative"}
                p={8}
                pb={16}
                bottom={[0, 16]}
                flexDir={"column"}
                align={"center"}
                outline={["0px solid", "1px solid"]}
                outlineColor={[
                  "unset",
                  useColorModeValue("gray.200", "gray.700"),
                ]}
                rounded={"xl"}
              >
                <Box>
                  <Text
                    fontSize={"3xl"}
                    fontWeight={"bold"}
                  >
                    Login to XCS
                  </Text>
                  <Text fontSize={"md"}>
                    Please present your credentials to continue.
                  </Text>
                </Box>
                <br />
                <Box px={[0, 16]}>
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={(values, actions) => {
                      signInWithEmailAndPassword(
                        auth,
                        values.email,
                        values.password
                      )
                        .then(() => {
                          redirectOnAuth();
                        })
                        .catch((error) => {
                          const errorCode = error.code;
                          let errorMessage = error.message;
                          switch (errorCode) {
                            case "auth/invalid-email":
                              errorMessage = "The email address is invalid.";
                              break;
                            case "auth/invalid-password":
                              errorMessage = "The password is invalid.";
                              break;
                            case "auth/user-disabled":
                              errorMessage =
                                "The user corresponding to the given email has been disabled.";
                              break;
                            case "auth/user-not-found":
                              errorMessage =
                                "The user corresponding to the given email does not exist.";
                              break;
                            case "auth/wrong-password":
                              errorMessage =
                                "Incorrect email or password. Please try again.";
                              break;
                            default:
                              errorMessage = "An unknown error occurred.";
                          }
                          toast({
                            description: errorMessage,
                            status: "error",
                            duration: 5000,
                            isClosable: true,
                          });
                        })
                        .finally(() => {
                          actions.setSubmitting(false);
                        });
                      // setTimeout(() => {
                      //   // alert(JSON.stringify(values, null, 2));
                      //   toast({
                      //     title: "Incorrect email or password.",
                      //     description: "Please try again.",
                      //     status: "error",
                      //     duration: 5000,
                      //     isClosable: true,
                      //   });
                      //   actions.setSubmitting(false);
                      // }, 1000);
                    }}
                  >
                    {(props) => (
                      <Form>
                        <Field name="email">
                          {({ field, form }: any) => (
                            <FormControl>
                              <FormLabel>Email</FormLabel>
                              <InputGroup mb={2}>
                                <InputLeftElement pointerEvents="none">
                                  <FaUser color="gray.300" />
                                </InputLeftElement>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Email"
                                  variant={"filled"}
                                  required={true}
                                />
                              </InputGroup>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="password">
                          {({ field, form }: any) => (
                            <FormControl>
                              <FormLabel>Password</FormLabel>
                              <InputGroup mb={4}>
                                <InputLeftElement pointerEvents="none">
                                  <RiLockPasswordFill color="gray.300" />
                                </InputLeftElement>
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="Password"
                                  variant={"filled"}
                                  required={true}
                                />
                              </InputGroup>
                            </FormControl>
                          )}
                        </Field>
                        <Button
                          mb={2}
                          w={"full"}
                          isLoading={props.isSubmitting}
                          type={"submit"}
                        >
                          Login
                        </Button>
                      </Form>
                    )}
                  </Formik>
                  <Text fontSize={"sm"}>
                    <Link
                      as={NextLink}
                      href="/auth/recover"
                      textUnderlineOffset={4}
                    >
                      Forgot your password?
                    </Link>
                  </Text>
                  <Text fontSize={"sm"}>
                    <Link
                      as={NextLink}
                      href="/auth/activate"
                      textUnderlineOffset={4}
                    >
                      Activate an account.
                    </Link>
                  </Text>
                  <Text fontSize={"sm"}>
                    Need help?{" "}
                    <Box
                      as="button"
                      onClick={onOpen}
                      textDecor={"underline"}
                      textUnderlineOffset={4}
                      transition={"all 0.15s ease"}
                      _hover={{ color: ["gray.300", "gray.500"] }}
                    >
                      View the FAQ.
                    </Box>
                  </Text>
                </Box>
              </Flex>
            </Section>
          </Flex>
        </Box>
        <Footer />
      </>
    )
  );
}
