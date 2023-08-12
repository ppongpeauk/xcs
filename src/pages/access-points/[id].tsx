/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  Code,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Skeleton,
  SkeletonText,
  Spacer,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  chakra,
  useClipboard,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import { ChevronRightIcon } from '@chakra-ui/icons';

import { IoIosRemoveCircle } from 'react-icons/io';
import { IoBusiness, IoClipboard, IoSave, IoTime } from 'react-icons/io5';

import { AccessGroup, Organization } from '@/types';
import Editor from '@monaco-editor/react';
import { AsyncSelect, CreatableSelect, Select } from 'chakra-react-select';
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { agIds, agKV, agNames } from '@/lib/utils';

import { useAuthContext } from '@/contexts/AuthContext';

import Layout from '@/layouts/PlatformLayout';

import DeleteDialog from '@/components/DeleteDialog';

const ChakraEditor = chakra(Editor);
export default function PlatformAccessPoint() {
  const { query, push } = useRouter();
  const { user } = useAuthContext();
  const [accessPoint, setAccessPoint] = useState<any>(null);
  const themeBorderColor = useColorModeValue('gray.200', 'gray.700');
  const [accessGroupOptions, setAccessGroupOptions] = useState<any>([]);
  const [tagsOptions, setTagsOptions] = useState<any>([]); // [{ value: 'tag', label: 'tag' }
  const toast = useToast();
  const {
    hasCopied: clipboardHasCopied,
    setValue: clipboardSetValue,
    value: clipboardValue,
    onCopy: clipboardOnCopy
  } = useClipboard('');

  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();

  const onDelete = () => {
    user.getIdToken().then((idToken: any) => {
      fetch(`/api/v1/access-points/${query.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${idToken}` }
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
          push(`/locations/${accessPoint?.location?.id}/access-points`);
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

  let refreshData = () => {
    setAccessPoint(null);
    user.getIdToken().then((idToken: any) => {
      fetch(`/api/v1/access-points/${query.id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` }
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          push('/organizations');
          switch (res.status) {
            case 404:
              throw new Error('Access point not found.');
            case 403:
              throw new Error('You do not have permission to view this access point.');
            case 401:
              throw new Error('You do not have permission to view this access point.');
            case 500:
              throw new Error('An internal server error occurred.');
            default:
              throw new Error('An unknown error occurred.');
          }
        })
        .then((data) => {
          setAccessPoint(data.accessPoint);
          if (clipboardValue === '') {
            clipboardSetValue(data.accessPoint?.id);
          }
        })
        .catch((err) => {
          toast({
            title: 'There was an error fetching the access point.',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    });
  };

  // Fetch location data
  useEffect(() => {
    if (!user) return;
    if (!query.id) return;
    refreshData();
  }, [query.id, user]);

  const getAccessGroupType = useCallback((ag: AccessGroup) => {
    if (ag.type === 'organization') {
      return 'Organization';
    } else if (ag.type === 'location') {
      // TODO: get location name
      return ag.locationName || ag.locationId || 'Unknown';
    } else {
      return ag.type;
    }
  }, []);

  const getAccessGroupOptions = useCallback(
    (organization: Organization) => {
      if (!organization) return [];
      const ags = Object.values(organization?.accessGroups as AccessGroup[]) || [];
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
              value: ag.id
            });
        } else {
          // if it's not, add the group to the groups array
          groups.push({
            label: getAccessGroupType(ag),
            options: [
              {
                label: ag.name,
                value: ag.id
              }
            ]
          });
        }
      });

      // sort the groups so organizations are at the bottom
      groups.sort((a: Group, b: Group) => {
        if (a.label === 'Organization') return 1;
        if (b.label === 'Organization') return -1;
        return 0;
      });

      setAccessGroupOptions(groups);
      return groups;
    },
    [accessPoint?.organization]
  );

  useEffect(() => {
    if (!accessPoint) return;
    if (!accessPoint?.organization) return;
    getAccessGroupOptions(accessPoint?.organization);
  }, [accessPoint, getAccessGroupOptions]);

  useEffect(() => {
    if (!accessPoint) return;

    user.getIdToken().then(async (idToken: any) => {
      await fetch(`/api/v1/locations/${accessPoint.locationId}/access-points`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${idToken}` }
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          throw new Error(`Failed to fetch access points. (${res.status})`);
        })
        .then((data) => {
          let accessPoints = data.accessPoints;
          let res = [] as string[];
          accessPoints?.forEach((accessPoint: any) => {
            res = [...res, ...(accessPoint?.tags || [])];
          });
          res = [...(new Set(res as any) as any)];
          setTagsOptions([
            ...(new Set(
              res.map((value: string) => {
                return {
                  value,
                  label: value as string
                };
              })
            ) as any)
          ]);
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
  }, [accessPoint]);

  return (
    <>
      <Head>
        <title>Restrafes XCS – {accessPoint?.name}</title>
        <meta
          property="og:title"
          content="Restrafes XCS – Manage Access Point"
        />
        <meta
          property="og:site_name"
          content="Restrafes XCS"
        />
        <meta
          property="og:url"
          content="https://xcs.restrafes.co"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:image"
          content="/images/logo-square.jpeg"
        />
      </Head>
      <DeleteDialog
        title="Delete Access Point"
        body="Are you sure you want to delete this access point? This action cannot be undone."
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onDelete={onDelete}
      />
      <Box
        maxW={'container.md'}
        p={8}
      >
        <Skeleton isLoaded={accessPoint}>
          <Breadcrumb
            display={{ base: 'none', md: 'flex' }}
            spacing="8px"
            mb={4}
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem>
              <BreadcrumbLink
                as={NextLink}
                href="/home"
                textUnderlineOffset={4}
              >
                Platform
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={NextLink}
                href={`/organizations/${accessPoint?.organizationId}/settings`}
                textUnderlineOffset={4}
              >
                {accessPoint?.organization?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink
                as={NextLink}
                href={`/locations/${accessPoint?.location?.id}/access-points`}
                textUnderlineOffset={4}
              >
                {accessPoint?.location?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink
                href="#"
                textUnderlineOffset={4}
              >
                {accessPoint?.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Skeleton>
        <Skeleton isLoaded={accessPoint}>
          <Text
            as={'h1'}
            fontSize={'4xl'}
            fontWeight={'900'}
            lineHeight={0.9}
            mb={2}
          >
            {accessPoint?.name || 'Loading...'}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={accessPoint}>
          <Text
            fontSize={'lg'}
            color={'gray.500'}
          >
            {accessPoint?.organization.name} – {accessPoint?.location.name}
          </Text>
        </Skeleton>
        <Divider my={4} />
        <Box minW={['100%', 'fit-content']}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: accessPoint?.name,
              tags:
                accessPoint?.tags?.map((tag: string) => ({
                  label: tag,
                  value: tag
                })) || [],
              description: accessPoint?.description,
              active: accessPoint?.config?.active,
              armed: accessPoint?.config?.armed,
              unlockTime: accessPoint?.config?.unlockTime,
              accessGroups: accessPoint?.config?.alwaysAllowed?.groups.map((ag: AccessGroup) => ({
                label: Object.values(accessPoint?.organization?.accessGroups as AccessGroup[]).find(
                  (oag: any) => oag.id === ag
                )?.name,
                value: ag
              })),
              alwaysAllowedUsers: JSON.stringify(accessPoint?.config?.alwaysAllowed?.users),
              scanDataDisarmed: JSON.stringify(accessPoint?.config?.scanData?.disarmed || {}, null, 3),
              scanDataReady: JSON.stringify(accessPoint?.config?.scanData?.ready || {}, null, 3),
              webhookUrl: accessPoint?.config?.webhook?.url,
              webhookEventGranted: accessPoint?.config?.webhook?.eventGranted,
              webhookEventDenied: accessPoint?.config?.webhook?.eventDenied
            }}
            onSubmit={(values, actions) => {
              user.getIdToken().then((token: any) => {
                fetch(`/api/v1/access-points/${query.id}`, {
                  method: 'PUT',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    name: values.name,
                    description: values.description || '',
                    tags: values.tags.map((tag: any) => tag.value),

                    config: {
                      active: values.active,
                      armed: values.armed,
                      unlockTime: values.unlockTime,

                      alwaysAllowed: {
                        // users: JSON.parse(values.alwaysAllowedUsers),
                        groups: values?.accessGroups?.map((ag: any) => ag?.value)
                      },

                      webhook: {
                        url: values.webhookUrl,
                        eventGranted: values.webhookEventGranted,
                        eventDenied: values.webhookEventDenied
                      },

                      scanData: {
                        disarmed: values.scanDataDisarmed,
                        ready: values.scanDataReady
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
                      title: 'There was an error updating the access point.',
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
              <Form>
                <Heading
                  as={'h2'}
                  fontSize={'xl'}
                  fontWeight={'900'}
                  py={2}
                >
                  General
                </Heading>
                <Flex direction={'column'} gap={2}>
                  <Field
                    name="name"
                    w={'min-content'}
                  >
                    {({ field, form }: any) => (
                      <FormControl w={'fit-content'}>
                        <Skeleton isLoaded={accessPoint}>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Access Point Name"
                          />
                        </Skeleton>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description">
                    {({ field, form }: any) => (
                      <FormControl w={{ base: 'full', md: '320px' }}>
                        <Skeleton isLoaded={accessPoint}>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            {...field}
                            type="text"
                            autoComplete="off"
                            placeholder="Access Point Description"
                            maxH={'240px'}
                          />
                        </Skeleton>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="tags">
                    {({ field, form }: any) => (
                      <FormControl w={{ base: 'full', md: '320px' }}>
                        <Skeleton isLoaded={accessPoint}>
                          <FormLabel>Tags</FormLabel>
                          <CreatableSelect
                            options={tagsOptions}
                            placeholder="Select a tag..."
                            onChange={(value) => {
                              form.setFieldValue(
                                'tags',
                                value.map((v: any) => {
                                  return {
                                    label: v.value,
                                    value: v.value
                                  };
                                })
                              );
                            }}
                            value={field?.value}
                            isMulti
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            selectedOptionStyle={'check'}
                          />
                          <FormHelperText>
                            Tags are used to organize access points, and can be used to filter
                            access points in the access point list.
                          </FormHelperText>
                        </Skeleton>
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                <Heading
                  as={'h2'}
                  fontSize={'xl'}
                  fontWeight={'900'}
                  pt={4}
                >
                  Configuration
                </Heading>
                <Tabs
                  isManual
                  py={2}
                >
                  <TabList mb={2}>
                    <Tab>Main Settings</Tab>
                    <Tab>Permissions</Tab>
                    <Tab>Scan Data</Tab>
                    <Tab>Webhook Integration</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Flex direction={'column'} gap={2}>
                        <Stack
                          direction={'row'}
                          spacing={2}
                          w={'fit-content'}
                        >
                          <Field name="active">
                            {({ field, form }: any) => (
                              <FormControl>
                                <Skeleton isLoaded={accessPoint}>
                                  <FormLabel>Active</FormLabel>
                                  <InputGroup>
                                    <Switch
                                      {...field}
                                      colorScheme="blue"
                                      placeholder="Active"
                                      variant={'outline'}
                                      width={'fit-content'}
                                      defaultChecked={accessPoint?.config?.active}
                                    />
                                  </InputGroup>
                                </Skeleton>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="armed">
                            {({ field, form }: any) => (
                              <FormControl>
                                <Skeleton isLoaded={accessPoint}>
                                  <FormLabel>Armed</FormLabel>
                                  <InputGroup>
                                    <Switch
                                      {...field}
                                      colorScheme="red"
                                      placeholder="Armed"
                                      variant={'outline'}
                                      width={'fit-content'}
                                      defaultChecked={accessPoint?.config?.armed}
                                    />
                                  </InputGroup>
                                </Skeleton>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>
                        <Field name="unlockTime">
                          {({ field, form }: any) => (
                            <FormControl w={'fit-content'}>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Unlock Time</FormLabel>
                                <InputGroup mb={2}>
                                  <NumberInput
                                    {...field}
                                    autoComplete="off"
                                    placeholder="Unlock Time"
                                    variant={'outline'}
                                    min={1}
                                    defaultValue={8}
                                    onChange={(value) => {
                                      form.setFieldValue('unlockTime', value);
                                    }}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                </InputGroup>
                                <FormHelperText>
                                  The number of seconds to keep the access point unlocked for.
                                </FormHelperText>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Stack
                        direction={{ base: 'column', md: 'row' }}
                        spacing={2}
                      >
                        <Field name="accessGroups">
                          {({ field, form }: any) => (
                            <FormControl
                              w={{ base: 'full', md: '320px' }}
                              maxW={'75%'}
                            >
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Access Groups</FormLabel>
                                <Select
                                  {...field}
                                  name="accessGroups"
                                  options={accessGroupOptions}
                                  placeholder="Select an access group..."
                                  onChange={(value) => {
                                    form.setFieldValue('accessGroups', value);
                                  }}
                                  value={field?.value}
                                  isMulti
                                  closeMenuOnSelect={false}
                                  hideSelectedOptions={false}
                                  selectedOptionStyle={'check'}
                                />
                                <FormHelperText>
                                  Choose which access groups will be allowed to access this access point.
                                </FormHelperText>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                      <Stack
                        direction={{ base: 'column', md: 'row' }}
                        spacing={2}
                      >
                        <Field name="scanDataDisarmed">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Disarmed</FormLabel>
                                <Box
                                  border={'1px solid'}
                                  borderColor={themeBorderColor}
                                  borderRadius={'lg'}
                                  w={'full'}
                                  overflow={'hidden'}
                                >
                                  <ChakraEditor
                                    {...field}
                                    height="240px"
                                    width="100%"
                                    p={4}
                                    language="json"
                                    theme={useColorModeValue('vs-light', 'vs-dark')}
                                    options={{
                                      minimap: {
                                        enabled: false
                                      }
                                    }}
                                    value={field?.value}
                                    onChange={(value) => {
                                      form.setFieldValue('scanDataDisarmed', value);
                                    }}
                                  />
                                </Box>
                                <FormHelperText>
                                  This data will be passed when the access point is on &quot;disarmed&quot; status.
                                </FormHelperText>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="scanDataReady">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Ready</FormLabel>
                                <Box
                                  border={'1px solid'}
                                  borderColor={themeBorderColor}
                                  borderRadius={'lg'}
                                  w={'full'}
                                  overflow={'hidden'}
                                >
                                  <ChakraEditor
                                    {...field}
                                    height="240px"
                                    width="100%"
                                    p={4}
                                    language="json"
                                    theme={useColorModeValue('vs-light', 'vs-dark')}
                                    options={{
                                      minimap: {
                                        enabled: false
                                      }
                                    }}
                                    value={field?.value}
                                    onChange={(value) => {
                                      form.setFieldValue('scanDataReady', value);
                                    }}
                                  />
                                </Box>
                                <FormHelperText>
                                  This data will be passed when the access point is on &quot;ready&quot; status.
                                </FormHelperText>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                    </TabPanel>
                    <TabPanel>
                      <Field
                        name="webhookUrl"
                        w={'min-content'}
                      >
                        {({ field, form }: any) => (
                          <FormControl w={'full'}>
                            <Skeleton isLoaded={accessPoint}>
                              <FormLabel>Webhook URL</FormLabel>
                              <InputGroup mb={2}>
                                <Input
                                  {...field}
                                  type="text"
                                  autoComplete="off"
                                  placeholder="Webhook URL"
                                  variant={'outline'}
                                />
                              </InputGroup>
                            </Skeleton>
                          </FormControl>
                        )}
                      </Field>
                      <Heading
                        as={'h3'}
                        fontSize={'xl'}
                        fontWeight={'900'}
                        mt={4}
                      >
                        Trigger Events
                      </Heading>
                      <Stack
                        direction={'row'}
                        spacing={2}
                        py={2}
                        w={'fit-content'}
                      >
                        <Field name="webhookEventGranted">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Granted</FormLabel>
                                <InputGroup>
                                  <Switch
                                    {...field}
                                    variant={'outline'}
                                    width={'fit-content'}
                                    defaultChecked={accessPoint?.config?.webhook?.eventGranted}
                                  />
                                </InputGroup>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                        <Field name="webhookEventDenied">
                          {({ field, form }: any) => (
                            <FormControl>
                              <Skeleton isLoaded={accessPoint}>
                                <FormLabel>Denied</FormLabel>
                                <InputGroup>
                                  <Switch
                                    {...field}
                                    variant={'outline'}
                                    width={'fit-content'}
                                    defaultChecked={accessPoint?.config?.webhook?.eventDenied}
                                  />
                                </InputGroup>
                              </Skeleton>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={2}
                  py={2}
                >
                  <Button
                    mb={2}
                    leftIcon={<IoSave />}
                    isLoading={props.isSubmitting}
                    type={'submit'}
                  >
                    Save Changes
                  </Button>
                  {/* <Button mb={2} leftIcon={<IoTime />} isDisabled>
                    Setup Timed Access
                  </Button> */}
                  <Button
                    mb={2}
                    leftIcon={<IoClipboard />}
                    onClick={async () => {
                      clipboardOnCopy();
                      toast({
                        title: 'Copied access point ID to clipboard.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                      });
                    }}
                  >
                    {clipboardHasCopied ? 'Copied!' : 'Copy ID'}
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme="red"
                    mb={2}
                    onClick={onDeleteDialogOpen}
                    leftIcon={<IoIosRemoveCircle />}
                  >
                    Delete
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </>
  );
}

PlatformAccessPoint.getLayout = (page: any) => <Layout>{page}</Layout>;
