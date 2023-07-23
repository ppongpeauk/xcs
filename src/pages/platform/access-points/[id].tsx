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
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ChevronRightIcon } from "@chakra-ui/icons";
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
import { IoIosRemoveCircle } from "react-icons/io";
import { IoBusiness, IoClipboard, IoSave, IoTime } from "react-icons/io5";

import { agIds, agKV, agNames } from "@/lib/utils";
import { MultiSelect } from "chakra-multiselect";
export default function PlatformAccessPoint() {
  const { query, push } = useRouter();
  const { user } = useAuthContext();
  const [accessPoint, setAccessPoint] = useState<any>(null);
  const toast = useToast();
  const {
    hasCopied: clipboardHasCopied,
    setValue: clipboardSetValue,
    value: clipboardValue,
    onCopy: clipboardOnCopy,
  } = useClipboard("");

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
            duration: 5000,
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
          if (clipboardValue === "") {
            clipboardSetValue(data.accessPoint?.id);
          }
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: err.message,
            status: "error",
            duration: 5000,
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
        <Text as={"h1"} fontSize={"4xl"} fontWeight={"900"}>
          {accessPoint?.name}
        </Text>
        <Text fontSize={"lg"} color={"gray.500"}>
          {accessPoint?.organization.name} – {accessPoint?.location.name}
        </Text>
        <Divider my={4} />
        <Box minW={["100%", "fit-content"]}>
          <Skeleton isLoaded={accessPoint}>
            <Formik
              initialValues={{
                name: accessPoint?.name,
                description: accessPoint?.description,
                active: accessPoint?.config?.active,
                armed: accessPoint?.config?.armed,
                accessGroups: agIds(accessPoint?.organization, accessPoint?.config?.alwaysAllowed?.groups),
                alwaysAllowedUsers: JSON.stringify(
                  accessPoint?.config?.alwaysAllowed?.users
                ),
              }}
              onSubmit={(values, actions) => {
                try {
                  JSON.parse(values.alwaysAllowedUsers);
                } catch (err) {
                  toast({
                    title: "Error",
                    description: "Invalid JSON.",
                    status: "error",
                    duration: 5000,
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

                      config: {
                        active: values.active,
                        armed: values.armed,

                        alwaysAllowed: {
                          users: JSON.parse(values.alwaysAllowedUsers),
                          groups: agNames(
                            accessPoint?.organization,
                            values.accessGroups
                          ),
                        },
                      },
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
                        duration: 5000,
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
                        duration: 5000,
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
                  <Heading as={"h2"} fontSize={"xl"} fontWeight={"900"} py={2}>
                    General
                  </Heading>
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
                            variant={"outline"}
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
                            variant={"outline"}
                            maxH={"240px"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Heading as={"h2"} fontSize={"xl"} fontWeight={"900"} py={2}>
                    Configuration
                  </Heading>
                  <Stack direction={"row"} spacing={2}>
                    {/* <Field name="timedAccess">
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
                              variant={"outline"}
                              maxH={"240px"}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field> */}
                    {/* <Field name="users">
                      {({ field, form }: any) => (
                        <FormControl w={"fit-content"}>
                          <MultiSelect
                            {...field}
                            label="Users"
                            options={
                              Object.entries(accessPoint?.organization?.members || {}).map(
                                ([key, value]: any) => ({
                                  value: value.displayName || "",
                                  label: value.displayName || "",
                                })
                              ) || ([] as any)
                            }
                            onChange={(value) => {
                              form.setFieldValue(
                                "users",
                                value || ([] as string[])
                              );
                            }}
                            value={form.values?.users}
                            placeholder="Select a user.."
                            single={false}
                            autoComplete={"off"}
                            autoCorrect={"off"}
                          />
                        </FormControl>
                      )}
                    </Field> */}
                    <Field name="accessGroups">
                      {({ field, form }: any) => (
                        <FormControl w={"fit-content"}>
                          <MultiSelect
                            {...field}
                            label="Access Groups"
                            options={agKV(accessPoint?.organization)}
                            onChange={(value) => {
                              form.setFieldValue(
                                "accessGroups",
                                value || ([] as string[])
                              );
                            }}
                            value={form.values?.accessGroups}
                            placeholder="Select an access group..."
                            single={false}
                            autoComplete={"off"}
                            autoCorrect={"off"}
                          />
                        </FormControl>
                      )}
                    </Field>
                    {/* <Field name="alwaysAllowedUsers">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>alwaysAllowedUsers</FormLabel>
                          <InputGroup mb={2}>
                            <Textarea
                              {...field}
                              type="text"
                              autoComplete="off"
                              spellCheck={false}
                              variant={"outline"}
                              placeholder={JSON.stringify(
                                {
                                  1168193517: {
                                    scanData: {
                                      allowedFloors: [-1],
                                    },
                                  },
                                },
                                null,
                                0
                              )}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field> */}
                  </Stack>
                  <Stack direction={"row"} spacing={2} py={2} w={"fit-content"}>
                    <Field name="active">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Active</FormLabel>
                          <InputGroup>
                            <Switch
                              {...field}
                              colorScheme="blue"
                              placeholder="Active"
                              variant={"outline"}
                              width={"fit-content"}
                              defaultChecked={accessPoint?.config?.active}
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
                              variant={"outline"}
                              width={"fit-content"}
                              defaultChecked={accessPoint?.config?.armed}
                            />
                          </InputGroup>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
                  <Box my={2}>
                    <Text fontSize={"sm"}>
                      Active - Card scans will be processed.
                    </Text>
                    <Text fontSize={"sm"}>
                      Armed - Turning this off will no longer require a card to
                      grant access.
                    </Text>
                  </Box>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={2}
                    pt={2}
                  >
                    <Button
                      mb={2}
                      leftIcon={<IoClipboard />}
                      onClick={async () => {
                        clipboardOnCopy();
                        toast({
                          title: "Copied access point ID to clipboard.",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                        });
                      }}
                    >
                      {clipboardHasCopied ? "Copied!" : "Copy ID"}
                    </Button>
                  </Stack>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={2}
                    py={2}
                  >
                    <Button
                      mb={2}
                      leftIcon={<IoSave />}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      Save Changes
                    </Button>
                    <Button mb={2} leftIcon={<IoTime />}>
                      Setup Timed Access
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
