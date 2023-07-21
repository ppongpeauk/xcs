/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
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
  Text,
  Textarea,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

import { useAuthContext } from "@/contexts/AuthContext";
import { MultiSelect } from "chakra-multiselect";
import { useRef } from "react";

export default function InviteOrganizationRobloxModal({
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ username: "", accessGroups: [] }}
        onSubmit={(values, actions) => {
          user.getIdToken().then((token: any) => {
            fetch(`/api/v1/organizations/${organization.id}/members`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                type: "roblox",
                username: values.username,
                accessGroups: values.accessGroups,
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
                  duration: 9000,
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
          <Modal isOpen={isOpen} onClose={onClose} isCentered allowPinchZoom>
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader pb={2}>Add Roblox Member</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    <Field name="username">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Username</FormLabel>
                          <Input
                            {...field}
                            type={"username"}
                            variant={"outline"}
                            placeholder={"Roblox Username"}
                            autoComplete={"off"}
                            autoCorrect={"off"}
                            spellCheck={"false"}
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
                                value: key,
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
                  <Text fontSize={"sm"} pt={2}>
                    Add a Roblox user that isn&apos;t registered on XCS to your
                    organization.
                  </Text>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={"blue"}
                    mr={3}
                    isLoading={props.isSubmitting}
                    type={"submit"}
                  >
                    Add Roblox User
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
