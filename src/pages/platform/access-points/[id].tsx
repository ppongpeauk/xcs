/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Skeleton,
  SkeletonText,
  Spacer,
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
          push("/platform/organizations");
          switch (res.status) {
            case 404:
              throw new Error("Access point not found.");
            case 403:
              throw new Error("You do not have permission to view this access point.");
            case 401:
              throw new Error("You do not have permission to view this access point.");
            case 500:
              throw new Error("An internal server error occurred.");
            default:
              throw new Error("An unknown error occurred.");
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
        <meta property="og:title" content="EVE XCS – Manage Access Point" />
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
      <Box maxW={"container.sm"} p={8}>
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
        <Skeleton isLoaded={accessPoint}>
          <Text as={"h1"} fontSize={"4xl"} fontWeight={"900"}>
            {accessPoint?.name || "Loading..."}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={accessPoint}>
          <Text fontSize={"lg"} color={"gray.500"}>
            {accessPoint?.organization.name} – {accessPoint?.location.name}
          </Text>
        </Skeleton>
        <Divider my={4} />
        <Box minW={["100%", "fit-content"]}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: accessPoint?.name,
              description: accessPoint?.description,
              active: accessPoint?.config?.active,
              armed: accessPoint?.config?.armed,
              unlockTime: accessPoint?.config?.unlockTime,
              accessGroups: agIds(
                accessPoint?.organization,
                accessPoint?.config?.alwaysAllowed?.groups
              ),
              alwaysAllowedUsers: JSON.stringify(
                accessPoint?.config?.alwaysAllowed?.users
              ),
              webhookUrl: accessPoint?.config?.webhook?.url,
              webhookEventGranted: accessPoint?.config?.webhook?.eventGranted,
              webhookEventDenied: accessPoint?.config?.webhook?.eventDenied,
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

                    config: {
                      active: values.active,
                      armed: values.armed,
                      unlockTime: values.unlockTime,

                      alwaysAllowed: {
                        // users: JSON.parse(values.alwaysAllowedUsers),
                        groups: agNames(
                          accessPoint?.organization,
                          values.accessGroups
                        ),
                      },

                      webhook: {
                        url: values.webhookUrl,
                        eventGranted: values.webhookEventGranted,
                        eventDenied: values.webhookEventDenied,
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
                    <FormControl w={"fit-content"}>
                      <Skeleton isLoaded={accessPoint}>
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
                      </Skeleton>
                    </FormControl>
                  )}
                </Field>
                <Field name="description">
                  {({ field, form }: any) => (
                    <FormControl maxW={"500px"}>
                      <Skeleton isLoaded={accessPoint}>
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
                      </Skeleton>
                    </FormControl>
                  )}
                </Field>
                <Heading as={"h2"} fontSize={"xl"} fontWeight={"900"} py={2}>
                  Configuration
                </Heading>
                <Accordion defaultIndex={[0]} py={2}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Main Settings
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Stack
                        direction={"row"}
                        spacing={2}
                        py={2}
                        w={"fit-content"}
                      >
                        <Field name="active">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
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
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="armed">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
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
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                      <Box my={2}>
                        <Text fontSize={"sm"}>
                          Active - Card scans will be processed.
                        </Text>
                        <Text fontSize={"sm"}>
                          Armed - Turning this off will no longer require a card
                          to grant access.
                        </Text>
                      </Box>
                      <Field name="unlockTime">
                        {({ field, form }: any) => (
                          <FormControl w={"fit-content"}>
                            <Skeleton isLoaded={accessPoint}>
                              <FormLabel>Unlock Time</FormLabel>
                              <InputGroup mb={2}>
                                <NumberInput
                                  {...field}
                                  autoComplete="off"
                                  placeholder="Unlock Time"
                                  variant={"outline"}
                                  min={1}
                                  defaultValue={8}
                                  onChange={(value) => {
                                    form.setFieldValue("unlockTime", value);
                                  }}
                                >
                                  <NumberInputField />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem zIndex={500}>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Permissions
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4} overflow={"visible"} h={"200px"}>
                      <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={2}
                        overflow={"scroll"}
                        h={"full"}
                      >
                        <Field name="accessGroups">
                          {({ field, form }: any) => (
                            <FormControl w={"fit-content"}>
                              <Skeleton isLoaded={accessPoint}>
                                <MultiSelect
                                  {...field}
                                  display={"absolute"}
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
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Webhooks
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel>
                      {/* <Text fontSize={"sm"} fontWeight={"500"}>
                        Coming soon. This feature is not yet available.
                      </Text> */}
                      <Field name="webhookUrl" w={"min-content"}>
                        {({ field, form }: any) => (
                          <FormControl w={"full"}>
                            <Skeleton isLoaded={accessPoint}>
                              <FormLabel>Webhook URL</FormLabel>
                              <InputGroup mb={2}>
                                <Input
                                  {...field}
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Webhook URL"
                                  variant={"outline"}
                                />
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                      <Heading
                        as={"h3"}
                        fontSize={"xl"}
                        fontWeight={"900"}
                        mt={4}
                      >
                        Events
                      </Heading>
                      <Stack
                        direction={"row"}
                        spacing={2}
                        py={2}
                        w={"fit-content"}
                      >
                        <Field name="webhookEventGranted">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Granted</FormLabel>
                                <InputGroup>
                                  <Switch
                                    {...field}
                                    variant={"outline"}
                                    width={"fit-content"}
                                    defaultChecked={
                                      accessPoint?.config?.webhook?.eventGranted
                                    }
                                  />
                                </InputGroup>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="webhookEventDenied">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Denied</FormLabel>
                                <InputGroup>
                                  <Switch
                                    {...field}
                                    variant={"outline"}
                                    width={"fit-content"}
                                    defaultChecked={
                                      accessPoint?.config?.webhook?.eventDenied
                                    }
                                  />
                                </InputGroup>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                      <Box my={2}>
                        <Text fontSize={"sm"} mb={1}>
                          Choose which events to send to the webhook.
                        </Text>
                        <Text fontSize={"sm"}>
                          It is not recommended to enable denied events, as this
                          will send a webhook request for every denied card scan
                          (which could be a lot).
                        </Text>
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
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
                  {/* <Button mb={2} leftIcon={<IoTime />} isDisabled>
                    Setup Timed Access
                  </Button> */}
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
                  <Spacer />
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
        </Box>
      </Box>
    </>
  );
}

PlatformAccessPoint.getLayout = (page: any) => <Layout>{page}</Layout>;
