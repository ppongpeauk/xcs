/* eslint-disable react-hooks/rules-of-hooks */
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
import { AiFillCheckCircle, AiFillTag } from "react-icons/ai";
import { BsFillCloudDownloadFill } from "react-icons/bs";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoBusiness, IoSave } from "react-icons/io5";
import { SiRoblox } from "react-icons/si";

export default function LocationInfo({
  location,
  query,
  idToken,
  refreshData,
}: any) {
  const { push } = useRouter();
  const { user } = useAuthContext();
  const toast = useToast();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const [packLoading, setPackLoading] = useState<boolean>(false);

  const onDelete = () => {
    fetch(`/api/v1/locations/${query.id}`, {
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
        push("/platform/locations");
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
  };

  let downloadStarterPack = () => {
    setPackLoading(true);
    fetch(`/api/v1/locations/${query.id}/starter-pack`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => {
        if (res.status === 200) {
          return res.blob();
        } else {
          return res.json().then((json: any) => {
            throw new Error(json.message);
          });
        }
      })
      .then((blob) => {
        // Convert location name to kebab case for file name
        const locationName = location.name
          .replace(/\s+/g, "-")
          .replace(".", "")
          .toLowerCase();

        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `xcs-template-${locationName}.rbxmx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        toast({
          title: "Your download should start shortly.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
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
        setPackLoading(false);
      });
  };

  return (
    <>
      <DeleteDialog
        title="Delete Location"
        body="Are you sure you want to delete this location? This will revoke all API keys and delete all data associated with this location. This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />
      {location ? (
        <Box w={"fit-content"}>
          <Text as={"h1"} fontSize={"4xl"} fontWeight={"900"} mb={2}>
            General Settings
          </Text>
          <Formik
            initialValues={{
              name: location?.name,
              description: location?.description,
              enabled: location?.enabled,
              universeId: location?.roblox?.universe?.id
                ? `${location?.roblox?.universe?.id} (${location?.roblox.place?.name})`
                : "",
            }}
            onSubmit={(values, actions) => {
              fetch(`/api/v1/locations/${query.id}`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${idToken}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: values.name,
                  description: values.description || "",
                  enabled: values.enabled,
                  roblox: {
                    universe: {
                      id: location?.roblox?.universe?.id
                        ? location?.roblox?.universe?.id
                        : values.universeId.trim() == ""
                        ? ""
                        : values.universeId.trim(),
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
                    title: "There was an error updating the location.",
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
                <Field name="name">
                  {({ field, form }: any) => (
                    <FormControl isRequired={true} w={"fit-content"}>
                      <FormLabel>Name</FormLabel>
                      <InputGroup mb={2}>
                        <Input
                          {...field}
                          type="text"
                          autoComplete="off"
                          placeholder="Location Name"
                          variant={"outline"}
                          isDisabled={location?.self.role <= 2}
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
                          variant={"outline"}
                          isDisabled={location?.self.role <= 2}
                          maxH={"240px"}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Field name="universeId">
                  {({ field, form }: any) => (
                    <FormControl mb={2}>
                      <FormLabel>Universe ID</FormLabel>
                      <InputGroup mb={2}>
                        <InputLeftElement pointerEvents="none">
                          <IoBusiness />
                        </InputLeftElement>
                        <Input
                          {...field}
                          type="text"
                          autoComplete="off"
                          placeholder="Universe ID"
                          variant={"outline"}
                          // isDisabled={true}
                          isDisabled={
                            location?.self.role <= 2 ||
                            location?.roblox?.universe?.id !== null
                          }
                        />
                      </InputGroup>
                      <FormHelperText>
                        This cannot be changed once set.
                      </FormHelperText>
                    </FormControl>
                  )}
                </Field>
                <Field name="enabled">
                  {({ field, form }: any) => (
                    <FormControl width={"fit-content"}>
                      <FormLabel>Enabled</FormLabel>
                      <InputGroup mb={2}>
                        <Switch
                          {...field}
                          placeholder="Enabled"
                          variant={"outline"}
                          defaultChecked={location?.enabled}
                          isDisabled={location?.self.role <= 2}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 2, md: 4 }}
                  pt={2}
                >
                  <Button
                    mb={2}
                    isLoading={props.isSubmitting}
                    leftIcon={<IoSave />}
                    type={"submit"}
                    isDisabled={location?.self.role <= 2}
                  >
                    Save Changes
                  </Button>
                  <Button
                    mb={2}
                    onClick={downloadStarterPack}
                    isLoading={packLoading}
                    leftIcon={<BsFillCloudDownloadFill />}
                    isDisabled={location?.self.role <= 2}
                  >
                    Download Template
                  </Button>
                  <Button
                    colorScheme="red"
                    ml={"auto"}
                    mb={2}
                    onClick={onDeleteDialogOpen}
                    leftIcon={<IoIosRemoveCircle />}
                    isDisabled={location?.self.role <= 2}
                  >
                    Delete
                  </Button>
                </Stack>
                <Text fontSize={"sm"}>
                  Access groups can be managed in the settings of{" "}
                  <Link
                    as={NextLink}
                    href={`/platform/organizations/${location?.organizationId}`}
                    textDecor={"underline"}
                    textUnderlineOffset={4}
                    whiteSpace={"nowrap"}
                    _hover={{
                      color: useColorModeValue("gray.600", "gray.400"),
                    }}
                  >
                    the organization
                  </Link>{" "}
                  in which this location belongs to.
                </Text>
              </Form>
            )}
          </Formik>
        </Box>
      ) : (
        <Stack>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      )}
    </>
  );
}
