import Layout from "@/layouts/PlatformLayout";
import {
  Box,
  Button,
  Container,
  Divider,
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
import { BiSolidExit } from "react-icons/bi";
import { FaIdBadge, FaUserShield } from "react-icons/fa";
import { ImTree } from "react-icons/im";
import { IoIosRemoveCircle } from "react-icons/io";
import { RiMailAddFill } from "react-icons/ri";
import { SiRoblox } from "react-icons/si";

import DeleteDialog from "@/components/DeleteDialog";
import InviteOrganizationModal from "@/components/InviteOrganizationModal";
export default function PlatformOrganization() {
  const { query, push } = useRouter();
  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [organization, setOrganization] = useState<any>(null);
  const toast = useToast();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const {
    isOpen: isLeaveDialogOpen,
    onOpen: onLeaveDialogOpen,
    onClose: onLeaveDialogClose,
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

  const {
    isOpen: inviteModalOpen,
    onOpen: inviteModalOnOpen,
    onClose: inviteModalOnClose,
  } = useDisclosure();

  const onLeave = () => {
    fetch(`/api/v1/organizations/${query.id}/leave`, {
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
        onLeaveDialogClose();
      });
  };

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

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      setIdToken(token);
    });
  }, [user]);

  return (
    <>
      <Head>
        <title>EVE XCS – {organization?.name}</title>
        <meta property="og:title" content="EVE XCS - Manage Organization" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="/images/hero3.jpg" />
        <meta name="twitter:card" content="summary_large_image" /> */}
      </Head>
      <DeleteDialog
        title="Delete Organization"
        body="Are you sure you want to delete this organization? This will remove all associated data, including locations and API keys. This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />

      <DeleteDialog
        title="Leave Organization"
        body="Are you sure you want to leave this organization?"
        isOpen={isLeaveDialogOpen}
        onClose={onLeaveDialogClose}
        onDelete={onLeave}
        buttonText="Leave"
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
      <InviteOrganizationModal
        isOpen={inviteModalOpen}
        onOpen={inviteModalOnOpen}
        onClose={inviteModalOnClose}
        onCreate={() => {}}
        organizationId={organization?.id}
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
        <Divider my={4} />
        {organization ? (
          <Box p={4} w={"fit-content"}>
            <Formik
              initialValues={{
                name: organization?.name,
                members: JSON.stringify(organization?.members),
                clearances: JSON.stringify(organization?.clearances),
              }}
              onSubmit={(values, actions) => {
                try {
                  JSON.parse(values.members);
                  JSON.parse(values.clearances);
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
                  <HStack spacing={4} pt={2}>
                    <Button
                      mb={2}
                      isDisabled={props.isSubmitting}
                      isLoading={props.isSubmitting}
                      onClick={roleModalOnOpen}
                      leftIcon={<FaUserShield />}
                    >
                      Manage Clearances
                    </Button>
                    <Button
                      mb={2}
                      isDisabled={props.isSubmitting}
                      isLoading={props.isSubmitting}
                      onClick={memberModalOnOpen}
                      leftIcon={<FaIdBadge />}
                    >
                      Manage Members
                    </Button>
                    <Button
                      mb={2}
                      isDisabled={props.isSubmitting}
                      isLoading={props.isSubmitting}
                      onClick={inviteModalOnOpen}
                      leftIcon={<RiMailAddFill />}
                    >
                      Invite Members
                    </Button>
                  </HStack>
                  <HStack spacing={4} pt={2}>
                    <Button
                      mb={2}
                      isDisabled={props.isSubmitting}
                      isLoading={props.isSubmitting}
                      type={"submit"}
                    >
                      Update
                    </Button>
                    <Button
                      as={NextLink}
                      mb={2}
                      href={`/platform/locations/?organization=${query.id}`}
                      leftIcon={<ImTree />}
                    >
                      View Locations
                    </Button>
                    {organization.user.role > 2 ? (
                      <Button
                        colorScheme="red"
                        mb={2}
                        isDisabled={props.isSubmitting}
                        onClick={onDeleteDialogOpen}
                        leftIcon={<IoIosRemoveCircle />}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        colorScheme="red"
                        mb={2}
                        onClick={onLeaveDialogOpen}
                        leftIcon={<BiSolidExit />}
                      >
                        Leave Organization
                      </Button>
                    )}
                  </HStack>
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

PlatformOrganization.getLayout = (page: any) => <Layout>{page}</Layout>;
