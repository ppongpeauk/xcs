/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  FormControl,
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
import { AiFillTag } from "react-icons/ai";
import { IoBusiness } from "react-icons/io5";
import { SiRoblox } from "react-icons/si";

export default function PlatformLocation() {
  const router = useRouter();
  const { query } = useRouter();
  const { idToken } = useAuthContext();
  const [location, setLocation] = useState<any>(null);
  const toast = useToast();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

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
        router.push("/platform/locations");
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
      .then((res) => res.json())
      .then((data) => {
        setLocation(data.location);
      });
  };

  // Fetch location data
  useEffect(() => {
    if (!idToken) return;
    if (!query.id) return;
    refreshData();
  }, [query.id, idToken]);

  return (
    <>
      <Head>
        <title>EVE XCS - {location?.name}</title>
      </Head>
      <DeleteDialog
        title="Delete Location"
        body="Are you sure you want to delete this location? This action cannot be undone."
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
              href={`./?organization=${location?.organizationId}`}
              textUnderlineOffset={4}
            >
              Locations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" textUnderlineOffset={4}>
              {location?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>{location?.name}</Heading>
        <Box p={4} w={"min-content"}>
          {location ? (
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
                      <FormControl>
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
                            disabled={location?.roblox?.placeId !== null}
                          />
                        </InputGroup>
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
                  <Stack direction={"row"} spacing={4} py={4}>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      Update
                    </Button>
                    <Button colorScheme="blue" mb={2}>
                      Download Pack
                    </Button>
                    <Button
                      colorScheme="red"
                      mb={2}
                      onClick={onDeleteDialogOpen}
                    >
                      Delete
                    </Button>
                  </Stack>
                  <Text>
                    Roles can be managed in the settings of{" "}
                    <Link
                      as={NextLink}
                      href={`/platform/organizations/${location?.organizationId}`}
                      textDecor={"underline"}
                      textUnderlineOffset={4}
                      whiteSpace={"nowrap"}
                      _hover={{ color: useColorModeValue("gray.600", "gray.400") }}
                    >
                      the organization
                    </Link>{" "}
                    in which this location belongs to.
                  </Text>
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

PlatformLocation.getLayout = (page: any) => <Layout>{page}</Layout>;
