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
  Stack,
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
import { AccessGroup, Organization } from "@/types";
import { AsyncSelect, CreatableSelect, Select } from "chakra-react-select";
import { useCallback, useEffect, useRef, useState } from "react";

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

  const getGroupSearchResults = (value: string, callback: any) => {
    user.getIdToken().then((token: any) => {
      fetch(`/api/v1/roblox/group-search/${value}`, {
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
          let options = [] as any;
          data.forEach((group: any) => {
            options.push({
              label: group.name,
              value: group.id,
            });
          });
          callback(options);
        })
        .catch((error) => {
          toast({
            title: "There was an error fetching Roblox group search results.",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          callback([]);
        });
    });
  };

  const fetchGroupRoles = (groupId: any) => {
    groupId = groupId?.value;
    setGroupRoles([]);
    if (!groupId) return;
    user.getIdToken().then((token: any) => {
      fetch(`/api/v1/roblox/group-roles/${groupId}`, {
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
          setGroupRoles(
            data.map((role: any) => {
              return {
                label: role.name,
                value: role.id,
              };
            })
          );
          if (lastGroupId !== groupId) {
            formRef.current.setFieldValue("robloxGroupRoles", []);
          }
          toast({
            title: "Successfully fetched group roles.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setLastGroupId(groupId);
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

  const getAccessGroupType = (ag: AccessGroup) => {
    if (ag.type === "organization") {
      return "Organization";
    } else if (ag.type === "location") {
      // TODO: get location name
      return ag.locationName || ag.locationId || "Unknown";
    } else {
      return ag.type;
    }
  };

  const getAccessGroupOptions = useCallback(
    (organization: Organization) => {
      if (!organization) return [];
      const ags =
        Object.values(organization?.accessGroups as AccessGroup[]) || [];
      interface Group {
        label: string;
        options: {
          label: string;
          value: string;
        }[];
      }
      let groups = [] as any;

      ags.forEach((ag: AccessGroup) => {
        // check if the group is already in the groups object
        if (groups.find((g: Group) => g.label === getAccessGroupType(ag))) {
          // if it is, add the option to the options array
          groups
            .find((g: Group) => g.label === getAccessGroupType(ag))
            .options.push({
              label: ag.name,
              value: ag.id,
            });
        } else {
          // if it's not, add the group to the groups array
          groups.push({
            label: getAccessGroupType(ag),
            options: [
              {
                label: ag.name,
                value: ag.id,
              },
            ],
          });
        }
      });

      // sort the groups so organizations are at the bottom
      groups.sort((a: Group, b: Group) => {
        if (a.label === "Organization") return 1;
        if (b.label === "Organization") return -1;
        return 0;
      });

      return groups;
    },
    [organization]
  );

  return (
    <>
      <Formik
        innerRef={formRef}
        enableReinitialize={true}
        initialValues={{
          name: "",
          robloxGroupId: "" as any,
          robloxGroupRoles: [],
          accessGroups: [],
        }}
        onSubmit={(values, actions) => {
          console.log(values);
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
                robloxGroupId: values.robloxGroupId?.value,
                robloxGroupRoles: values.robloxGroupRoles?.map(
                  (role: any) => role.value
                ),
                // get access group ids from names
                accessGroups: values?.accessGroups.map(
                  (accessGroup: any) => accessGroup.value
                ),
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
                actions.resetForm();
              })
              .catch((error) => {
                toast({
                  title:
                    "There was an error adding a Roblox group to your organization.",
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
          <Modal isOpen={isOpen} onClose={onClose} isCentered allowPinchZoom>
            <ModalOverlay />
            <Form>
              <ModalContent
                bg={useColorModeValue("white", "gray.800")}
                maxW={"container.md"}
              >
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
                    <Stack direction={{ base: "column", md: "row" }} w={"full"}>
                      <Field name="robloxGroupId">
                        {({ field, form }: any) => (
                          <FormControl>
                            <FormLabel>Group</FormLabel>
                            <AsyncSelect
                              {...field}
                              name="robloxGroupId"
                              ref={groupIdRef}
                              options={[]}
                              placeholder="Search for a group..."
                              isMulti={false}
                              closeMenuOnSelect={true}
                              isClearable={true}
                              size="md"
                              loadOptions={(inputValue, callback) => {
                                getGroupSearchResults(inputValue, callback);
                              }}
                              onChange={(value) => {
                                form.setFieldValue("robloxGroupId", value);
                                fetchGroupRoles(value);
                              }}
                              value={field.value || []}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="robloxGroupRoles">
                        {({ field, form }: any) => (
                          <FormControl>
                            <FormLabel>Group Roles</FormLabel>
                            <Select
                              {...field}
                              variant={"outline"}
                              options={groupRoles}
                              onChange={(value) => {
                                form.setFieldValue("robloxGroupRoles", value);
                              }}
                              value={field.value || []}
                              placeholder="Select group roles..."
                              isMulti
                              closeMenuOnSelect={false}
                              hideSelectedOptions={false}
                              selectedOptionStyle="check"
                            />
                          </FormControl>
                        )}
                      </Field>
                    </Stack>
                    <Field name="accessGroups">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Access Groups</FormLabel>
                          <Select
                            {...field}
                            variant={"outline"}
                            options={getAccessGroupOptions(organization)}
                            onChange={(value) => {
                              form.setFieldValue("accessGroups", value);
                            }}
                            value={field.value || []}
                            placeholder="Select an access group..."
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            selectedOptionStyle={"check"}
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
        )}
      </Formik>
    </>
  );
}
