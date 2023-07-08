/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Skeleton,
  SkeletonText,
  Stack,
  Switch,
  Text,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";

import { ChevronRightIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";

import { useAuthContext } from "@/contexts/AuthContext";

import DeleteDialog from "@/components/DeleteDialog";
import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { AiFillTag } from "react-icons/ai";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoBusiness } from "react-icons/io5";
import { SiRoblox } from "react-icons/si";

export default function PlatformAccessPoint() {
  const { query, push } = useRouter();
  const { user } = useAuthContext();
  const [accessPoint, setAccessPoint] = useState<any>(null);
  const toast = useToast();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const [packLoading, setPackLoading] = useState<boolean>(false);

  const onDelete = () => {
    user.getIdToken().then((idToken: any) => {
      fetch(`/api/v1/access-points/${query.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${idToken}` },
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
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          push(
            `/platform/locations/${accessPoint?.location?.id}/access-points`
          );
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        })
        .finally(() => {
          onDeleteDialogClose();
        });
    });
  };

  let refreshData = () => {
    setAccessPoint(null);
    user.getIdToken().then((idToken: any) => {
      fetch(`/api/v1/access-points/${query.id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          if (res.status === 404) {
            return push("/404");
          } else if (res.status === 403) {
            return push("/403");
          }
        })
        .then((data) => {
          setAccessPoint(data.accessPoint);
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    });
  };

  // Fetch location data
  useEffect(() => {
    if (!user) return;
    if (!query.id) return;
    refreshData();
  }, [query.id]);

  return (
    <>
      <Head>
        <title>EVE XCS – {accessPoint?.name}</title>
        <meta property="og:title" content="EVE XCS - Manage Access Point" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.jpeg" />
      </Head>
      <DeleteDialog
        title="Delete Access Point"
        body="Are you sure you want to delete this access point? This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />
      <Box maxW={"container.md"} p={8}>
        <Breadcrumb
          display={{ base: "none", md: "flex" }}
          spacing="8px"
          mb={4}
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href="/platform/home"
              textUnderlineOffset={4}
            >
              Platform
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href={`/platform/locations/?organization=${accessPoint?.organizationId}`}
              textUnderlineOffset={4}
            >
              Locations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href={`/platform/locations/${accessPoint?.location?.id}/access-points`}
              textUnderlineOffset={4}
            >
              {accessPoint?.location?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" textUnderlineOffset={4}>
              {accessPoint?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>{accessPoint?.name}</Heading>
        <Text fontSize={"lg"} color={"gray.500"}>
          {accessPoint?.organization.name} – {accessPoint?.location.name}
        </Text>
        <Divider my={4} />
        <Box py={4} minW={["100%", "fit-content"]}>
          <Skeleton isLoaded={accessPoint}>
            <Formik
              initialValues={{
                name: accessPoint?.name,
                description: accessPoint?.description,
                active: accessPoint?.configuration.active,
                armed: accessPoint?.configuration.armed,
                timedAccess: JSON.stringify(
                  accessPoint?.configuration.timedAccess
                ),
                alwaysAllowed: JSON.stringify(
                  accessPoint?.configuration.alwaysAllowed
                ),
              }}
              onSubmit={(values, actions) => {
                try {
                  JSON.parse(values.timedAccess);
                  JSON.parse(values.alwaysAllowed);
                } catch (err) {
                  toast({
                    title: "Error",
                    description: "Invalid JSON.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  actions.setSubmitting(false);
                  return;
                }
                user.getIdToken().then((token: any) => {
                  fetch(`/api/v1/access-points/${query.id}`, {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: values.name,
                      description: values.description || "",
                      active: values.active,
                      armed: values.armed,
                      timedAccess: JSON.parse(values.timedAccess),
                      alwaysAllowed: JSON.parse(values.alwaysAllowed),
                    }),
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
                      toast({
                        title: data.message,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                      });
                      actions.setSubmitting(false);
                      refreshData();
                    })
                    .catch((error) => {
                      toast({
                        title: "There was an error updating the access point.",
                        description: error.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
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
                  <Field name="name" w={"min-content"}>
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Access Point Name"
                            variant={"filled"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Description</FormLabel>
                        <InputGroup mb={2}>
                          <Textarea
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Access Point Description"
                            variant={"filled"}
                            maxH={"240px"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Stack direction={"row"} spacing={2}>
                    <Field name="timedAccess">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>timedAccess</FormLabel>
                          <InputGroup mb={2}>
                            <Textarea
                              {...field}
                              type="text"
                              autoComplete="off"
                              spellCheck={false}
                              placeholder={"timedAccess JSON"}
                              variant={"filled"}
                              maxH={"240px"}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="alwaysAllowed">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>alwaysAllowed</FormLabel>
                          <InputGroup mb={2}>
                            <Textarea
                              {...field}
                              type="text"
                              autoComplete="off"
                              spellCheck={false}
                              variant={"filled"}
                              placeholder={"alwaysAllowed JSON"}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Stack direction={"row"} spacing={2} py={2} w={"fit-content"}>
                    <Field name="active">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Active</FormLabel>
                          <InputGroup>
                            <Switch
                              {...field}
                              placeholder="Active"
                              variant={"filled"}
                              width={"fit-content"}
                              defaultChecked={accessPoint?.configuration.active}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="armed">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Armed</FormLabel>
                          <InputGroup>
                            <Switch
                              {...field}
                              colorScheme="red"
                              placeholder="Armed"
                              variant={"filled"}
                              width={"fit-content"}
                              defaultChecked={accessPoint?.configuration.armed}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Box>
                    <Text fontSize={"sm"}>
                      Active - Card scans will be processed.
                    </Text>
                    <Text fontSize={"sm"}>
                      Armed - Access point lock states will be enforced.
                    </Text>
                  </Box>
                  <Stack direction={"row"} spacing={4} py={2}>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      Update
                    </Button>
                    <Button
                      colorScheme="red"
                      mb={2}
                      onClick={onDeleteDialogOpen}
                      leftIcon={<IoIosRemoveCircle />}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Form>
              )}
            </Formik>
          </Skeleton>
        </Box>
      </Box>
    </>
  );
}

PlatformAccessPoint.getLayout = (page: any) => <Layout>{page}</Layout>;
