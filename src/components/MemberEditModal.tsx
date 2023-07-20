import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";

import { useAuthContext } from "@/contexts/AuthContext";
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
import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import DeleteDialog from "./DeleteDialog";

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
  const [filteredMembers, setFilteredMembers] = useState<any>();

  const {
    isOpen: isDeleteUserDialogOpen,
    onOpen: onDeleteUserDialogOpen,
    onClose: onDeleteUserDialogClose,
  } = useDisclosure();

  const roleToText = (role: number) => {
    switch (role) {
      case 1:
        return "Member";
      case 2:
        return "Manager";
      case 3:
        return "Owner";
      default:
        return "Member";
    }
  };

  const filterMembers = (query: string) => {
    if (!query) return members;
    return members.filter(
      (member: any) =>
        member.displayName.toLowerCase().includes(query.toLowerCase()) ||
        member.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  return (
    <>
      <DeleteDialog
        isOpen={isDeleteUserDialogOpen}
        onClose={onDeleteUserDialogClose}
        title="Remove Member"
        body={`Are you sure you want to remove ${focusedMember?.displayName} from this organization?`}
        buttonText="Remove"
        onDelete={() => {
          onDeleteUserDialogClose();
          onMemberRemove(focusedMember);
          setFocusedMember(null);
        }}
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
            <FormControl w={"fit-content"}>
              <FormLabel>Search Member</FormLabel>
              <Input
                placeholder={"Search for a member..."}
                ref={memberSearchRef}
                onChange={(e) => {
                  if (e.target.value) {
                    setFilteredMembers(filterMembers(e.target.value));
                  } else {
                    setFilteredMembers(members);
                  }
                }}
              />
            </FormControl>

            <TableContainer py={4}>
              <Table size="md">
                <Thead>
                  <Tr>
                    <Th>Member</Th>
                    <Th>Role</Th>
                    <Th isNumeric>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredMembers?.map((member: any) => (
                    <Tr key={member?.id}>
                      <Td>
                        <Flex align={"center"}>
                          <Avatar size="md" src={member?.avatar} mr={4} />
                          <Flex flexDir={"column"}>
                            <Text fontWeight="bold">{member?.displayName}</Text>
                            <Text fontSize="sm" color="gray.500">
                              @{member?.username}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              Joined{" "}
                              {moment(member?.joinedAt).format("MMMM Do YYYY")}
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
                          Edit
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
                                onDeleteUserDialogOpen();
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
              mt={4}
              p={4}
              rounded={"lg"}
              w={"full"}
              minH={"256px"}
              border={"1px solid"}
              borderColor={useColorModeValue("gray.200", "gray.700")}
            >
              {!focusedMember ? (
                <Text fontWeight={"bold"} m={"auto"}>
                  Select a member to manage.
                </Text>
              ) : (
                <Flex flexDir={"column"} w={"full"}>
                  {/* Header */}
                  <Flex align={"center"} h={"fit-content"}>
                    <Avatar size="md" src={focusedMember?.avatar} mr={4} />
                    <Flex flexDir={"column"}>
                      <Text as={"h2"} fontSize={"xl"} fontWeight={"500"}>
                        {focusedMember?.displayName}
                      </Text>
                      <Text fontSize={"sm"} color={"gray.500"}>
                        {roleToText(focusedMember?.role)}
                      </Text>
                    </Flex>
                  </Flex>
                  {/* Body */}
                  <Flex>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        role: focusedMember?.role,
                      }}
                      onSubmit={(values, actions) => {
                        user.getIdToken().then((token: string) => {
                          fetch(
                            `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/organizations/${organization.id}/members/${focusedMember?.id}`,
                            {
                              method: "PATCH",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                role: values.role,
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
                        <Form>
                          <Flex flexDir={"column"} mt={4} w={"full"}>
                            <Field name="role">
                              {({ field, form }: any) => (
                                <FormControl>
                                  <FormLabel>Role</FormLabel>
                                  <Select {...field} variant={"outline"}>
                                    <option value={"1"}>Member</option>
                                    <option value={"2"}>Manager</option>
                                    <option value={"3"}>Owner</option>
                                  </Select>
                                </FormControl>
                              )}
                            </Field>
                            <Button
                              mt={4}
                              type="submit"
                              isLoading={props.isSubmitting}
                            >
                              Save Changes
                            </Button>
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
