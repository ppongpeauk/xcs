/* eslint-disable react-hooks/rules-of-hooks */
import {
    Avatar,
    Button,
    ButtonGroup,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Portal,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    Spacer,
    Stack,
    VStack,
    chakra,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";

import Editor from "@monaco-editor/react";

import DeleteDialog from "@/components/DeleteDialog";
import InviteOrganizationModal from "@/components/InviteOrganizationModal";
import InviteOrganizationRobloxGroupModal from "@/components/InviteOrganizationRobloxGroupModal";
import InviteOrganizationRobloxModal from "@/components/InviteOrganizationRobloxModal";

import { useAuthContext } from "@/contexts/AuthContext";
import { agIds, agKV, agNames, roleToText, textToRole } from "@/lib/utils";
import {
    Box,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { AsyncSelect, CreatableSelect, Select } from "chakra-react-select";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FaIdBadge } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoSave } from "react-icons/io5";
import { MdEditSquare } from "react-icons/md";
import { RiMailAddFill } from "react-icons/ri";
import { SiRoblox } from "react-icons/si";

const ChakraEditor = chakra(Editor);

interface AccessGroup {
  id: string;
  name: string;
}

export default function MemberEditModal({
  isOpen,
  onOpen,
  onClose,
  onRefresh,
  clientMember,
  members,
  organization,
  onMemberRemove,
}: any) {
  const { user } = useAuthContext();
  const toast = useToast();
  const [focusedMember, setFocusedMember] = useState<any>(null);
  const themeBorderColor = useColorModeValue("gray.200", "gray.700");

  const memberSearchRef = useRef<any>(null);
  const [filteredMembers, setFilteredMembers] = useState<any>(null);

  const editButtonsRef = useRef<any>(null);

  const {
    isOpen: deleteUserDialogOpen,
    onOpen: deleteUserDialogOnOpen,
    onClose: deleteUserDialogOnClose,
  } = useDisclosure();

  const {
    isOpen: inviteModalOpen,
    onOpen: inviteModalOnOpen,
    onClose: inviteModalOnClose,
  } = useDisclosure();

  const {
    isOpen: robloxModalOpen,
    onOpen: robloxModalOnOpen,
    onClose: robloxModalOnClose,
  } = useDisclosure();

  const {
    isOpen: robloxGroupModalOpen,
    onOpen: robloxGroupModalOnOpen,
    onClose: robloxGroupModalOnClose,
  } = useDisclosure();

  const filterMembers = (query: string) => {
    if (!query) return members;
    return members.filter(
      (member: any) =>
        member.displayName.toLowerCase().includes(query.toLowerCase()) ||
        member.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    // if (filteredMembers && filteredMembers !== members) return; // don't reset if we're already filtering
    setFilteredMembers(members);
  }, [members]);

  useEffect(() => {
    if (!organization) return;
    setFilteredMembers(filterMembers(memberSearchRef?.current?.value));
    setFocusedMember(
      organization.members.find(
        (member: any) => member.id === focusedMember?.id
      )
    );
  }, [organization]);

  return (
    <>
      <DeleteDialog
        isOpen={deleteUserDialogOpen}
        onClose={deleteUserDialogOnClose}
        title="Remove Member"
        body={`Are you sure you want to remove ${focusedMember?.displayName} from this organization?`}
        buttonText="Remove"
        onDelete={() => {
          deleteUserDialogOnClose();
          onMemberRemove(focusedMember);
          setFocusedMember(null);
        }}
      />
      <InviteOrganizationModal
        isOpen={inviteModalOpen}
        onOpen={inviteModalOnOpen}
        onClose={inviteModalOnClose}
        onCreate={() => {}}
        organizationId={organization?.id}
      />
      <InviteOrganizationRobloxModal
        isOpen={robloxModalOpen}
        onClose={robloxModalOnClose}
        onAdd={() => {
          onRefresh();
        }}
        organization={organization}
      />
      <InviteOrganizationRobloxGroupModal
        isOpen={robloxGroupModalOpen}
        onClose={robloxGroupModalOnClose}
        onAdd={() => {
          onRefresh();
        }}
        organization={organization}
      />
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        blockScrollOnMount={false}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "full", lg: "container.xl" }}
          bg={useColorModeValue("white", "gray.800")}
          h="100%"
        >
          <ModalHeader>Manage Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody w={"full"} py={0} h="100%">
            <VStack w="100%" h="100%">
              <Stack w="100%" mb={2} direction={{ base: "column", md: "row" }}>
                <FormControl w={{ base: "full", md: "300px" }}>
                  <FormLabel>Search Member</FormLabel>
                  <Input
                    placeholder={"Search for a member..."}
                    ref={memberSearchRef}
                    onChange={(e) => {
                      if (e.target?.value) {
                        setFilteredMembers(filterMembers(e.target?.value));
                      } else {
                        setFilteredMembers(members);
                      }
                    }}
                  />
                </FormControl>
                <Spacer />
                <Button
                  alignSelf={{
                    base: "normal",
                    md: "flex-end",
                  }}
                  onClick={inviteModalOnOpen}
                  leftIcon={<RiMailAddFill />}
                  isDisabled={clientMember?.role < 2}
                >
                  Invite User
                </Button>
                <Button
                  alignSelf={{
                    base: "normal",
                    md: "flex-end",
                  }}
                  onClick={robloxModalOnOpen}
                  leftIcon={<SiRoblox />}
                  isDisabled={clientMember?.role < 2}
                >
                  Add Roblox User
                </Button>
                {/* <Button
                  alignSelf={{ base: "normal", md: "flex-end" }}
                  onClick={robloxGroupModalOnOpen}
                  leftIcon={<SiRoblox />}
                  isDisabled={clientMember?.role < 2}
                >
                  Add Roblox Group
                </Button> */}
              </Stack>
              <Flex
                w={"full"}
                flexGrow={1}
                h="auto"
                justify={"space-between"}
                flexDir={{ base: "column", xl: "row" }}
                overflow="scroll"
              >
                <TableContainer
                  py={2}
                  minH={{ base: "320px", xl: "100%" }}
                  overflowY={"scroll"}
                  flexGrow={1}
                  px={4}
                >
                  <Table size={{ base: "sm", md: "sm" }}>
                    <Thead>
                      <Tr>
                        <Th>Member</Th>
                        <Th>Role</Th>
                        <Th isNumeric>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {organization ? (
                        (filteredMembers || []).map((member: any) => (
                          <Tr key={member?.id}>
                            <Td>
                              <Flex align={"center"} my={2}>
                                <Avatar
                                  size="md"
                                  src={member?.avatar}
                                  mr={4}
                                  bg={"gray.300"}
                                />

                                <Flex flexDir={"column"}>
                                  {member.type !== "roblox" ? (
                                    <>
                                      <Text fontWeight="bold">
                                        {member?.displayName}
                                      </Text>
                                      <Text fontSize="sm" color="gray.500">
                                        @{member?.username}
                                      </Text>
                                    </>
                                  ) : (
                                    <Flex flexDir={"column"} justify={"center"}>
                                      <Flex align={"center"}>
                                        <Icon
                                          size={"sm"}
                                          as={SiRoblox}
                                          mr={1}
                                        />
                                        <Text fontWeight="bold">
                                          {member?.displayName}
                                        </Text>
                                      </Flex>
                                      <Text fontSize="sm" color="gray.500">
                                        @{member?.username}
                                      </Text>
                                    </Flex>
                                  )}
                                  <Text fontSize="sm" color="gray.500">
                                    Joined{" "}
                                    {moment(member?.joinedAt).format(
                                      "MMMM Do YYYY"
                                    )}
                                  </Text>
                                </Flex>
                              </Flex>
                            </Td>
                            <Td>
                              <Text>{roleToText(member?.role)}</Text>
                            </Td>
                            <Td isNumeric>
                              <Button
                                size="sm"
                                leftIcon={<MdEditSquare />}
                                onClick={() => {
                                  setFocusedMember(member);
                                }}
                              >
                                Manage
                              </Button>
                              <IconButton
                                aria-label="Remove Member"
                                size="sm"
                                colorScheme="red"
                                ml={2}
                                icon={<IoIosRemoveCircle />}
                                onClick={() => {
                                  setFocusedMember(member);
                                  deleteUserDialogOnOpen();
                                }}
                                isDisabled={
                                  clientMember?.id === member?.id ||
                                  member?.role >= 3 ||
                                  member?.role >= clientMember?.role
                                }
                              />
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <>
                          {Array.from(Array(8).keys()).map((i) => (
                            <Tr key={i}>
                              <Td>
                                <Flex align={"center"}>
                                  <SkeletonCircle size="10" mr={4} />
                                  <Flex flexDir={"column"}>
                                    <SkeletonText noOfLines={2} spacing="4" />
                                  </Flex>
                                </Flex>
                              </Td>
                              <Td>
                                <SkeletonText
                                  noOfLines={1}
                                  spacing="4"
                                  skeletonHeight={4}
                                />
                              </Td>
                              <Td isNumeric>
                                <SkeletonText
                                  noOfLines={1}
                                  spacing="4"
                                  skeletonHeight={4}
                                />
                              </Td>
                            </Tr>
                          ))}
                        </>
                      )}
                    </Tbody>
                    {filteredMembers?.length < 1 && (
                      <TableCaption>No members found.</TableCaption>
                    )}
                  </Table>
                </TableContainer>
                {/* Edit Member */}
                <Skeleton
                  isLoaded={organization}
                  rounded={"lg"}
                  minW={{
                    base: "unset",
                    sm: "unset",
                    lg: "512px",
                  }}
                  flexBasis={1}
                  h="full"
                >
                  <Flex
                    //mt={2}
                    p={6}
                    rounded={"lg"}
                    border={"1px solid"}
                    borderColor={themeBorderColor}
                    //minH={{ base: "unset", xl: "512px" }}
                    //maxH={{ base: "unset", xl: "512px" }}
                    h={"full"}
                    overflowY={"auto"}
                  >
                    {!focusedMember || !organization ? (
                      <Text m={"auto"} color={"gray.500"}>
                        Select a member to manage.
                      </Text>
                    ) : (
                      <Flex flexDir={"column"} w={"full"}>
                        {/* Header */}
                        <Flex align={"center"} h={"fit-content"}>
                          <Avatar
                            size={"xl"}
                            src={focusedMember?.avatar}
                            mr={4}
                            bg={"gray.300"}
                          />
                          <Flex flexDir={"column"}>
                            <Flex align={"center"}>
                              {focusedMember.type === "roblox" && (
                                <Icon
                                  size={"sm"}
                                  as={SiRoblox}
                                  mr={1}
                                  h={"full"}
                                />
                              )}
                              <Text
                                as={"h2"}
                                fontSize={"xl"}
                                fontWeight={"bold"}
                              >
                                {focusedMember?.displayName}
                              </Text>
                            </Flex>
                            <Text fontSize={"sm"} color={"gray.500"}>
                              Joined{" "}
                              {moment(focusedMember?.joinedAt).format(
                                "MMMM Do YYYY"
                              )}
                            </Text>
                            <Text fontSize={"sm"} color={"gray.500"}>
                              {roleToText(focusedMember?.role)}
                            </Text>
                            {
                              <Button
                                as={NextLink}
                                href={
                                  focusedMember?.type === "user"
                                    ? `/platform/profile/${focusedMember?.username}`
                                    : `https://www.roblox.com/users/${focusedMember?.id}/profile`
                                }
                                size={"sm"}
                                mt={2}
                                target={"_blank"}
                                w={"fit-content"}
                                px={8}
                              >
                                View Profile
                              </Button>
                            }
                          </Flex>
                        </Flex>
                        {/* Body */}
                        <Formik
                          enableReinitialize={true}
                          initialValues={{
                            role: {
                              label: roleToText(focusedMember?.role),
                              value: focusedMember?.role,
                            },
                            accessGroups: focusedMember?.accessGroups.map(
                              (ag: AccessGroup) => ({
                                label: Object.values(
                                  organization?.accessGroups as AccessGroup[]
                                ).find((oag: any) => oag.id === ag)?.name,
                                value: ag,
                              })
                            ),
                            scanData: JSON.stringify(
                              focusedMember?.scanData,
                              null,
                              3
                            ),
                          }}
                          onSubmit={(values, actions) => {
                            user.getIdToken().then((token: string) => {
                              fetch(
                                `/api/v1/organizations/${organization?.id}/members/${focusedMember?.id}`,
                                {
                                  method: "PATCH",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    role: values?.role?.value,
                                    scanData: values?.scanData || "{}",

                                    accessGroups: values?.accessGroups?.map(
                                      (ag: any) => ag?.value
                                    ),
                                  }),
                                }
                              )
                                .then((res) => {
                                  if (res.status === 200) {
                                    return res.json();
                                  } else {
                                    return res.json().then((json) => {
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
                                  onRefresh();
                                })
                                .catch((error) => {
                                  toast({
                                    title:
                                      "There was an error updating the member.",
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
                            <Form
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <Flex flexDir={"column"} mt={4} w={"full"} pb={8}>
                                <Stack>
                                  <Field name="role">
                                    {({ field, form }: any) => (
                                      <FormControl
                                        w={"fit-content"}
                                        minW={"240px"}
                                      >
                                        <FormLabel>Organization Role</FormLabel>
                                        <Select
                                          {...field}
                                          name="role"
                                          options={
                                            focusedMember.role < 3
                                              ? focusedMember.type === "roblox"
                                                ? [
                                                    {
                                                      label: "Guest",
                                                      value: 1,
                                                    },
                                                  ]
                                                : [
                                                    {
                                                      label: "Member",
                                                      value: 1,
                                                    },
                                                    {
                                                      label: "Manager",
                                                      value: 2,
                                                    },
                                                  ]
                                              : [
                                                  {
                                                    label: "Owner",
                                                    value: 3,
                                                  },
                                                ]
                                          }
                                          placeholder="Select a role..."
                                          onChange={(value) => {
                                            form.setFieldValue(
                                              "role",
                                              value || ("" as string)
                                            );
                                          }}
                                          value={field?.value}
                                          isDisabled={
                                            focusedMember.type === "roblox" ||
                                            focusedMember.role === 3
                                          }
                                        />
                                        {/* <MultiSelect
                                            {...field}
                                            label="Organization Role"
                                            options={
                                              focusedMember.role < 3
                                                ? [
                                                    {
                                                      label: "Member",
                                                      value: "1",
                                                    },
                                                    {
                                                      label: "Manager",
                                                      value: "2",
                                                    },
                                                  ]
                                                : [
                                                    {
                                                      label: "Owner",
                                                      value: "3",
                                                    },
                                                  ]
                                            }
                                            onChange={(value) => {
                                              form.setFieldValue(
                                                "role",
                                                value || ("" as string)
                                              );
                                            }}
                                            value={form.values?.role}
                                            placeholder="Select a role..."
                                            single={true}
                                            disabled={clientMember?.role >= 3}
                                          /> */}
                                      </FormControl>
                                    )}
                                  </Field>
                                  <Field name="accessGroups">
                                    {({ field, form }: any) => (
                                      <FormControl>
                                        <FormLabel>Access Groups</FormLabel>
                                        <Select
                                          {...field}
                                          name="accessGroups"
                                          options={Object.values(
                                            organization?.accessGroups as AccessGroup[]
                                          ).map((ag: AccessGroup) => ({
                                            label: ag.name,
                                            value: ag.id,
                                          }))}
                                          placeholder="Select an access group..."
                                          onChange={(value) => {
                                            console.log(value);
                                            form.setFieldValue(
                                              "accessGroups",
                                              value || ("" as string)
                                            );
                                          }}
                                          value={field?.value}
                                          isMulti
                                          closeMenuOnSelect={false}
                                        />
                                        {/* <MultiSelect
                                          {...field}
                                          label="Access Groups"
                                          options={agKV(organization)}
                                          onChange={(value) => {
                                            form.setFieldValue(
                                              "accessGroups",
                                              value
                                            );
                                          }}
                                          value={form.values?.accessGroups}
                                          placeholder="Select an access group..."
                                          single={false}
                                          autoComplete={"off"}
                                          autoCorrect={"off"}
                                        /> */}
                                      </FormControl>
                                    )}
                                  </Field>
                                  <Field name="scanData">
                                    {({ field, form }: any) => (
                                      <FormControl w={"full"}>
                                        <FormLabel>Scan Data</FormLabel>
                                        <InputGroup>
                                          <Box
                                            border={"1px solid"}
                                            borderColor={themeBorderColor}
                                            borderRadius={"lg"}
                                            w={"full"}
                                            overflow={"hidden"}
                                          >
                                            <ChakraEditor
                                              {...field}
                                              height="240px"
                                              width="100%"
                                              p={4}
                                              language="json"
                                              theme={useColorModeValue(
                                                "vs-light",
                                                "vs-dark"
                                              )}
                                              options={{
                                                minimap: {
                                                  enabled: true,
                                                },
                                              }}
                                              value={form.values?.scanData}
                                              onChange={(value) => {
                                                form.setFieldValue(
                                                  "scanData",
                                                  value
                                                );
                                              }}
                                            />
                                          </Box>
                                        </InputGroup>
                                        <FormHelperText>
                                          This is the data that will be returned
                                          when this member scans their card.
                                          (User scan data takes priority over
                                          access group scan data when it is
                                          merged.)
                                        </FormHelperText>
                                      </FormControl>
                                    )}
                                  </Field>
                                </Stack>
                              </Flex>

                              <Portal containerRef={editButtonsRef}>
                                <Stack direction={"row"} spacing={4}>
                                  <Button
                                    isLoading={props.isSubmitting}
                                    leftIcon={<IoSave />}
                                    type={"submit"}
                                    onClick={() => {
                                      props.handleSubmit();
                                    }}
                                    onSubmit={() => {
                                      props.handleSubmit();
                                    }}
                                  >
                                    Save Changes
                                  </Button>
                                  <Button
                                    colorScheme="red"
                                    leftIcon={<IoIosRemoveCircle />}
                                    onClick={() => {
                                      setFocusedMember(focusedMember);
                                      deleteUserDialogOnOpen();
                                    }}
                                    isDisabled={
                                      clientMember?.id === focusedMember?.id ||
                                      focusedMember?.role >= 3 ||
                                      focusedMember?.role >= clientMember?.role
                                    }
                                  >
                                    Remove
                                  </Button>
                                </Stack>
                              </Portal>
                            </Form>
                          )}
                        </Formik>
                      </Flex>
                    )}
                  </Flex>
                </Skeleton>
              </Flex>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Stack
              direction={{ base: "column", md: "row" }}
              pt={{ base: 2, md: 0 }}
              spacing={4}
            >
              <Box ref={editButtonsRef} />
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
