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

export default function CreateLocationDialog({
  isOpen,
  onClose,
  selectedOrganization,
  onCreate,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedOrganization: any;
  onCreate: (location: any) => void;
}) {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { user } = useAuthContext();

  return (
    <>
      <Formik
        initialValues={{ name: "", description: "" }}
        onSubmit={(values, actions) => {
          user.getIdToken().then((token: any) => {
            fetch("/api/v1/locations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: values.name,
                description: values.description,
                organizationId: selectedOrganization.id,
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
                onCreate(data.locationId);
              })
              .catch((error) => {
                toast({
                  title: "There was an error creating the location.",
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
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue("white", "gray.800")}>
                <ModalHeader pb={2}>Create Location</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    <Field name="name">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            variant={"outline"}
                            placeholder={"Location Name"}
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
                            variant={"outline"}
                            value={selectedOrganization.name}
                            isDisabled={true}
                          />
                        </FormControl>
                      )}
                    </Field> */}
                    <Field name="description">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            {...field}
                            variant={"outline"}
                            placeholder={"Location Description"}
                            maxH={"200px"}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                  <Text fontSize={"sm"} pt={2}>
                    This location will be created under the{" "}
                    <Text as={"span"} fontWeight={"bold"}>
                      {selectedOrganization?.name}
                    </Text>{" "}
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
