/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from 'react';

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
  Select,
  Skeleton,
  SkeletonCircle,
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
import { BiRefresh, BiSolidExit } from 'react-icons/bi';

function TableEntry({ key, organization, skeleton }: { key: number | string, organization?: Organization, skeleton?: boolean }) {
  return <>
    <Tr key={key}>
      <Td>
        <Stack flexDir={'row'} align={'center'}>
          <Skeleton isLoaded={!skeleton}>
            <Avatar borderRadius={'lg'} size={'md'} src={organization?.avatar || '/images/default-avatar.png'} />
          </Skeleton>

          <Flex flexDir={'column'} mx={2} justify={'center'}>
            <Skeleton isLoaded={!skeleton}>
              <Text fontWeight={'bold'}>
                {!skeleton ? organization?.name : "Organization Name"}
              </Text>
              <Text size={'sm'} color={'gray.500'}>
                Owned by {!skeleton ? organization?.owner?.displayName : "Organization Owner"}
              </Text>
              <Flex align={'center'} color={'gray.500'} gap={1}>
                <Icon as={BiRefresh} />
                <Text size={'sm'}>
                  {!skeleton ? moment(new Date(organization?.updatedAt as string)).fromNow() : "Last Updated"}
                  {!skeleton && organization?.updatedBy && " by "}
                  {!skeleton ? organization?.updatedBy?.displayName : "Organization Owner"}
                </Text>
              </Flex>
            </Skeleton>
          </Flex>
        </Stack>
      </Td>
      <Td isNumeric>
        {/* TODO: implement avatars */}
        {/* <AvatarGroup max={3} size={"sm"}>
          <Avatar src='/images/logo.jpg' />
          <Avatar src='/images/logo.jpg' />
          <Avatar src='/images/logo.jpg' />
          <Avatar src='/images/logo.jpg' />
        </AvatarGroup> */}
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
      {/* <Td>
        <Skeleton isLoaded={!skeleton}>
          {useMemo(() => {
            const date = moment(new Date(organization?.updatedAt as string)).fromNow();
            return date as string;
          }, [organization])}

          {organization?.updatedBy && " by "}

          {organization?.updatedBy &&
            <Link href={`/platform/profile/${organization?.updatedBy?.username}`} textUnderlineOffset={4}>
              <Flex flexDir={'row'} align={"center"} gap={1} py={1}>
                <Avatar size={'xs'} src={organization?.updatedBy?.avatar || '/images/default-avatar.png'} />
                <Text fontWeight={'bold'}>
                  {organization?.updatedBy?.displayName}
                </Text>
              </Flex>
            </Link>
          }
        </Skeleton>
      </Td> */}
      <Td isNumeric>
        <Skeleton isLoaded={!skeleton}>
          <ButtonGroup>
            <Button
              as={Link}
              href={`/platform/organizations/${organization?.id}`}
              size={"sm"}
              variant={"outline"}
              colorScheme='blue'
              textDecor={"unset !important"}
            >
              View Profile
            </Button>
            <Button
              as={Link}
              href={`/platform/organizations/${organization?.id}/edit`}
              size={"sm"}
              variant={"solid"}
              colorScheme='blue'
              textDecor={"unset !important"}
            >
              View Details
            </Button>
            {/* <Button
            size={"sm"}
            variant={"solid"}
            colorScheme='red'
            leftIcon={<BiSolidExit />}
          >
            Leave
          </Button> */}
          </ButtonGroup>
        </Skeleton>
      </Td>
    </Tr>
  </>
}
export default function PlatformOrganizations() {
  const { push, query } = useRouter();
  const [organizations, setOrganizations] = useState<any>([]);
  const [organizationsLoading, setOrganizationsLoading] = useState<boolean>(true);
  const [queryLoading, setQueryLoading] = useState<boolean>(true);
  const { user } = useAuthContext();
  const [idToken, setIdToken] = useState<string | null>(null);
  const [initialInviteCodeValue, setInitialInviteCodeValue] = useState<string | null>(null);
  const toast = useToast();

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

  useEffect(() => {
    if (!idToken) return;
    setOrganizationsLoading(true);
    fetch('/api/v1/me/organizations', {
      method: 'GET',
      headers: { Authorization: `Bearer ${idToken}` }
    }).then((res) => {
      if (res.status !== 200) {
        throw new Error('failed to fetch organizations');
      }
      res
        .json()
        .then((data) => {
          setOrganizations(data.organizations);
          setOrganizationsLoading(false);
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
  }, [idToken, toast]);

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

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      setIdToken(token);
    });
  }, [user]);

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
          push(`/platform/organizations/${id}/edit`);
        }}
      />
      {!queryLoading && (
        <JoinOrganizationDialog
          isOpen={isJoinOrganizationModalOpen}
          onClose={onJoinOrganizationModalClose}
          onJoin={(id) => {
            push(`/platform/organizations/${id}/edit`);
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
        >
          Organizations
        </Text>
        <HStack
          display={'flex'}
          py={4}
          justify={'flex-start'}
          align={'flex-end'}
          spacing={4}
        >
          <FormControl w={'fit-content'}>
            <Button
              variant={'solid'}
              leftIcon={<MdOutlineAddCircle />}
              onClick={onCreateOrganizationModalOpen}
            >
              Create
            </Button>
          </FormControl>
          <FormControl w={'fit-content'}>
            <Button
              variant={'solid'}
              leftIcon={<MdOutlineJoinRight />}
              onClick={onJoinOrganizationModalOpen}
            >
              Join
            </Button>
          </FormControl>
          <FormControl w={'fit-content'}>
            <Button
              variant={'solid'}
              leftIcon={<MdMail />}
              onClick={onJoinOrganizationModalOpen}
              isDisabled={true}
            >
              View Invitations
            </Button>
          </FormControl>
        </HStack>
        <Box>
          <Flex
            as={Stack}
            direction={'row'}
            h={'full'}
            spacing={4}
            overflow={'auto'}
            flexWrap={'wrap'}
          >
            <TableContainer
              py={2}
              maxW={{ base: 'full', md: 'container.lg' }}
              overflowY={'auto'}
              flexGrow={1}
              px={4}
            >
              <Table size={{ base: 'sm', md: 'md' }}>
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
                    ) : (organizations.map((organization: Organization) => (
                      <TableEntry key={organization.id as string} organization={organization} skeleton={false} />
                    )))
                  }
                </Tbody>
              </Table>
            </TableContainer>
            {/* {organizationsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Box
                  key={i}
                  as={Skeleton}
                  w={{ base: 'full', md: '384px' }}
                  h={'max-content'}
                  py={4}
                  px={8}
                  borderWidth={1}
                  borderRadius={'xl'}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <HStack
                    p={2}
                    w={'full'}
                  >
                    <Box flexGrow={1}>
                      <Text
                        fontSize={'2xl'}
                        fontWeight={'bold'}
                      >
                        Loading...
                      </Text>
                      <Text color={'gray.500'}>0 Members</Text>
                      <Text color={'gray.500'}>Owned by</Text>
                      <Text>Organization</Text>
                    </Box>
                  </HStack>
                </Box>
              ))
            ) : organizations.length !== 0 ? (
              organizations.map((organization: any) => (
                <Box
                  key={organization.id}
                  w={{ base: 'full', md: '384px' }}
                  h={'max-content'}
                  p={6}
                  borderWidth={1}
                  borderRadius={'xl'}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <HStack
                    px={2}
                    w={'full'}
                  >
                    <Box flexGrow={1}>
                      <Text
                        fontSize={'xl'}
                        fontWeight={'bold'}
                        noOfLines={1}
                      >
                        {organization.name}
                      </Text>
                      <Text color={'gray.500'}>
                        {Object.keys(organization.members).length} member
                        {Object.keys(organization.members).length !== 1 ? 's' : ''}
                      </Text>
                      <Text color={'gray.500'}>
                        Owned by{' '}
                        <Link
                          as={NextLink}
                          textUnderlineOffset={4}
                          href={`/platform/profile/${organization?.owner.username}`}
                        >
                          {organization?.owner.displayName || 'Organization Owner'}
                        </Link>
                      </Text>
                      <Text>{organization.description}</Text>
                    </Box>
                    <Avatar
                      as={NextLink}
                      href={`/platform/organizations/${organization.id}/edit`}
                      alignSelf={'flex-start'}
                      name={organization.name}
                      src={organization.avatar}
                      aspectRatio={1 / 1}
                      borderRadius={'md'}
                      overflow={'hidden'}
                      objectFit={'cover'}
                      size={'lg'}
                    />
                  </HStack>
                  <Stack pt={4}>
                    <Button
                      as={NextLink}
                      href={`/platform/organizations/${organization.id}/edit`}
                      variant={'solid'}
                    >
                      View
                    </Button>
                  </Stack>
                </Box>
              ))
            ) : (
              <Text>
                You are currently not a member of any organization.{' '}
                <Text as={'span'}>
                  <Button
                    minW={'unset'}
                    variant={'link'}
                    color={'unset'}
                    textDecor={'underline'}
                    textUnderlineOffset={4}
                    onClick={onCreateOrganizationModalOpen}
                    _hover={{
                      color: useColorModeValue('gray.600', 'gray.400')
                    }}
                  >
                    Create
                  </Button>
                </Text>{' '}
                or{' '}
                <Text as={'span'}>
                  <Button
                    minW={'unset'}
                    variant={'link'}
                    color={'unset'}
                    textDecor={'underline'}
                    textUnderlineOffset={4}
                    onClick={onJoinOrganizationModalOpen}
                    _hover={{
                      color: useColorModeValue('gray.600', 'gray.400')
                    }}
                  >
                    join
                  </Button>
                </Text>{' '}
                an organization to get started.
              </Text>
            )} */}
          </Flex>
        </Box>
      </Container>
    </>
  );
}

PlatformOrganizations.getLayout = (page: any) => <Layout>{page}</Layout>;
