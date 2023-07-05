/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
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
import NextLink from "next/link";
import { useRef } from "react";

export default function CreateOrganizationDialog({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (location: any) => void;
}) {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { idToken } = useAuthContext();

  return (
    <>
      <Formik
        initialValues={{ name: "" }}
        onSubmit={(values, actions) => {
          fetch("/api/v1/organizations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              name: values.name,
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
              onCreate(data.organizationId);
            })
            .catch((error) => {
              toast({
                title: "There was an error creating the organization.",
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
                <ModalHeader>Create Organization</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    <Field name="name">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            variant={"filled"}
                            placeholder={"Organization Name"}
                          />
                        </FormControl>
                      )}
                    </Field>
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
                  <Text fontSize={"sm"} pt={4}>
                    By creating an organization, you agree to our{" "}
                    <Text as={"span"}>
                      <Link
                        as={NextLink}
                        href={"/terms"}
                        textDecor={"underline"}
                        textUnderlineOffset={4}
                        whiteSpace={"nowrap"}
                      >
                        Terms of Service
                      </Link>
                    </Text>{" "}
                    and{" "}
                    <Text as={"span"}>
                      <Link
                        as={NextLink}
                        href={"/privacy"}
                        textDecor={"underline"}
                        textUnderlineOffset={4}
                        whiteSpace={"nowrap"}
                      >
                        Privacy Policy
                      </Link>
                    </Text>
                    .
                  </Text>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={"blue"}
                    mr={3}
                    isLoading={props.isSubmitting}
                    type={"submit"}
                  >
                    Create
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
