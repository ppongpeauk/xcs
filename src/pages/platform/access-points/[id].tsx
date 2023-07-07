/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Skeleton,
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
        <title>EVE XCS - {accessPoint?.name}</title>
      </Head>
      <DeleteDialog
        title="Delete Access Point"
        body="Are you sure you want to delete this access point? This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />
      <Container maxW={"full"} p={8}>
        <Breadcrumb
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
        <Box p={4} w={"min-content"}>
          {accessPoint ? (
            <Formik
              initialValues={{
                name: accessPoint?.name,
                description: accessPoint?.description,
                enabled: accessPoint?.configuration.enabled,
                armed: accessPoint?.configuration.armed,
              }}
              onSubmit={(values, actions) => {
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
                      enabled: values.enabled,
                      armed: values.armed,
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
                        title: "There was an error updating the location.",
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
                  <Field name="name">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Location Name"
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
                            placeholder="Location Description"
                            variant={"filled"}
                            maxH={"240px"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Stack direction={"row"} spacing={2} py={2}>
                    <Field name="enabled">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Enabled</FormLabel>
                          <InputGroup mb={2}>
                            <Switch
                              {...field}
                              placeholder="Enabled"
                              variant={"filled"}
                              width={"fit-content"}
                              defaultChecked={
                                accessPoint?.configuration.enabled
                              }
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="armed">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Armed</FormLabel>
                          <InputGroup mb={2}>
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
          ) : (
            <Skeleton height="20px" />
          )}
        </Box>
      </Container>
    </>
  );
}

PlatformAccessPoint.getLayout = (page: any) => <Layout>{page}</Layout>;
