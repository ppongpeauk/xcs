/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useRef } from 'react';

import {
  Button,
  FormControl,
  FormHelperText,
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
  useToast
} from '@chakra-ui/react';

import { Field, Form, Formik } from 'formik';

import { getRandomAccessPointName } from '@/lib/utils';

import { useAuthContext } from '@/contexts/AuthContext';

export default function CreateAccessPointDialog({
  isOpen,
  onClose,
  location,
  onCreate
}: {
  isOpen: boolean;
  onClose: () => void;
  location: any;
  onCreate: (location: any) => void;
}) {
  const toast = useToast();
  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { user } = useAuthContext();

  const namePlaceholder = getRandomAccessPointName();

  return (
    <>
      <Formik
        initialValues={{ name: '', description: '' }}
        onSubmit={(values, actions) => {
          user.getIdToken().then((token: any) => {
            fetch(`/api/v1/locations/${location.id}/access-points`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                name: values.name,
                description: values.description,
                locationId: location.id
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
                onClose();
                onCreate(data.accessPointId);
              })
              .catch((error) => {
                toast({
                  title: 'There was an error creating the access point.',
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
            onClose={onClose}
            isCentered
            initialFocusRef={initialRef}
          >
            <ModalOverlay />
            <Form>
              <ModalContent bg={useColorModeValue('white', 'gray.800')}>
                <ModalHeader pb={2}>New Access Point</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={4}>
                  <VStack spacing={2}>
                    <Field name="name">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            ref={initialRef}
                            variant={'outline'}
                            placeholder={namePlaceholder || 'Access Point Name'}
                            autoCorrect={'off'}
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="description">
                      {({ field, form }: any) => (
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            {...field}
                            variant={'outline'}
                            placeholder={'Access Point Description'}
                            maxH={'200px'}
                          />
                          <FormHelperText>
                            This access point will be created under the{' '}
                            <Text
                              as={'span'}
                              fontWeight={'bold'}
                            >
                              {location?.name}
                            </Text>{' '}
                            location.
                          </FormHelperText>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme={'blue'}
                    mr={3}
                    isLoading={props.isSubmitting}
                    type={'submit'}
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
