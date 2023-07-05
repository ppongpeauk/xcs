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
import { useRef } from "react";

export default function JoinOrganizationDialog({
  isOpen,
  onClose,
  onJoin,
}: {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (organization: any) => void;
}) {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { idToken } = useAuthContext();

  return (
    <>
      <Formik
        initialValues={{ inviteCode: "" }}
        onSubmit={(values, actions) => {
          fetch("/api/v1/organizations/join", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              inviteCode: values.inviteCode,
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
              onJoin(data.organizationId);
            })
            .catch((error) => {
              toast({
                title: "There was an error joining the organization.",
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader>Join Organization</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    <Field name="inviteCode">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Invite Code</FormLabel>
                          <Input
                            {...field}
                            variant={"filled"}
                            placeholder={"Invite Code"}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                  <Text mt={2} fontSize={"sm"} color={"gray.500"}>
                    Have an invite code? Enter it here to join an organization.
                  </Text>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={"blue"}
                    mr={3}
                    isLoading={props.isSubmitting}
                    type={"submit"}
                  >
                    Join
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
