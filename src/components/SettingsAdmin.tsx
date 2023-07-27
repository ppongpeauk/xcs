import InvitePlatformModal from "@/components/InvitePlatformModal";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Portal,
  Skeleton,
  SkeletonCircle,
  Stack,
  Switch,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { IoSave } from "react-icons/io5";

export default function SettingsProfile() {
  const { currentUser, refreshCurrentUser, user, isAuthLoaded } =
    useAuthContext();
  const toast = useToast();
  const { push } = useRouter();

  useEffect(() => {
    if (!currentUser) return;
    if (!currentUser?.platform?.staff) {
      toast({
        title: "You are not authorized to view this page.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      push("/platform/settings/1");
      return;
    }
  }, [currentUser, push, toast]);

  const {
    isOpen: platformInviteModalOpen,
    onOpen: platformInviteModalOnOpen,
    onClose: platformInviteModalOnClose,
  } = useDisclosure();

  return (
    <>
      <InvitePlatformModal
        isOpen={platformInviteModalOpen}
        onOpen={platformInviteModalOnOpen}
        onClose={platformInviteModalOnClose}
        onCreate={() => {}}
      />
      {isAuthLoaded && currentUser && (
        <Box w={"fit-content"}>
          <Heading as={"h2"} size={"lg"}>
            Platform
          </Heading>
          <Flex py={4}>
            <Button mb={2} leftIcon={<AiOutlineUser />} onClick={platformInviteModalOnOpen}>
              Create Registration Invite
            </Button>
          </Flex>

          {/* <Formik
            initialValues={{
              displayName: currentUser?.displayName,
              username: currentUser?.username,
              bio: currentUser?.bio,
            }}
            onSubmit={(values, actions) => {
              user.getIdToken().then((token: string) => {
                fetch("/api/v1/me", {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    displayName: values.displayName,
                    bio: values.bio,
                  }),
                })
                  .then((res) => {
                    if (res.status === 200) {
                      return res.json();
                    } else {
                      return res.json().then((json: any) => {
                        throw new Error(json.message);
                      });
                    }
                  })
                  .then((data) => {
                    toast({
                      title: data.message,
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                    refreshCurrentUser();
                  })
                  .catch((err) => {
                    toast({
                      title: "There was a problem while updating your profile.",
                      description: err.message,
                      status: "error",
                      duration: 3000,
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
                <HStack>
                  <Field name="displayName">
                    {({ field, form }: any) => (
                      <FormControl w={"fit-content"}>
                        <FormLabel>Display Name</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Display Name"
                            variant={"outline"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="username">
                    {({ field, form }: any) => (
                      <FormControl w={"fit-content"}>
                        <FormLabel>Username</FormLabel>
                        <InputGroup mb={2}>
                          <Input
                            {...field}
                            isDisabled={true}
                            type="text"
                            autoComplete="off"
                            placeholder="Username"
                            variant={"outline"}
                          />
                        </InputGroup>
                      </FormControl>
                    )}
                  </Field>
                </HStack>
                <Field name="bio">
                  {({ field, form }: any) => (
                    <FormControl>
                      <FormLabel>Bio</FormLabel>
                      <InputGroup mb={2}>
                        <Textarea
                          {...field}
                          type="text"
                          autoComplete="off"
                          placeholder="Bio"
                          variant={"outline"}
                        />
                      </InputGroup>
                    </FormControl>
                  )}
                </Field>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  spacing={{ base: 2, md: 4 }}
                  pt={2}
                >
                  <Button
                    mb={2}
                    isLoading={props.isSubmitting}
                    leftIcon={<IoSave />}
                    type={"submit"}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik> */}
        </Box>
      )}
    </>
  );
}
