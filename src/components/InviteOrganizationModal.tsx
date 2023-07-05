/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  VStack,
  useClipboard,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";

import { useAuthContext } from "@/contexts/AuthContext";
import NextLink from "next/link";
import { useRef, useState } from "react";

export default function InviteOrganizationModal({
  isOpen,
  onOpen,
  onClose,
  onCreate,
  organizationId,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreate: (location: any) => void;
  organizationId: string;
}) {
  const toast = useToast();
  const { idToken } = useAuthContext();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const {
    setValue: setClipboardValue,
    onCopy: onClipboardCopy,
    hasCopied: clipboardHasCopied,
  } = useClipboard("");

  const onModalClose = () => {
    onClose();
    setInviteCode(null);
  };

  const copyInviteLink = () => {
    onClipboardCopy();
    toast({
      title: "Copied invite link to clipboard!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <>
      <Formik
        initialValues={{ role: "1", singleUse: true }}
        onSubmit={(values, actions) => {
          fetch(`/api/v1/organizations/${organizationId}/createInviteCode`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              singleUse: values.singleUse,
              role: parseInt(values.role),
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
              setInviteCode(data.inviteCode);
              setClipboardValue(
                `${process.env.NEXT_PUBLIC_ROOT_URL}/join/${data.inviteCode}`
              );
              actions.resetForm();
              onCreate(data.inviteCode);
              // onClose();
            })
            .catch((error) => {
              toast({
                title: "There was an error creating the invitation.",
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
          <Modal isOpen={isOpen} onClose={onModalClose}>
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader pb={2}>Create Invitation Link</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    {!inviteCode ? (
                      <>
                        <Field name="role">
                          {({ field, form }: any) => (
                            <FormControl>
                              <FormLabel>Role</FormLabel>
                              <Select {...field} variant={"filled"}>
                                <option value={"2"}>Admin</option>
                                <option value={"1"}>Member</option>
                              </Select>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="singleUse" type={"checkbox"}>
                          {({ field, form }: any) => (
                            <FormControl>
                              <Checkbox {...field} variant={"filled"} isChecked={field.value}>
                                Single Use
                              </Checkbox>
                            </FormControl>
                          )}
                        </Field>
                      </>
                    ) : (
                      <>
                        <FormControl>
                          <FormLabel>Invitation Link</FormLabel>
                          <Input
                            variant={"filled"}
                            value={`${process.env.NEXT_PUBLIC_ROOT_URL}/join/${inviteCode}`}
                            isReadOnly={true}
                            onFocus={(e) => e.target.select()}
                          />
                        </FormControl>
                        <Text>
                          Share this link with the person you want to invite to
                          your organization.
                        </Text>
                      </>
                    )}
                    {/* <Field name="organization">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Organization</FormLabel>
                          <Input
                            {...field}
                            variant={"filled"}
                            value={selectedOrganization.name}
                            isDisabled={true}
                          />
                        </FormControl>
                      )}
                    </Field> */}
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  {!inviteCode ? (
                    <HStack>
                      <Button
                        colorScheme={"blue"}
                        isLoading={props.isSubmitting}
                        type={"submit"}
                      >
                        Create Link
                      </Button>
                      <Button onClick={onModalClose}>Cancel</Button>
                    </HStack>
                  ) : (
                    <HStack>
                      <Button colorScheme={"blue"} onClick={copyInviteLink}>
                        {!clipboardHasCopied ? "Copy Link" : "Copied!"}
                      </Button>
                      <Button onClick={onModalClose}>Close</Button>
                    </HStack>
                  )}
                </ModalFooter>
              </ModalContent>
            </Form>
          </Modal>
        )}
      </Formik>
    </>
  );
}
