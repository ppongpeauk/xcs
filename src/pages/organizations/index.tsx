/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  ButtonGroup,
  Code,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  Select,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Stack,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import { Link } from '@chakra-ui/next-js';

import { MdMail, MdOutlineAddCircle, MdOutlineJoinRight } from 'react-icons/md';

import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import Layout from '@/layouts/PlatformLayout';

import CreateOrganizationDialog from '@/components/CreateOrganizationDialog';
import JoinOrganizationDialog from '@/components/JoinOrganizationDialog';
import { Organization } from '@/types';
import moment from 'moment';
import 'moment-timezone';
import { BiGrid, BiRefresh, BiSolidExit } from 'react-icons/bi';
import { BsListUl } from 'react-icons/bs';

function TableEntry({ key, organization, skeleton }: { key: number | string, organization?: Organization, skeleton?: boolean }) {
  const toRelativeTime = useMemo(() => (date: string) => {
    return moment(new Date(date)).fromNow();
  }, []);

  return <>
    <Tr key={key}>
      <Td>
        <Stack flexDir={'row'} align={'center'}>
          <Skeleton isLoaded={!skeleton}>
            <Avatar as={Link} href={`/organizations/${organization?.id}`} transition={'opacity 0.2s ease-out'} _hover={{ opacity: 0.75 }} _active={{ opacity: 0.5 }} borderRadius={'lg'} size={'md'} src={organization?.avatar || '/images/default-avatar.png'} />
          </Skeleton>

          <Flex flexDir={'column'} mx={2} justify={'center'}>
            <Skeleton isLoaded={!skeleton}>
              <Text fontWeight={'bold'}>
                {!skeleton ? organization?.name : "Organization Name"}
              </Text>
              <Text size={'sm'} variant={'subtext'} textUnderlineOffset={4}>
                Owned by {!skeleton ? <Link href={`/@${organization?.owner?.username}`}>{organization?.owner?.displayName}</Link> : "Organization Owner"}
              </Text>
              <Flex align={'center'} color={'gray.500'} gap={1}>
                <Icon as={BiRefresh} />
                <Text size={'sm'} textUnderlineOffset={4}>
                  {!skeleton ? toRelativeTime(organization?.updatedAt as string) : "Last Updated"}
                  {!skeleton && organization?.updatedBy && " by "}
                  {!skeleton ? <Link href={`/@${organization?.updatedBy?.username}`}>{organization?.updatedBy?.displayName}</Link> : "Organization Owner"}
                </Text>
              </Flex>
              <Text size={'sm'} variant={'subtext'} maxW={{ base: '500px', md: '384px', lg: '500px' }} overflow={'hidden'} textOverflow={'ellipsis'}>
                {!skeleton ? organization?.description : "Organization Description"}
              </Text>
            </Skeleton>
          </Flex>
        </Stack>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <Text>
            {!skeleton ? organization?.statistics?.numMembers : 0}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <Text>
            {!skeleton ? organization?.statistics?.numLocations : 0}
          </Text>
        </Skeleton>
      </Td>
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <ButtonGroup>
            <Button
              as={Link}
              href={`/organizations/${organization?.id}/settings`}
              size={"sm"}
              variant={"solid"}
              colorScheme='blue'
              textDecor={"unset !important"}
            >
              View Details
            </Button>
          </ButtonGroup>
        </Skeleton>
      </Td>
    </Tr>
  </>
}
export default function PlatformOrganizations() {
  const { user } = useAuthContext();
  const { push, query } = useRouter();
  const toast = useToast();

  const [queryLoading, setQueryLoading] = useState<boolean>(true);
  const [organizationsLoading, setOrganizationsLoading] = useState<boolean>(true);

  const [organizations, setOrganizations] = useState<any>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<any>([]);
  const [initialInviteCodeValue, setInitialInviteCodeValue] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<'list' | 'grid' | null>(null);

  // modal disclosure hooks

  const {
    isOpen: isCreateOrganizationModalOpen,
    onOpen: onCreateOrganizationModalOpen,
    onClose: onCreateOrganizationModalClose
  } = useDisclosure();

  const {
    isOpen: isJoinOrganizationModalOpen,
    onOpen: onJoinOrganizationModalOpen,
    onClose: onJoinOrganizationModalClose
  } = useDisclosure();

  const refreshData = useCallback(async () => {
    setOrganizationsLoading(true);
    const token = await user?.getIdToken().then((token: string) => token);
    await fetch('/api/v1/me/organizations', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.status !== 200) {
        throw new Error('Failed to fetch organizations.');
      }
      res
        .json()
        .then((data) => {
          setTimeout(() => {
            setOrganizations(data.organizations);
            setOrganizationsLoading(false);
          }, 100);
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
    }).catch((err) => {
      toast({
        title: 'There was an error fetching your organizations.',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    });
  }, [toast, user]);

  useEffect(() => {
    if (!user) return;
    refreshData();
  }, [user, refreshData]);

  const joinOrganizationPrompt = (inviteCode: string) => {
    setQueryLoading(true);
    setInitialInviteCodeValue(inviteCode);
    setQueryLoading(false);
    onJoinOrganizationModalOpen();
  };

  const onCreateOrganization = () => {
    onCreateOrganizationModalClose();
    toast({
      title: 'Success',
      description: 'Organization created successfully',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  };

  useEffect(() => {
    if (!query) return;
    if (query.invitation) {
      joinOrganizationPrompt(query.invitation as string);
    } else {
      setTimeout(() => {
        setQueryLoading(false);
      }, 100);
    }
  }, [query.invitation]);

  const filterOrganizations = useCallback((query: string) => {
    if (!query) {
      setFilteredOrganizations(organizations);
      return;
    }
    const filtered = organizations.filter((organization: Organization) => {
      return organization.name.toLowerCase().includes(query.toLowerCase()) || organization.owner?.displayName?.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredOrganizations(filtered);
  }, [organizations]);

  const toRelativeTime = useMemo(() => (date: string) => {
    return moment(new Date(date)).fromNow();
  }, []);

  useEffect(() => {
    // load view option from local storage
    const viewOption = localStorage.getItem('organizationView');
    if (viewOption) {
      setView(viewOption as 'list' | 'grid');
    } else {
      setView('list');
      localStorage.setItem('organizationView', 'list');
    }
  }, []);

  useEffect(() => {
    // cache view option in local storage
    if (!view) return;
    localStorage.setItem('organizationView', view);
  }, [view]);

  useEffect(() => {
    if (!organizations) return;
    setFilteredOrganizations(organizations);
  }, [organizations]);

  return (
    <>
      <Head>
        <title>Restrafes XCS – Organizations</title>
        <meta
          property="og:title"
          content="Restrafes XCS - Manage Organizations"
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
      <CreateOrganizationDialog
        isOpen={isCreateOrganizationModalOpen}
        onClose={onCreateOrganizationModalClose}
        onCreate={(id) => {
          push(`/organizations/${id}/settings`);
        }}
      />
      {!queryLoading && (
        <JoinOrganizationDialog
          isOpen={isJoinOrganizationModalOpen}
          onClose={onJoinOrganizationModalClose}
          onJoin={(id) => {
            push(`/organizations/${id}/settings`);
          }}
          initialValue={initialInviteCodeValue || ''}
        />
      )}
      <Container
        maxW={'full'}
        p={8}
      >
        <Text
          as={'h1'}
          fontSize={'4xl'}
          fontWeight={'900'}
          pb={4}
        >
          Organizations
        </Text>
        <Stack
          flexDir={{ base: 'column', lg: 'row' }}
          display={'flex'}
          justify={'flex-start'}
          gap={4}
        >
          <Button
            variant={'solid'}
            leftIcon={<MdOutlineAddCircle />}
            onClick={onCreateOrganizationModalOpen}
          >
            New
          </Button>
          <Button
            variant={'solid'}
            leftIcon={<MdOutlineJoinRight />}
            onClick={onJoinOrganizationModalOpen}
          >
            Join
          </Button>
          <Button
            variant={'solid'}
            leftIcon={<MdMail />}
            onClick={onJoinOrganizationModalOpen}
            isDisabled={true}
          >
            View Invitations
          </Button>
          <Input
            placeholder={'Search'}
            variant={'filled'}
            w={{ base: 'full', md: 'auto' }}
            ref={searchRef}
            onChange={(e) => {
              filterOrganizations(e.target.value);
            }}
          />
          <Spacer />
          <Flex w={'fit-content'} gap={4}>
            <ButtonGroup>
              <Tooltip label={'Refresh'} placement={'top'}>
                <IconButton aria-label={'Refresh'} icon={<BiRefresh />}
                  onClick={refreshData}
                />
              </Tooltip>
            </ButtonGroup>
            <ButtonGroup isAttached>
              <Tooltip label={'List'} placement={'top'}>
                <IconButton aria-label={'List'} variant={view === "list" ? "solid" : "unselected"} onClick={() => { setView('list') }} icon={<BsListUl />} />
              </Tooltip>
              <Tooltip label={'Grid'} placement={'top'}>
                <IconButton aria-label={'Grid'} variant={view === "grid" ? "solid" : "unselected"} onClick={() => { setView('grid') }} icon={<BiGrid />} />
              </Tooltip>
            </ButtonGroup>
          </Flex>
        </Stack>
        <Box w={"full"}>
          <Flex
            as={Stack}
            direction={'row'}
            h={'full'}
            spacing={4}
            overflow={'auto'}
            flexWrap={'wrap'}
          >
            {
              view === 'list' ? (
                <TableContainer
                  py={2}
                  maxW={{ base: 'full' }}
                  overflowY={'auto'}
                  flexGrow={1}
                  px={4}
                >
                  <Table size={{ base: 'md', md: 'md' }}>
                    <Thead>
                      <Tr>
                        <Th>Organization</Th>
                        <Th isNumeric># Members</Th>
                        <Th isNumeric># Locations</Th>
                        {/* <Th>Last Updated</Th> */}
                        <Th isNumeric>Actions</Th>
                      </Tr>
                    </Thead>
                    {/* display list of organizations */}
                    <Tbody>
                      {
                        organizationsLoading ? (
                          Array.from({ length: 6 }).map((_, i) => (
                            <TableEntry key={i} organization={undefined} skeleton={true} />
                          ))
                        ) : (filteredOrganizations.map((organization: Organization) => (
                          <TableEntry key={organization.id as string} organization={organization} skeleton={false} />
                        )))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Flex py={8} gap={4} wrap={'wrap'}>
                  {
                    organizationsLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <Flex key={i} flexDir={'column'} w={{ base: 'full', md: '224px' }}>
                          <Skeleton>
                            <Flex
                              border={'1px solid'}
                              borderRadius={'lg'}
                              borderColor={useColorModeValue('gray.200', 'gray.700')}
                              aspectRatio={1}
                            >
                            </Flex>
                          </Skeleton>
                          <Flex py={4} flexDir={'column'} textUnderlineOffset={4} gap={2}>
                            <Skeleton>
                              <Heading
                                as={'h3'}
                                size={'md'}
                                fontWeight={'bold'}
                              >
                                Organization
                              </Heading>
                            </Skeleton>
                            <Skeleton>
                              <Text color={"gray.500"}>
                                Author
                              </Text>
                            </Skeleton>
                            <Flex align={'center'} color={'gray.500'} gap={1} fontSize={'md'}>
                              <Skeleton>
                                <Text color={'gray.500'}>
                                  Updated Date
                                </Text>
                              </Skeleton>
                            </Flex>
                          </Flex>
                        </Flex>
                      ))
                    ) : (
                      filteredOrganizations.map((organization: Organization) => (
                        <Flex key={organization.id} flexDir={'column'} w={{ base: 'full', md: '224px' }}>
                          {/* icon */}
                          <Flex
                            border={'1px solid'}
                            borderRadius={'lg'}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                            aspectRatio={1}
                          >
                            <Link href={`/organizations/${organization.id}/settings`}>
                              <Avatar
                                ignoreFallback={true}
                                borderRadius={'lg'}
                                size={'lg'}
                                src={organization.avatar || '/images/default-avatar.png'}
                                cursor={'pointer'}
                                w={'full'}
                                h={'full'}
                                transition={'opacity 0.2s ease-out'} _hover={{ opacity: 0.75 }} _active={{ opacity: 0.5 }}
                              />
                            </Link>
                          </Flex>
                          {/* text */}
                          <Flex p={4} flexDir={'column'} textUnderlineOffset={4}>
                            <Heading
                              as={'h3'}
                              size={'md'}
                              fontWeight={'bold'}
                            >
                              <Link href={`/organizations/${organization.id}/settings`}>
                                {organization.name}
                              </Link>
                            </Heading>
                            <Link color={"gray.500"} href={`/@${organization.owner?.username}`}>
                              by {organization.owner?.displayName}
                            </Link>
                            <Flex align={'center'} color={'gray.500'} gap={1} fontSize={'md'}>
                              <Icon as={BiRefresh} />
                              <Text color={'gray.500'}>
                                {!organizationsLoading ? toRelativeTime(organization.updatedAt) : "Last Updated"}
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      ))
                    )
                  }
                </Flex>
              )}
            {
              !organizationsLoading && filteredOrganizations.length === 0 && (
                <Flex
                  flexDir={'column'}
                  align={'center'}
                  justify={'center'}
                  w={'full'}
                  h={'full'}
                  py={4}
                >
                  <Text fontSize={'2xl'} fontWeight={'bold'}>No Organizations Found</Text>
                  <Text color={'gray.500'}>Try adjusting your search query or creating a new organization.</Text>
                </Flex>
              )
            }
          </Flex>
        </Box>
      </Container>
    </>
  );
}

PlatformOrganizations.getLayout = (page: any) => <Layout>{page}</Layout>;
