import { useAuthContext } from '@/contexts/AuthContext';
import { Location } from '@/types';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { Box, Button, Flex, Space, Text, TextInput, Textarea, Title, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  Icon123,
  IconDeviceFloppy,
  IconDownload,
  IconHttpDelete,
  IconRecycle,
  IconUsersGroup
} from '@tabler/icons-react';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import AccessGroupEditModal from '../AccessGroupEditModal';
import DeleteDialog from '../DeleteDialog';

export default function LocationInfo({
  query,
  location,
  refreshData
}: {
  query: any;
  location: Location | any;
  refreshData: any;
}) {
  const [packLoading, setPackLoading] = useState(false);
  const { user } = useAuthContext();
  const { push } = useRouter();
  const toast = useToast();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();

  const onDelete = () => {
    user.getIdToken().then((token: string) => {
      fetch(`/api/v1/locations/${query.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
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
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          push(`/locations/?organization=${location?.organizationId}`);
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        })
        .finally(() => {
          onDeleteDialogClose();
        });
    });
  };

  const showDeleteModal = () =>
    modals.openConfirmModal({
      zIndex: 1000,
      title: <Title order={4}>Delete location?</Title>,
      children: (
        <Text size="sm">
          Are you sure you want to delete this location? This will revoke all API keys and delete all data associated
          with this location. This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete location', cancel: 'Nevermind' },
      confirmProps: { color: 'red' },
      onCancel: () => {},
      onConfirm: () => {
        onDelete();
      }
    });

  let downloadTemplate = useCallback(() => {
    setPackLoading(true);
    user.getIdToken().then((token: string) => {
      fetch(`/api/v1/locations/${query.id}/starter-pack`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.status === 200) {
            return res.blob();
          } else {
            return res.json().then((json: any) => {
              throw new Error(json.message);
            });
          }
        })
        .then((blob) => {
          // Convert location name to kebab case for file name
          const locationName = location.name.replace(/\s+/g, '-').replace('.', '').toLowerCase();

          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `xcs-template-${locationName}.rbxmx`);
          document.body.appendChild(link);
          link.click();
          link.parentNode?.removeChild(link);

          toast({
            title: 'Your download should start shortly.',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        })
        .finally(() => {
          setPackLoading(false);
        });
    });
  }, [location?.name, query?.id, toast, user]);

  const onGroupRemove = async (group: any) => {
    await user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${location?.organization?.id}/access-groups/${group.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
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
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          refreshData();
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    });
  };

  const { isOpen: roleModalOpen, onOpen: roleModalOnOpen, onClose: roleModalOnClose } = useDisclosure();

  return (
    <>
      <DeleteDialog
        title="Delete Location"
        body="Are you sure you want to delete this location? This will revoke all API keys and delete all data associated with this location. This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />
      <AccessGroupEditModal
        isOpen={roleModalOpen}
        onOpen={roleModalOnOpen}
        onClose={roleModalOnClose}
        onRefresh={refreshData}
        location={location}
        organization={location?.organization}
        clientMember={location?.self}
        groups={location?.accessGroups}
        onGroupRemove={onGroupRemove}
      />
      <Formik
        enableReinitialize
        initialValues={{
          name: location?.name,
          description: location?.description,
          enabled: location?.enabled,
          universeId: location?.roblox?.universe?.id
            ? `${location?.roblox?.universe?.id} (${location?.roblox.place?.name})`
            : ''
        }}
        onSubmit={(values, actions) => {
          user.getIdToken().then((token: string) => {
            fetch(`/api/v1/locations/${query.id}`, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: values.name,
                description: values.description || '',
                enabled: values.enabled,
                roblox: {
                  universe: {
                    id: location?.roblox?.universe?.id
                      ? location?.roblox?.universe?.id
                      : values.universeId.trim() == ''
                      ? ''
                      : values.universeId.trim()
                  }
                }
              })
            })
              .then((res: any) => {
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
                  status: 'success',
                  duration: 5000,
                  isClosable: true
                });
                actions.setSubmitting(false);
                refreshData();
              })
              .catch((error) => {
                toast({
                  title: 'There was an error updating the location.',
                  description: error.message,
                  status: 'error',
                  duration: 5000,
                  isClosable: true
                });
                actions.setSubmitting(false);
              });
          });
        }}
      >
        {(props) => (
          <Form>
            <Flex
              style={{
                flexDirection: 'column',
                gap: '0.5rem',
                width: 'fit-content'
              }}
            >
              <Field name="name">
                {({ field, form }: any) => (
                  <TextInput
                    {...field}
                    label="Name"
                    withAsterisk
                    description="The name of this location."
                    placeholder="ACME Headquarters"
                  />
                )}
              </Field>
              <Field name="description">
                {({ field, form }: any) => (
                  <Textarea
                    {...field}
                    label="Description"
                    description="A description of this location."
                    placeholder="Location description..."
                  />
                )}
              </Field>
              <Field name="universeId">
                {({ field, form }: any) => (
                  <TextInput
                    {...field}
                    label="Experience ID"
                    description="The ID of the experience this XCS location belongs to."
                    placeholder="Experience ID"
                    disabled={true}
                    leftSection={<Icon123 size={'20px'} />}
                  />
                )}
              </Field>
            </Flex>
            <Flex
              mt={16}
              gap={8}
              direction={'row'}
              style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                justifyItems: 'center'
              }}
            >
              <Button
                variant="default"
                onClick={roleModalOnOpen}
                leftSection={<IconUsersGroup size={'16px'} />}
              >
                Access Groups
              </Button>
              <Tooltip.Floating label="Download everything you need to integrate XCS into your place.">
                <Button
                  variant="default"
                  onClick={downloadTemplate}
                  leftSection={<IconDownload size={'16px'} />}
                  loading={packLoading}
                >
                  Download Template
                </Button>
              </Tooltip.Floating>
            </Flex>
            <Flex
              mt={8}
              style={{
                flexDirection: 'row',
                gap: '0.5rem'
              }}
              w={'fit-content'}
            >
              <Button
                type="submit"
                color="dark.5"
                loading={props.isSubmitting}
                disabled={props.isSubmitting}
                leftSection={<IconDeviceFloppy size={'16px'} />}
                mr={'auto'}
              >
                Save Changes
              </Button>
              <Button
                color="red"
                leftSection={<IconRecycle size={'16px'} />}
                onClick={() => {
                  showDeleteModal();
                }}
              >
                Delete
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
      <Text
        size="sm"
        py={8}
        c={'dimmed'}
        maw={480}
      >
        <strong>Note: </strong>Access groups can be managed in the settings of the organization in which this location
        belongs to.
      </Text>
    </>
  );
}
