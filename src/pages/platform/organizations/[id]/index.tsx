import Layout from "@/layouts/PlatformLayout";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
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

import AccessGroupEditModal from "@/components/AccessGroupEditModal";
import MemberEditModal from "@/components/MemberEditModal";
import { useToast } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { AiFillTag } from "react-icons/ai";
import { BiSolidExit } from "react-icons/bi";
import { FaIdBadge, FaTags, FaUserShield } from "react-icons/fa";
import { HiGlobeAlt, HiIdentification, HiUserGroup } from "react-icons/hi";
import { ImTree } from "react-icons/im";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoSave } from "react-icons/io5";
import { RiMailAddFill } from "react-icons/ri";
import { SiRoblox } from "react-icons/si";

import DeleteDialog from "@/components/DeleteDialog";
export default function PlatformOrganization() {
  const { query, push } = useRouter();
  const { user } = useAuthContext();
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

  const onLeave = async () => {
    await user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${query.id}/leave`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          onLeaveDialogClose();
        });
    });
  };

  const onDelete = async () => {
    await user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${query.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          onDeleteDialogClose();
        });
    });
  };

  let refreshData = async () => {
    // setOrganization(null);
    await user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${query.id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          push("/platform/organizations");
          switch (res.status) {
            case 404:
              throw new Error("Organization not found.");
            case 403:
              throw new Error(
                "You do not have permission to view this organization."
              );
            case 401:
              throw new Error(
                "You do not have permission to view this organization."
              );
            case 500:
              throw new Error("An internal server error occurred.");
            default:
              throw new Error("An unknown error occurred.");
          }
        })
        .then((data) => {
          setOrganization(data.organization);
        })
        .catch((err) => {
          toast({
            title: "There was an error fetching the organization.",
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };

  const onMemberRemove = async (member: any) => {
    await user.getIdToken().then((token: string) => {
      console.log(member);
      fetch(
        `/api/v1/organizations/${query.id}/members/${
          member.formattedId || member.id
        }`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      )
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
          refreshData();
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

  const onGroupRemove = async (group: any) => {
    await user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${query.id}/access-groups/${group.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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
          refreshData();
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

  // Fetch organization data
  useEffect(() => {
    if (!user) return;
    if (!query.id) return;
    refreshData();
  }, [query.id, user]);

  return (
    <>
      <Head>
        <title>Restrafes XCS – {organization?.name}</title>
        <meta
          property="og:title"
          content="Restrafes XCS - Manage Organization"
        />
        <meta property="og:site_name" content="Restrafes XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.jpeg" />
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
      <AccessGroupEditModal
        isOpen={roleModalOpen}
        onOpen={roleModalOnOpen}
        onClose={roleModalOnClose}
        onRefresh={refreshData}
        organization={organization}
        clientMember={organization?.members.find(
          (member: any) => member.id === user?.uid
        )}
        // filter groups to only include groups that contain locationId
        groups={Object.values(organization?.accessGroups || {}).filter(
          (group: any) => group.type === "organization"
        )}
        onGroupRemove={onGroupRemove}
      />
      <MemberEditModal
        isOpen={memberModalOpen}
        onOpen={memberModalOnOpen}
        onClose={memberModalOnClose}
        onRefresh={refreshData}
        members={organization?.members}
        organization={organization}
        clientMember={organization?.members.find(
          (member: any) => member.id === user?.uid
        )}
        onMemberRemove={onMemberRemove}
      />
      <Container maxW={"full"} p={8}>
        <Breadcrumb
          spacing="8px"
          mb={2}
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
        <Stack direction={"row"} align={"center"} spacing={4} py={4}>
          <Skeleton isLoaded={organization} borderRadius={"lg"}>
            <Avatar
              name={organization?.name}
              src={organization?.avatar}
              boxSize={{ base: "6rem", md: "10rem" }}
              borderRadius={"lg"}
            />
          </Skeleton>
          <Flex flexDir={"column"}>
            <Skeleton isLoaded={organization}>
              <Text
                as={"h1"}
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight={"900"}
                lineHeight={0.9}
              >
                {organization?.name || "Organization Name"}
              </Text>
            </Skeleton>
            <Skeleton isLoaded={organization} my={2}>
              <Text fontSize={"md"} fontWeight={"500"} color={"gray.500"}>
                Owned by{" "}
                <Link
                  as={NextLink}
                  textUnderlineOffset={4}
                  href={`/platform/profile/${organization?.owner.username}`}
                >
                  {organization?.owner.displayName || "Organization Owner"}
                </Link>
              </Text>
            </Skeleton>
            <AvatarGroup size={"md"} max={4}>
              <Avatar
                as={NextLink}
                key={organization?.owner.id}
                href={`/platform/profile/${organization?.owner.username}`}
                src={organization?.owner.avatar}
              />
              {organization?.members
                .filter((member: any) => member.type !== "roblox-group")
                .map(
                  (member: any) =>
                    member.id !== organization?.owner.id &&
                    (!member.type.startsWith("roblox") ? (
                      <Avatar
                        as={NextLink}
                        key={member?.id}
                        href={`/platform/profile/${member?.username}`}
                        src={member?.avatar}
                        bg={"gray.300"}
                      />
                    ) : member.type === "roblox" ? (
                      <Avatar
                        as={NextLink}
                        key={member?.id}
                        href={`https://www.roblox.com/users/${member?.id}/profile`}
                        src={member?.avatar}
                        bg={"gray.300"}
                        target={"_blank"}
                      />
                    ) : (
                      <>
                        <Avatar
                          as={NextLink}
                          key={member?.id}
                          href={`https://www.roblox.com/groups/${member?.id}/group`}
                          src={member?.avatar}
                          bg={"gray.300"}
                          target={"_blank"}
                        />
                      </>
                    ))
                )}
            </AvatarGroup>
          </Flex>
        </Stack>
        <Divider my={4} />
        <Text as={"h2"} fontSize={"3xl"} fontWeight={"900"}>
          General Settings
        </Text>
        <Skeleton isLoaded={!!organization} w={"fit-content"}>
          <Box my={2} w={"fit-content"}>
            <Formik
              initialValues={{
                name: organization?.name,
                members: JSON.stringify(organization?.members),
                accessGroups: JSON.stringify(organization?.accessGroups),
              }}
              onSubmit={(values, actions) => {
                try {
                  JSON.parse(values.members);
                  JSON.parse(values.accessGroups);
                } catch (err) {
                  toast({
                    title: "Error",
                    description: "Invalid JSON.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                  return actions.setSubmitting(false);
                }
                user.getIdToken().then((token: string) => {
                  fetch(`/api/v1/organizations/${query.id}`, {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: values.name,
                      members: JSON.parse(values.members),
                      accessGroups: JSON.parse(values.accessGroups),
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
                        title: "There was an error updating the organization.",
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
                  <Field name="name">
                    {({ field, form }: any) => (
                      <FormControl>
                        <FormLabel>Name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Organization Name"
                            variant={"outline"}
                            width={"fit-content"}
                            autoComplete={"off"}
                            autoCorrect={"off"}
                            spellCheck={"false"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={2}
                    py={2}
                  >
                    <Button
                      onClick={memberModalOnOpen}
                      leftIcon={<HiUserGroup />}
                    >
                      Manage Members
                    </Button>
                    <Button onClick={roleModalOnOpen} leftIcon={<HiGlobeAlt />}>
                      Manage Access Groups
                    </Button>
                  </Stack>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={2}
                    py={2}
                  >
                    <Button
                      isLoading={props.isSubmitting}
                      leftIcon={<IoSave />}
                      type={"submit"}
                    >
                      Save Changes
                    </Button>
                    <Button
                      as={NextLink}
                      href={`/platform/locations/?organization=${query.id}`}
                      leftIcon={<ImTree />}
                    >
                      View Locations
                    </Button>
                    {organization?.user.role >= 3 ? (
                      <Button
                        colorScheme="red"
                        mb={2}
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
                  </Stack>
                </Form>
              )}
            </Formik>
          </Box>
        </Skeleton>
      </Container>
    </>
  );
}

PlatformOrganization.getLayout = (page: any) => <Layout>{page}</Layout>;
