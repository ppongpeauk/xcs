import Footer from "@/components/Footer";
// Components
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
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import Head from "next/head";

export default function Login() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <>
      <Head>
        <title>test!</title>
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
                EVE XCS is an online access point control platform developed by
                Restrafes & Co. that allows organizations to manage and control
                access to their facilities remotely.
              </Text>
            </>
            <br />
            <>
              <Text fontWeight={"bold"}>What is my login?</Text>
              <Text>
                Your login for EVE XCS is the email address that was used to
                invite you to the platform. If you are unsure of your login or
                did not receive an invitation, please contact the authorized
                member of your organization who manages access control or email
                xcs@restrafes.co for assistance.
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
                  letterSpacing={"tighter"}
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
                  initialValues={{ username: "", password: "" }}
                  onSubmit={(values, actions) => {
                    setTimeout(() => {
                      // alert(JSON.stringify(values, null, 2));
                      toast({
                        title: "Incorrect username or password.",
                        description: "Please try again.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                      });
                      actions.setSubmitting(false);
                    }, 1000);
                  }}
                >
                  {(props) => (
                    <Form>
                      <Field name="username">
                        {({ field, form }: any) => (
                          <FormControl>
                            <FormLabel>Username</FormLabel>
                            <InputGroup mb={2}>
                              <InputLeftElement pointerEvents="none">
                                <FaUser color="gray.300" />
                              </InputLeftElement>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Username"
                                variant={"filled"}
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
  );
}
