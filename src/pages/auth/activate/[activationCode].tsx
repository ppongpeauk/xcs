import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Section from "@/components/section";
import { auth } from "@/lib/firebase";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Skeleton,
  SkeletonText,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaKey, FaSmileWink, FaUser } from "react-icons/fa";
import { MdEmail, MdPin } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

export default function Activate() {
  const toast = useToast();
  const router = useRouter();
  const { activationCode } = router.query;
  const [loading, setLoading] = useState<boolean>(true);

  // Validate activation code
  useEffect(() => {
    if (activationCode) {
      fetch(`/api/v1/activation/${activationCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
        .then((res) => {})
        .catch((error) => {
          toast({
            title: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          router.push("/auth/login");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [activationCode]);

  return (
    <>
      <Head>
        <title>EVE XCS – Activate Account</title>
        <meta name="description" content="EVE XCS - Activate Account" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:site_name" content="EVE XCS" />
        <meta name="og:title" content="EVE XCS - Activate Account" />
        <meta name="og:description" content="Activate your EVE XCS account." />
        <meta name="og:type" content="website" />
        <meta name="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:image" content="/images/logo-square.jpeg" />
        <meta name="og:locale" content="en_US" />
      </Head>
      <Nav />
      <Flex
        position={"relative"}
        minH={"calc(100vh - 6rem)"}
        align={"center"}
        justify={"center"}
      >
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
              flexDir={"column"}
              align={"center"}
              outline={["0px solid", "1px solid"]}
              outlineColor={[
                "unset",
                useColorModeValue("gray.200", "gray.700"),
              ]}
              rounded={"xl"}
              w={["full", "md"]}
            >
              <Box w={"full"} px={8}>
                <Text fontSize={"3xl"} fontWeight={"bold"}>
                  Activate Account
                </Text>
                <Text fontSize={"md"}>
                  You&apos;re just a few steps away from creating your account.
                </Text>
              </Box>
              <br />
              <Box px={[0, 8]}>
                <Formik
                  initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    username: "",
                    password: "",
                  }}
                  onSubmit={(values, actions) => {
                    fetch(`/api/v1/activation/${activationCode}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        username: values.username,
                        password: values.password,
                      }),
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
                      .then((res) => {
                        toast({
                          title: "Account created.",
                          description: "You can now log in.",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                        });
                        router.push("/auth/login");
                      })
                      .catch((error) => {
                        toast({
                          title:
                            "There was an error while creating your account.",
                          description: error.message,
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      })
                      .finally(() => {
                        actions.setSubmitting(false);
                      });
                  }}
                >
                  {(props) => (
                    <Form>
                      <HStack my={2} spacing={2}>
                        <Field name="firstName">
                          {({ field, form }: any) => (
                            <FormControl isRequired={true}>
                              <Skeleton isLoaded={!loading}>
                                <FormLabel>First Name</FormLabel>
                              </Skeleton>
                              <Skeleton isLoaded={!loading}>
                                <InputGroup>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="First Name"
                                    variant={"outline"}
                                  />
                                </InputGroup>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="lastName">
                          {({ field, form }: any) => (
                            <FormControl isRequired={false}>
                              <Skeleton isLoaded={!loading}>
                                <FormLabel>Last Name</FormLabel>
                              </Skeleton>
                              <Skeleton isLoaded={!loading}>
                                <InputGroup>
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="Last Name"
                                    variant={"outline"}
                                  />
                                </InputGroup>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </HStack>
                      <Field name="email" isRequired={true}>
                        {({ field, form }: any) => (
                          <FormControl isRequired={true}>
                            <Skeleton isLoaded={!loading}>
                              <FormLabel>Email</FormLabel>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <InputGroup my={2}>
                                <InputLeftElement pointerEvents="none">
                                  <MdEmail color="gray.300" />
                                </InputLeftElement>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Email"
                                  variant={"outline"}
                                />
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="username" isRequired={true}>
                        {({ field, form }: any) => (
                          <FormControl isRequired={true}>
                            <Skeleton isLoaded={!loading}>
                              <FormLabel>Username</FormLabel>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <InputGroup my={2}>
                                <InputLeftElement pointerEvents="none">
                                  <FaUser color="gray.300" />
                                </InputLeftElement>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Username"
                                  variant={"outline"}
                                />
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="password">
                        {({ field, form }: any) => (
                          <FormControl isRequired={true}>
                            <Skeleton isLoaded={!loading}>
                              <FormLabel>Password</FormLabel>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <InputGroup my={2}>
                                <InputLeftElement pointerEvents="none">
                                  <RiLockPasswordFill color="gray.300" />
                                </InputLeftElement>
                                <Input
                                  {...field}
                                  type="password"
                                  placeholder="Password"
                                  variant={"outline"}
                                />
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                      <Field name="activationCode">
                        {({ field, form }: any) => (
                          <FormControl isRequired={true}>
                            <Skeleton isLoaded={!loading}>
                              <FormLabel>Activation Code</FormLabel>
                            </Skeleton>
                            <Skeleton isLoaded={!loading}>
                              <InputGroup my={2}>
                                <InputLeftElement pointerEvents="none">
                                  <FaKey color="gray.300" />
                                </InputLeftElement>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Activation Code"
                                  variant={"outline"}
                                  isDisabled={true}
                                  value={activationCode}
                                />
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                      <Skeleton isLoaded={!loading}>
                        <Button
                          my={2}
                          w={"full"}
                          isLoading={props.isSubmitting}
                          type={"submit"}
                        >
                          Register
                        </Button>
                      </Skeleton>

                      <Text fontSize={"sm"} mb={2}>
                        By creating an account, you agree to our{" "}
                        <Text as={"span"}>
                          <Link
                            as={NextLink}
                            href={"/terms"}
                            textDecor={"underline"}
                            textUnderlineOffset={4}
                            whiteSpace={"nowrap"}
                          >
                            Terms of Service
                          </Link>
                        </Text>{" "}
                        and{" "}
                        <Text as={"span"}>
                          <Link
                            as={NextLink}
                            href={"/privacy"}
                            textDecor={"underline"}
                            textUnderlineOffset={4}
                            whiteSpace={"nowrap"}
                          >
                            Privacy Policy
                          </Link>
                        </Text>
                        .
                      </Text>
                    </Form>
                  )}
                </Formik>
                <Text fontSize={"sm"}>
                  Already have an account?{" "}
                  <Box
                    as={NextLink}
                    href="/auth/login"
                    textDecor={"underline"}
                    textUnderlineOffset={4}
                    transition={"all 0.15s ease"}
                    _hover={{ color: ["gray.300", "gray.500"] }}
                  >
                    Login
                  </Box>
                  .
                </Text>
              </Box>
            </Flex>
          </Section>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}
