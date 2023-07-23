/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
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
  Text,
  Textarea,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";

import { Field, Form, Formik } from "formik";

import { useAuthContext } from "@/contexts/AuthContext";
import { MultiSelect, Select } from "chakra-multiselect";
import { useEffect, useRef, useState } from "react";

import { AiFillCheckCircle } from "react-icons/ai";

export default function InviteOrganizationRobloxGroupModal({
  isOpen,
  onClose,
  onAdd,
  organization,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  organization: any;
}) {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { user } = useAuthContext();

  const [groupRoles, setGroupRoles] = useState<any>([]);
  const [groupSearchResults, setGroupSearchResults] = useState<any>([]);
  const [lastGroupId, setLastGroupId] = useState<any>("");
  const groupIdRef = useRef<any>(null);
  const groupRolesRef = useRef<any>(null);
  const groupNameRef = useRef<any>(null);
  const formRef = useRef<any>(null);

  const refreshRobloxGroupSearch = (value: string) => {
    console.log(value);
    user.getIdToken().then((token: any) => {
      fetch(
        `/api/v1/roblox/group-search/${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
          console.log(data);
          setGroupSearchResults(data);
        })
        .catch((error) => {
          toast({
            title: "There was an error fetching Roblox group search results.",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };

  useEffect(() => {
    console.log(groupNameRef.current?.value);
  }, [groupNameRef.current?.value]);

  const refreshRobloxGroupRoles = () => {
    if (!groupIdRef.current.value.trim()) {
      toast({
        title: "There was an error fetching Roblox group roles.",
        description: "Enter a group ID before proceeding.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setGroupRoles([]);
    user.getIdToken().then((token: any) => {
      fetch(`/api/v1/roblox/group-roles/${groupIdRef.current.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
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
          setGroupRoles(data);
          if (lastGroupId !== groupIdRef.current.value) {
            formRef.current.setFieldValue("robloxGroupRoles", []);
          }
          toast({
            title: "Successfully fetched group roles.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setLastGroupId(groupIdRef.current.value);
        })
        .catch((error) => {
          toast({
            title: "There was an error fetching Roblox group roles.",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    });
  };

  return (
    <>
      <Formik
        innerRef={formRef}
        enableReinitialize={true}
        initialValues={{ name: "", robloxGroupId: "", robloxGroupRoles: "", accessGroups: [] }}
        onSubmit={(values, actions) => {
          user.getIdToken().then((token: any) => {
            fetch(`/api/v1/organizations/${organization.id}/members`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                type: "roblox-group",
                name: values.name,
                robloxGroupId: values.robloxGroupId,
                robloxGroupRoles: values.robloxGroupRoles,
                // get access group ids from names
                accessGroups: values?.accessGroups.map((accessGroup: any) => {
                  return Object.keys(organization?.accessGroups || {}).find(
                    (accessGroupId: any) =>
                      organization?.accessGroups[accessGroupId].name ===
                      accessGroup
                  );
                }),
              }),
            })
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
                onClose();
                onAdd();
              })
              .catch((error) => {
                toast({
                  title:
                    "There was an error adding a Roblox user to your organization.",
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
        {(props) => 
          <Modal isOpen={isOpen} onClose={onClose} isCentered allowPinchZoom>
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader pb={2}>Add Roblox Group</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    <Field name="name">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            ref={groupIdRef}
                            type={"username"}
                            variant={"outline"}
                            placeholder={"Name"}
                            autoComplete={"off"}
                            autoCorrect={"off"}
                            spellCheck={"false"}
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="robloxGroupId">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Group ID</FormLabel>
                          <HStack justify={"space-between"}>
                            <Input
                              {...field}
                              ref={groupIdRef}
                              type={"text"}
                              variant={"outline"}
                              placeholder={"Roblox Group ID"}
                              autoComplete={"off"}
                              autoCorrect={"off"}
                              spellCheck={"false"}
                            />
                            <IconButton
                              aria-label={"Confirm"}
                              as={"button"}
                              icon={<AiFillCheckCircle />}
                              onClick={refreshRobloxGroupRoles}
                            />
                          </HStack>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="robloxGroupRoles">
                      {({ field, form }: any) => (
                        <FormControl>
                          {/* <Menu closeOnSelect={false}>
                            <MenuButton as={Button} colorScheme="blue">
                              MenuItem
                            </MenuButton>
                            <MenuList as={"ul"} minWidth="240px" maxH={"240px"} overflow={"auto"}>
                              <MenuOptionGroup title="Country" type="checkbox">
                                {groupRoles.map((val: any) => (
                                  <MenuItemOption key={val.id} value={val.id} as={"li"}>
                                    {val.name}
                                  </MenuItemOption>
                                ))}
                              </MenuOptionGroup>
                            </MenuList>
                          </Menu> */}
                          <MultiSelect
                            {...field}
                            overflowY={"scroll"}
                            label="Group Roles"
                            options={groupRoles.map((val: any) => ({
                              value: val.name,
                              label: val.name,
                            }))}
                            onChange={(value) => {
                              form.setFieldValue("robloxGroupRoles", value);
                            }}
                            value={form.values.robloxGroupRoles || []}
                            placeholder="Select Roblox group roles..."
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="accessGroups">
                      {({ field, form }: any) => (
                        <FormControl>
                          <MultiSelect
                            {...field}
                            label="Access Groups"
                            options={Object.keys(organization.accessGroups).map(
                              (key) => ({
                                value: organization.accessGroups[key].name,
                                label: organization.accessGroups[key].name,
                              })
                            )}
                            onChange={(value) => {
                              form.setFieldValue("accessGroups", value);
                            }}
                            value={form.values.accessGroups || []}
                            placeholder="Select an access group..."
                            single={false}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={"blue"}
                    mr={3}
                    isLoading={props.isSubmitting}
                    type={"submit"}
                  >
                    Add Roblox Group
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          </Modal>
        }
      </Formik>
    </>
  );
}
