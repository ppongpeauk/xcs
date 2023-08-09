/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState } from 'react';

import {
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  Textarea,
  VStack,
  useClipboard,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';

import { AsyncSelect, CreatableSelect, Select } from 'chakra-react-select';
import { Field, Form, Formik } from 'formik';
import NextLink from 'next/link';

import { textToRole } from '@/lib/utils';

import { useAuthContext } from '@/contexts/AuthContext';

export default function InvitePlatformUserModal({
  isOpen,
  onOpen,
  onClose,
  onCreate
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onCreate: (location: any) => void;
}) {
  const toast = useToast();
  const { currentUser, user } = useAuthContext();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const senderRef = useRef<any>(null);
  const { setValue: setClipboardValue, onCopy: onClipboardCopy, hasCopied: clipboardHasCopied } = useClipboard('');

  const onModalClose = () => {
    onClose();
    setInviteCode(null);
  };

  const copyInviteLink = () => {
    onClipboardCopy();
    toast({
      title: 'Copied invite link to clipboard!',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  const getUserSearchResults = async (inputValue: string, callback: any) => {
    if (!inputValue) {
      callback([]);
      return;
    }
    await user.getIdToken().then((token: any) => {
      fetch(`/api/v1/admin/search-users/${encodeURIComponent(inputValue)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
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
          callback(
            data.map((user: any) => ({
              label: `${user.displayName} (${user.username})`,
              value: user.id
            }))
          );
        })
        .catch((error) => {
          toast({
            title: 'There was an error searching for users.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          code: '',
          senderId: null as
            | {
              label: string;
              value: string;
            }
            | any,
          maxUses: 1,
          comment: ''
        }}
        onSubmit={(values, actions) => {
          user.getIdToken().then((token: any) => {
            fetch(`/api/v1/self/invite-link/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                maxUses: values.maxUses,
                code: values.code,
                senderId: values.senderId?.value,
                comment: values.comment
              })
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
                  status: 'success',
                  duration: 5000,
                  isClosable: true
                });
                setInviteCode(data.code);
                setClipboardValue(`${process.env.NEXT_PUBLIC_ROOT_URL}/invitation/${data.code}`);
                actions.resetForm();
                onCreate(data.code);
                // onClose();
              })
              .catch((error) => {
                toast({
                  title: 'There was an error creating the invitation.',
                  description: error.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true
                });
              })
              .finally(() => {
                actions.setSubmitting(false);
              });
          });
        }}
      >
        {(props) => (
          <Modal
            isOpen={isOpen}
            onClose={onModalClose}
            isCentered
          >
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue('white', 'gray.800')}>
                <ModalHeader pb={2}>Create Invitation Link</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    {!inviteCode ? (
                      <>
                      </>
                    ) : (
                      <>
                        <FormControl>
                          <FormLabel>Invitation Link</FormLabel>
                          <Input
                            variant={'outline'}
                            value={`${process.env.NEXT_PUBLIC_ROOT_URL}/invitation/${inviteCode}`}
                            isReadOnly={true}
                            onFocus={(e) => e.target.select()}
                          />
                          <FormHelperText>
                            Share this link with the people you want to invite to the platform.
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  {!inviteCode ? (
                    <HStack>
                      <Button
                        colorScheme={'blue'}
                        isLoading={props.isSubmitting}
                        type={'submit'}
                      >
                        Create Link
                      </Button>
                      <Button onClick={onModalClose}>Cancel</Button>
                    </HStack>
                  ) : (
                    <HStack>
                      <Button
                        colorScheme={'blue'}
                        onClick={copyInviteLink}
                      >
                        {!clipboardHasCopied ? 'Copy Link' : 'Copied!'}
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
