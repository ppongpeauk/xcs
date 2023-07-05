import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  HStack,
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
import { IoIosRemoveCircle } from "react-icons/io";
import { SiRoblox } from "react-icons/si";

import DeleteDialog from "@/components/DeleteDialog";
export default function PlatformOrganization() {
  const { query, push } = useRouter();
  const { idToken } = useAuthContext();
  const [organization, setOrganization] = useState<any>(null);
  const toast = useToast();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

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

  const onDelete = () => {
    fetch(`/api/v1/organizations/${query.id}`, {
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
        push("/platform/organizations");
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
    setOrganization(null);
    fetch(`/api/v1/organizations/${query.id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${idToken}` },
    })
      .then((res) => {
        if (res.status === 200) return res.json();

        if (res.status === 404) {
          push("/404");
        } else if (res.status === 403) {
          push("/403");
        }
      })
      .then((data) => {
        setOrganization(data.organization);
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
      <DeleteDialog
        title="Delete Organization"
        body="Are you sure you want to delete this organization? This will remove all associated data, including locations. This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />
      <RoleEditModal
        isOpen={roleModalOpen}
        onOpen={roleModalOnOpen}
        onClose={roleModalOnClose}
      />
      <MemberEditModal
        isOpen={memberModalOpen}
        onOpen={memberModalOnOpen}
        onClose={memberModalOnClose}
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
        <Box p={4} w={"fit-content"}>
          {organization ? (
            <Formik
              initialValues={{
                name: organization?.name,
                members: JSON.stringify(organization?.members),
                clearances: JSON.stringify(organization?.clearances),
              }}
              onSubmit={(values, actions) => {
                try {
                  JSON.parse(values.members)
                  JSON.parse(values.clearances)
                } catch (err) {
                  toast({
                    title: "Error",
                    description: "Invalid JSON.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                  return actions.setSubmitting(false);
                }
               
                fetch(`/api/v1/organizations/${query.id}`, {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: values.name,
                    members: JSON.parse(values.members),
                    clearances: JSON.parse(values.clearances),
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
                        <FormLabel>Name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Organization Name"
                            variant={"filled"}
                            width={"fit-content"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="members">
                    {({ field, form }: any) => (
                      <FormControl minW={"fit-content"}>
                        <FormLabel>(Temp.) Members</FormLabel>
                        <InputGroup mb={2}>
                          <Textarea
                            {...field}
                            type="text"
                            placeholder="Members (JSON)"
                            variant={"filled"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="clearances">
                    {({ field, form }: any) => (
                      <FormControl minW={"fit-content"}>
                        <FormLabel>(Temp.) Clearances</FormLabel>
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
                  <HStack spacing={4} py={4}>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      Update
                    </Button>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      onClick={roleModalOnOpen}
                    >
                      Edit Clearances
                    </Button>
                    <Button
                      mb={2}
                      isLoading={props.isSubmitting}
                      onClick={memberModalOnOpen}
                    >
                      Manage Members
                    </Button>
                    <Button
                      as={NextLink}
                      mb={2}
                      isLoading={props.isSubmitting}
                      href={`/platform/locations/?organization=${query.id}`}
                    >
                      Manage Locations
                    </Button>
                    <Button
                      colorScheme="red"
                      mb={2}
                      onClick={onDeleteDialogOpen}
                      leftIcon={<IoIosRemoveCircle />}
                    >
                      Delete
                    </Button>
                  </HStack>
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
