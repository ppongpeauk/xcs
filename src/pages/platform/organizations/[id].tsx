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
  useDisclosure,
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

import MemberEditModal from "@/components/MemberEditModal";
import RoleEditModal from "@/components/RoleEditModal";
import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { AiFillTag } from "react-icons/ai";
import { SiRoblox } from "react-icons/si";

export default function PlatformOrganization() {
  const { query } = useRouter();
  const { idToken } = useAuthContext();
  const [organization, setOrganization] = useState<any>(null);
  const toast = useToast();

  const {
    isOpen: roleModalOpen,
    onOpen: roleModalOnOpen,
    onClose: roleModalOnClose,
  } = useDisclosure();

  const {
    isOpen: memberModalOpen,
    onOpen: memberModalOnOpen,
    onClose: memberModalOnClose,
  } = useDisclosure();

  let refreshData = () => {
    setOrganization(null);
    fetch(`/api/v1/organizations/${query.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganization(data.organization);
      });
  };

  // Fetch organization data
  useEffect(() => {
    if (!idToken) return;
    if (!query.id) return;
    refreshData();
  }, [query.id, idToken]);

  return (
    <>
      <Head>
        <title>EVE XCS - {organization?.name}</title>
      </Head>
      <RoleEditModal isOpen={roleModalOpen} onOpen={roleModalOnOpen} onClose={roleModalOnClose} />
      <MemberEditModal isOpen={memberModalOpen} onOpen={memberModalOnOpen} onClose={memberModalOnClose} />
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
            <BreadcrumbLink as={NextLink} href={`./`} textUnderlineOffset={4}>
              Organizations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" textUnderlineOffset={4}>
              {organization?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading>{organization?.name}</Heading>

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
          {organization ? (
            <Formik
              initialValues={{
                name: organization?.name,
                members: JSON.stringify({
                  "FF0gCiIJYUPfmA4CTfqXTyPcHQb2": {
                    role: 0,
                    clearances: [
                      "177bc9de-1a0b-11ee-be56-0242ac120002"
                    ],
                  },
                  "NFtVOowrYwXFMwSjllxFbs5D9nC3": {
                    role: 1,
                    clearances: [
                      "177bc9de-1a0b-11ee-be56-0242ac120002"
                    ],
                  }
                }),
                clearances: JSON.stringify({
                  "177bc9de-1a0b-11ee-be56-0242ac120002": {
                    name: "Administrator",
                  }
                }),
              }}
              onSubmit={(values, actions) => {
                fetch(`/api/v1/organizations/${query.id}`, {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: values.name,
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
                      title: "There was an error updating the organization.",
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
                        <FormLabel>organization-name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Name"
                            variant={"filled"}
                            width={"fit-content"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="members">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>(TEMP) members</FormLabel>
                        <InputGroup mb={2}>
                          <Textarea
                            {...field}
                            type="text"
                            placeholder="Member (JSON)"
                            variant={"filled"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="clearances">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>(TEMP) clearances</FormLabel>
                        <InputGroup mb={2}>
                          <Textarea
                            {...field}
                            type="text"
                            placeholder="Clearances (JSON)"
                            variant={"filled"}
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
                    <Button mb={2} isLoading={props.isSubmitting} onClick={roleModalOnOpen}>
                      edit reader groups
                    </Button>
                    <Button mb={2} isLoading={props.isSubmitting} onClick={memberModalOnOpen}>
                      manage members
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

PlatformOrganization.getLayout = (page: any) => <Layout>{page}</Layout>;
