import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spacer,
  Stack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import DeleteDialog from "@/components/DeleteDialog";
import InviteOrganizationModal from "@/components/InviteOrganizationModal";
import InviteOrganizationRobloxModal from "@/components/InviteOrganizationRobloxModal";
import { useAuthContext } from "@/contexts/AuthContext";
import { roleToText, textToRole } from "@/lib/utils";
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
import { MultiSelect } from "chakra-multiselect";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { IoSave } from "react-icons/io5";
import { RiMailAddFill } from "react-icons/ri";
import { SiRoblox } from "react-icons/si";

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

  const memberSearchRef = useRef<any>(null);
  const [filteredMembers, setFilteredMembers] = useState<any>(null);

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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "full", md: "900px" }}
          bg={useColorModeValue("white", "gray.800")}
        >
          <ModalHeader>Manage Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody w={"full"}>
            <Stack mb={2} direction={{ base: "column", md: "row" }}>
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
                alignSelf={{ base: "normal", md: "flex-end" }}
                onClick={inviteModalOnOpen}
                leftIcon={<RiMailAddFill />}
              >
                Invite User
              </Button>
              <Button
                alignSelf={{ base: "normal", md: "flex-end" }}
                leftIcon={<SiRoblox />}
                onClick={robloxModalOnOpen}
              >
                Add Roblox User
              </Button>
            </Stack>
            <TableContainer py={2} maxH={"352px"} overflowY={"scroll"}>
              <Table size={{ base: "sm", md: "md" }}>
                <Thead>
                  <Tr>
                    <Th>Member</Th>
                    <Th>Role</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(filteredMembers || [])
                    .sort((a: any, b: any) => (a.role > b.role ? -1 : 1)) // sort by role (descending)
                    .map((member: any) => (
                      <Tr key={member?.id}>
                        <Td>
                          <Flex align={"center"}>
                            <Avatar
                              display={{ base: "none", md: "block" }}
                              size="md"
                              src={member?.avatar}
                              mr={4}
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
                                <Flex align={"center"}>
                                  <Icon as={SiRoblox} mr={1} />
                                  <Text fontWeight="bold">
                                    {member?.displayName}
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
                            onClick={() => {
                              setFocusedMember(member);
                            }}
                          >
                            Edit Member
                          </Button>
                          {clientMember?.id !== member?.id &&
                            clientMember?.role >= 2 &&
                            member?.role !== 3 && (
                              <Button
                                size="sm"
                                colorScheme="red"
                                ml={2}
                                onClick={() => {
                                  setFocusedMember(member);
                                  deleteUserDialogOnOpen();
                                }}
                              >
                                Remove
                              </Button>
                            )}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
                {filteredMembers?.length < 1 && (
                  <TableCaption>No members found.</TableCaption>
                )}
              </Table>
            </TableContainer>
            {/* Edit Member */}
            <Flex
              mt={2}
              p={6}
              rounded={"lg"}
              w={"full"}
              border={"1px solid"}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {!focusedMember || !organization ? (
                <Text m={"auto"} color={"gray.500"}>
                  Select a member to manage.
                </Text>
              ) : (
                <Flex flexDir={"column"} w={"full"}>
                  {/* Header */}
                  <Flex align={"center"} h={"fit-content"}>
                    <Avatar size="lg" src={focusedMember?.avatar} mr={4} />
                    <Flex flexDir={"column"}>
                      <Text as={"h2"} fontSize={"xl"} fontWeight={"500"}>
                        {focusedMember?.displayName}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.500"}>
                        Joined{" "}
                        {moment(focusedMember?.joinedAt).format("MMMM Do YYYY")}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.500"}>
                        {roleToText(focusedMember?.role)}
                      </Text>
                    </Flex>
                  </Flex>
                  {/* Body */}
                  <Flex h={"full"}>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        role: roleToText(focusedMember?.role),
                        accessGroups:
                          focusedMember.accessGroups.map((accessGroup: any) => {
                            return organization.accessGroups[accessGroup].name;
                          }) || [],
                      }}
                      onSubmit={(values, actions) => {
                        // alert(JSON.stringify(values, null, 2));

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
                                role: textToRole(values?.role),

                                // get access group ids from names
                                accessGroups: values?.accessGroups.map(
                                  (accessGroup: any) => {
                                    return Object.keys(
                                      organization?.accessGroups || {}
                                    ).find(
                                      (accessGroupId: any) =>
                                        organization?.accessGroups[
                                          accessGroupId
                                        ].name === accessGroup
                                    );
                                  }
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
                                duration: 9000,
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
                                duration: 9000,
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
                        <Form style={{ width: "100%", height: "100%" }}>
                          <Flex flexDir={"column"} mt={4} w={"full"}>
                            <Stack>
                              {focusedMember?.type !== "roblox" && (
                                <Field name="role">
                                  {({ field, form }: any) => (
                                    <FormControl w={"fit-content"}>
                                      <MultiSelect
                                        {...field}
                                        label="Organization Role"
                                        options={
                                          focusedMember.role < 3
                                            ? [
                                                {
                                                  label: "Member",
                                                  value: "Member",
                                                },
                                                {
                                                  label: "Manager",
                                                  value: "Manager",
                                                },
                                              ]
                                            : [
                                                {
                                                  label: "Owner",
                                                  value: "Owner",
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
                                      />
                                    </FormControl>
                                  )}
                                </Field>
                              )}
                              <Field name="accessGroups">
                                {({ field, form }: any) => (
                                  <FormControl w={"fit-content"}>
                                    <MultiSelect
                                      {...field}
                                      label="Access Groups"
                                      options={
                                        Object.keys(
                                          organization?.accessGroups || {}
                                        ).map((accessGroup: any) => {
                                          const name =
                                            organization?.accessGroups[
                                              accessGroup
                                            ]?.name || "Option";

                                          return {
                                            label: name,
                                            value: name,
                                          };
                                        }) || [
                                          {
                                            label: "Option",
                                            value: "Option",
                                          },
                                        ]
                                      }
                                      onChange={(value) => {
                                        form.setFieldValue(
                                          "accessGroups",
                                          value as string[]
                                        );
                                      }}
                                      value={form.values?.accessGroups}
                                      placeholder="Select an access group..."
                                      single={false}
                                    />
                                  </FormControl>
                                )}
                              </Field>
                            </Stack>

                            <Flex align={"flex-end"} justify={"flex-end"}>
                              <Button
                                mt={8}
                                isLoading={props.isSubmitting}
                                leftIcon={<IoSave />}
                                type={"submit"}
                              >
                                Save Changes
                              </Button>
                            </Flex>
                          </Flex>
                        </Form>
                      )}
                    </Formik>
                  </Flex>
                </Flex>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
