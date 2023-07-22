/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Button,
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
  Select,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Stack,
  chakra,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import Editor from "@monaco-editor/react";

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
import { AiFillEdit } from "react-icons/ai";
import { IoIosCreate, IoIosRemoveCircle } from "react-icons/io";
import { IoSave } from "react-icons/io5";
import { MdEditSquare } from "react-icons/md";
import { RiMailAddFill } from "react-icons/ri";
import { SiRoblox } from "react-icons/si";
import CreateAccessGroupDialog from "./CreateAccessGroupDialog";

const ChakraEditor = chakra(Editor);

export default function RoleEditModal({
  isOpen,
  onOpen,
  onClose,
  onRefresh,
  clientMember,
  groups,
  organization,
  onGroupRemove,
}: any) {
  const { user } = useAuthContext();
  const toast = useToast();
  const [focusedGroup, setFocusedGroup] = useState<any>(null);
  const themeBorderColor = useColorModeValue("gray.200", "gray.700");

  const groupSearchRef = useRef<any>(null);
  const [filteredGroups, setFilteredGroups] = useState<any>([]);

  const {
    isOpen: deleteGroupDialogOpen,
    onOpen: deleteGroupDialogOnOpen,
    onClose: deleteGroupDialogOnClose,
  } = useDisclosure();

  const {
    isOpen: createModalOpen,
    onOpen: createModalOnOpen,
    onClose: createModalOnClose,
  } = useDisclosure();

  const filterGroups = (query: string) => {
    if (!query) return groups;
    return Object.keys(groups)
      .filter((group: any) =>
        groups[group].name.toLowerCase().includes(query.toLowerCase())
      )
      .map((group: any) => groups[group]);
  };

  useEffect(() => {
    setFilteredGroups(groups || {});
  }, [groups]);

  useEffect(() => {
    if (!organization) return;
    setFilteredGroups(filterGroups(groupSearchRef?.current?.value));
    setFocusedGroup(groups[focusedGroup?.id]);
    console.log(focusedGroup);
  }, [organization]);

  return (
    <>
      <DeleteDialog
        isOpen={deleteGroupDialogOpen}
        onClose={deleteGroupDialogOnClose}
        title="Delete Access Group"
        body={`Are you sure you want to delete the ${focusedGroup?.name} access group from this organization? All members and access points that have this access group will be updated.`}
        buttonText="Delete"
        onDelete={() => {
          deleteGroupDialogOnClose();
          onGroupRemove(focusedGroup);
          setFocusedGroup(null);
        }}
      />
      <CreateAccessGroupDialog
        isOpen={createModalOpen}
        onClose={createModalOnClose}
        organization={organization}
        onCreate={(group: any) => {
          onRefresh();
          createModalOnClose();
        }}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          maxW={{ base: "full", md: "75vw" }}
          bg={useColorModeValue("white", "gray.800")}
        >
          <ModalHeader>Manage Access Groups</ModalHeader>
          <ModalCloseButton />
          <ModalBody w={"full"}>
            <Stack mb={2} direction={{ base: "column", md: "row" }}>
              <FormControl w={{ base: "full", md: "300px" }}>
                <FormLabel>Search Access Group</FormLabel>
                <Input
                  placeholder={"Search for an access group..."}
                  ref={groupSearchRef}
                  onChange={(e) => {
                    if (e.target?.value) {
                      setFilteredGroups(filterGroups(e.target?.value));
                    } else {
                      setFilteredGroups(groups);
                    }
                  }}
                />
              </FormControl>
              <Spacer />
              <Button
                alignSelf={{ base: "normal", md: "flex-end" }}
                onClick={createModalOnOpen}
                leftIcon={<IoIosCreate />}
              >
                Create Access Group
              </Button>
            </Stack>
            <Flex
              w={"full"}
              justify={"space-between"}
              flexDir={{ base: "column", xl: "row" }}
            >
              <TableContainer
                py={2}
                h={{ base: "320px", xl: "100%" }}
                overflowY={"scroll"}
                flexGrow={1}
                px={4}
              >
                <Table size={{ base: "sm", md: "md" }}>
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th isNumeric>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {organization ? (
                      Object.keys(filteredGroups).map((group: any) => (
                        <Tr key={group}>
                          <Td>
                            <Text fontWeight="bold">
                              {filteredGroups[group].name}
                            </Text>
                          </Td>
                          <Td isNumeric>
                            <Button
                              size="sm"
                              leftIcon={<MdEditSquare />}
                              onClick={() => {
                                setFocusedGroup(filteredGroups[group]);
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton
                              aria-label="Delete Access Group"
                              size="sm"
                              colorScheme="red"
                              ml={2}
                              icon={<IoIosRemoveCircle />}
                              onClick={() => {
                                setFocusedGroup(filteredGroups[group]);
                                deleteGroupDialogOnOpen();
                              }}
                            />
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <>
                        {Array.from(Array(8).keys()).map((i) => (
                          <Tr key={i}>
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
                  {filteredGroups?.length < 1 && (
                    <TableCaption>No access groups found.</TableCaption>
                  )}
                </Table>
              </TableContainer>
              {/* Edit Group */}
              <Skeleton
                isLoaded={organization}
                rounded={"lg"}
                minW={{ base: "unset", sm: "unset", lg: "512px" }}
                flexBasis={1}
              >
                <Flex
                  mt={2}
                  p={6}
                  rounded={"lg"}
                  border={"1px solid"}
                  borderColor={themeBorderColor}
                  minH={{ base: "unset", xl: "512px" }}
                  h={"full"}
                >
                  {!focusedGroup || !organization ? (
                    <Text m={"auto"} color={"gray.500"}>
                      Select an access group to manage.
                    </Text>
                  ) : (
                    <Flex flexDir={"column"} w={"full"}>
                      {/* Header */}
                      <Flex align={"center"} h={"fit-content"}>
                        <Flex flexDir={"column"}>
                          <Flex align={"center"}>
                            <Text as={"h2"} fontSize={"xl"} fontWeight={"bold"}>
                              {focusedGroup?.name}
                            </Text>
                          </Flex>
                        </Flex>
                      </Flex>
                      {/* Body */}
                      <Formik
                        enableReinitialize={true}
                        initialValues={{
                          name: focusedGroup?.name,
                          scanData: JSON.stringify(
                            focusedGroup?.scanData,
                            null,
                            2
                          ),
                        }}
                        onSubmit={(values, actions) => {
                          // alert(JSON.stringify(values, null, 2));
                          try {
                            JSON.parse(values?.scanData || "{}");
                          } catch (error: any) {
                            toast({
                              title:
                                "There was an error parsing the scan data.",
                              description: error.message as string,
                              status: "error",
                              duration: 5000,
                              isClosable: true,
                            });
                            actions.setSubmitting(false);
                            return;
                          }
                          user.getIdToken().then((token: string) => {
                            fetch(
                              `/api/v1/organizations/${organization?.id}/access-groups/${focusedGroup?.id}`,
                              {
                                method: "PATCH",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  name: values?.name,
                                  scanData: JSON.parse(
                                    values?.scanData || "{}"
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
                          <Form
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              width: "100%",
                              height: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Flex flexDir={"column"} mt={4} w={"full"}>
                              <Stack>
                                {/* {focusedGroup?.type !== "roblox" && (
                                  <Field name="role">
                                    {({ field, form }: any) => (
                                      <FormControl w={"fit-content"}>
                                        <MultiSelect
                                          {...field}
                                          label="Organization Role"
                                          options={
                                            focusedGroup.role < 3
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
                                            groups || {}
                                          ).map((accessGroup: any) => {
                                            const name =
                                              groups[
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
                                        autoComplete={"off"}
                                        autoCorrect={"off"}
                                      />
                                    </FormControl>
                                  )}
                                </Field> */}
                                <Field name="name">
                                  {({ field, form }: any) => (
                                    <FormControl w={"fit-content"}>
                                      <FormLabel>Name</FormLabel>
                                      <Input
                                        {...field}
                                        type={"text"}
                                        variant={"outline"}
                                        placeholder={"Access Group Name"}
                                        autoComplete={"off"}
                                        autoCorrect={"off"}
                                      />
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
                                            value={
                                              form.values?.scanData || "{}"
                                            }
                                            onChange={(value) => {
                                              form.setFieldValue(
                                                "scanData",
                                                value || ("" as string)
                                              );
                                            }}
                                          />
                                        </Box>
                                      </InputGroup>
                                      <FormHelperText>
                                        This is the data that will be returned
                                        when this member scans their card. (User
                                        scan data takes priority over access
                                        group scan data when it is merged.)
                                      </FormHelperText>
                                    </FormControl>
                                  )}
                                </Field>
                              </Stack>
                            </Flex>
                            <Flex
                              align={"flex-end"}
                              justify={"flex-end"}
                              pt={4}
                            >
                              <Button
                                isLoading={props.isSubmitting}
                                leftIcon={<IoSave />}
                                type={"submit"}
                              >
                                Save Changes
                              </Button>
                              <Button
                                colorScheme="red"
                                ml={2}
                                leftIcon={<IoIosRemoveCircle />}
                                onClick={() => {
                                  setFocusedGroup(focusedGroup);
                                  deleteGroupDialogOnOpen();
                                }}
                              >
                                Delete
                              </Button>
                            </Flex>
                          </Form>
                        )}
                      </Formik>
                    </Flex>
                  )}
                </Flex>
              </Skeleton>
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
