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

export default function PlatformLocation() {
  const { query, push } = useRouter();
  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [location, setLocation] = useState<any>(null);
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
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        onDeleteDialogClose();
      });
  };

  let refreshData = () => {
    setLocation(null);
    fetch(`/api/v1/locations/${query.id}`, {
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
        setLocation(data.location);
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
          title: "Downloading template...",
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
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        setPackLoading(false);
      });
  };

  // Fetch location data
  useEffect(() => {
    if (!idToken) return;
    if (!query.id) return;
    refreshData();
  }, [query.id, idToken]);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      setIdToken(token);
    });
  }, [user]);

  return (
    <>
      <Head>
        <title>EVE XCS - {location?.name}</title>
      </Head>
      <DeleteDialog
        title="Delete Location"
        body="Are you sure you want to delete this location? This will revoke all API keys and delete all data associated with this location. This action cannot be undone."
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
              href={`/platform/organizations/${location?.organization.id}`}
              textUnderlineOffset={4}
            >
              {location?.organization.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {/* <BreadcrumbItem>
            <BreadcrumbLink
              as={NextLink}
              href={`./?organization=${location?.organization.id}`}
              textUnderlineOffset={4}
            >
              Locations
            </BreadcrumbLink>
          </BreadcrumbItem> */}
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" textUnderlineOffset={4}>
              {location?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>{location?.name}</Heading>
        {location ? (
          <Box p={4} w={"min-content"}>
            <Formik
              initialValues={{
                name: location?.name,
                description: location?.description,
                enabled: location?.enabled,
                placeId: location?.roblox?.placeId || "",
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
                      placeId:
                        values.placeId.trim() == ""
                          ? null
                          : values.placeId.trim(),
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
                  <Field name="placeId">
                    {({ field, form }: any) => (
                      <FormControl mb={2}>
                        <FormLabel>Experience ID</FormLabel>
                        <InputGroup mb={2}>
                          <InputLeftElement pointerEvents="none">
                            <IoBusiness />
                          </InputLeftElement>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Experience ID"
                            variant={"filled"}
                            // isDisabled={true}
                            disabled={location?.roblox?.placeId !== null}
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
                      <FormControl>
                        <FormLabel>Enabled</FormLabel>
                        <InputGroup mb={2}>
                          <Switch
                            {...field}
                            placeholder="Enabled"
                            variant={"filled"}
                            width={"fit-content"}
                            defaultChecked={location?.enabled}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Stack direction={"row"} spacing={4} py={2}>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      Update
                    </Button>
                    <Button
                      mb={2}
                      onClick={downloadStarterPack}
                      isLoading={packLoading}
                      leftIcon={<BsFillCloudDownloadFill />}
                    >
                      Download Template
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
                  <Text>
                    Security clearances can be managed in the settings of{" "}
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
      </Container>
    </>
  );
}

PlatformLocation.getLayout = (page: any) => <Layout>{page}</Layout>;
