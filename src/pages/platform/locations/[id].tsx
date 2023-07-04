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
} from "@chakra-ui/react";
import NextLink from "next/link";

import { useAuthContext } from "@/contexts/AuthContext";

import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { AiFillTag } from "react-icons/ai";
import { SiRoblox } from "react-icons/si";

export default function PlatformLocation() {
  const { query } = useRouter();
  const { idToken } = useAuthContext();
  const [location, setLocation] = useState<any>(null);
  const toast = useToast();

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

        {/* Create a form with a "Download Pack" button and a ROBLOX place id input box */}
        {/* When the user clicks the "Download Pack" button, send a request to the API to create a new pack */}
        {/* <InputGroup>
            <InputLeftElement pointerEvents={"none"}>
              <SiRoblox />
            </InputLeftElement>
            <Input
              variant={"filled"}
              type="text"
              placeholder="Experience ID"
              w={"fit-content"}
            />
          </InputGroup> */}
        <Box p={4}>
          {location ? (
            <Formik
              initialValues={{
                name: location?.name,
                enabled: location?.enabled,
                experienceId: location?.roblox?.experienceId,
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
                    experienceId: values.experienceId,
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
                        <FormLabel>location-name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Name"
                            variant={"filled"}
                            required={true}
                            width={"fit-content"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="experienceId">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>experience-id</FormLabel>
                        <InputGroup mb={2}>
                          <InputLeftElement pointerEvents="none">
                            <SiRoblox color="gray.300" />
                          </InputLeftElement>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Experience ID"
                            variant={"filled"}
                            required={false}
                            disabled={location?.roblox?.experienceId !== null}
                            width={"fit-content"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="enabled">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>readers-enabled</FormLabel>
                        <InputGroup mb={2}>
                          <Switch
                            {...field}
                            placeholder="readers-enabled"
                            colorScheme="gray"
                            variant={"filled"}
                            required={false}
                            width={"fit-content"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Stack direction={"row"} spacing={4}>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      update
                    </Button>
                    <Button colorScheme="blue" mb={2}>
                      download pack
                    </Button>
                  </Stack>
                  <Text>
                    Roles can be managed in the settings of{" "}
                    <Link
                      as={NextLink}
                      href={`/platform/organizations/${location?.organizationId}`}
                      textUnderlineOffset={4}
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
