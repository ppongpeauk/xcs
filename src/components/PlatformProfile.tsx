/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

import { Link } from '@chakra-ui/next-js';
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  StackItem,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';

import { BsDiscord } from 'react-icons/bs';
import { IoSparkles } from 'react-icons/io5';
import { SiRoblox } from 'react-icons/si';
import { VscVerifiedFilled } from 'react-icons/vsc';

// Types
import { Organization, User } from '@/types';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

function OrganizationItem({ organization }: { organization: any }) {
  return (
    <Link
      href={`/organizations/${organization.id}`}
      w={'auto'}
      h={'auto'}
      transition={'filter 0.2s ease-in-out'}
      _hover={{
        filter: useColorModeValue('opacity(0.75)', 'brightness(0.75)')
      }}
    >
      <Avatar
        name={organization?.name}
        src={organization?.avatar}
        objectFit={'cover'}
        aspectRatio={1 / 1}
        rounded={'md'}
        borderRadius={'md'}
      >
        {organization?.verified && (
          <AvatarBadge boxSize="1.05em">
            <Icon
              as={VscVerifiedFilled}
              color={'gold'}
              h={'1em'}
            />
          </AvatarBadge>
        )}
      </Avatar>
    </Link>
  );
}

export default function Profile({ username, user: serverUser }: { username?: string | null; user?: User }) {
  const router = useRouter();
  const { currentUser, user: authUser } = useAuthContext();
  const [user, setUser] = useState<any | undefined>(undefined);
  const toast = useToast();

  const fetchUser = async (token?: string) => {
    fetch(`/api/v1/users/${username}`, {
      method: 'GET',
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        toast({
          title: 'User not found',
          description: 'Could not find user',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  };

  useEffect(() => {
    // if (!currentUser) return;
    if (!username) return;
    setUser(undefined);
    if (authUser) {
      authUser.getIdToken().then((token: any) => {
        fetchUser(token);
      });
    } else {
      fetchUser();
    }
  }, [username, currentUser, router, toast]);

  return (
    <>
      <Head>
        {user ? (
          <title>{`Restrafes XCS – ${user?.displayName || user?.name?.first}'s Profile`}</title>
        ) : (
          <title>{`Restrafes XCS – Profile`}</title>
        )}
      </Head>
      <Container
        display={'flex'}
        maxW={'full'}
        px={8}
        pt={8}
        flexDir={'column'}
      >
        <Box
          pos={'relative'}
          width={{ base: 'full', md: 'min-content' }}
          pb={6}
        >
          {/* Badge */}
          <Flex
            w={{ base: '300px', md: '300px' }}
            h={'auto'}
            aspectRatio={1 / 1.6}
            rounded={'xl'}
            bg={useColorModeValue('white', 'gray.700')}
            border={'2px solid'}
            borderColor={useColorModeValue('gray.300', 'gray.600')}
            p={8}
            align={'center'}
            flexDir={'column'}
            justify={'space-between'}
            flexGrow={1}
          >
            {/* Punch Hole */}
            <Flex
              h={'24px'}
              w={'24px'}
              px={12}
              rounded={'lg'}
              bg={useColorModeValue('white', 'gray.800')}
              border={'2px solid'}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              justifySelf={'center'}
            />
            {/* Avatar */}
            <Box
              w={{ base: '75%', md: '75%' }}
              h={'auto'}
              objectFit={'cover'}
              justifySelf={'center'}
              rounded={'lg'}
              overflow={'hidden'}
              border={'2px solid'}
              borderColor={useColorModeValue('gray.300', 'gray.600')}
              aspectRatio={1 / 1}
            >
              <Skeleton isLoaded={!!user}>
                <Avatar
                  src={user?.avatar}
                  borderRadius={0}
                  w={'100%'}
                  h={'auto'}
                />
              </Skeleton>
            </Box>
            {/* Name */}
            <Box
              mb={user?.platform.staff ? 4 : 8}
              w={'full'}
            >
              <Skeleton isLoaded={!!user}>
                <Text
                  as={'h1'}
                  fontSize={user?.displayName?.length > 16 ? '2xl' : '3xl'}
                  fontWeight={'900'}
                  textAlign={'center'}
                >
                  {user?.displayName}
                </Text>
              </Skeleton>
              <Skeleton isLoaded={!!user}>
                <Flex
                  flexDir={'column'}
                  align={'center'}
                  justify={'center'}
                >
                  <Text
                    as={'h2'}
                    size={'md'}
                    textAlign={'center'}
                  >
                    @{user?.username || 'useame'}
                  </Text>
                  {user?.platform.staff && (
                    <Flex align={'center'}>
                      <Icon
                        as={IoSparkles}
                        size={'xl'}
                        mr={1}
                      />
                      <Text
                        fontWeight={'900'}
                        textAlign={'center'}
                        zIndex={1}
                      >
                        {user?.platform.staffTitle || 'Staff Member'}
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Skeleton>
            </Box>
          </Flex>
        </Box>
        {/* User Bio */}
        <Box my={2}>
          <Box
            w={{ base: 'full', md: '384px' }}
            rounded={'lg'}
          >
            <Text
              as={'h1'}
              fontSize={'2xl'}
              fontWeight={'900'}
            >
              About Me
            </Text>
            <Skeleton isLoaded={!!user}>
              {!user?.bio ? (
                <Text
                  size={'md'}
                  color={'gray.500'}
                >
                  This user has not set a bio yet.
                </Text>
              ) : (
                // multi-line support
                user?.bio.split('\n').map((line: string, i: number) => (
                  <Text
                    size={'md'}
                    key={i}
                  >
                    {line}
                  </Text>
                ))
              )}
            </Skeleton>
          </Box>
        </Box>
        {/* User Linked Accounts */}
        {/* <Box my={4}>
          <Box
            rounded={'lg'}
            w={{ base: 'full', md: '384px' }}
          >
            <Text
              as={'h1'}
              fontSize={'2xl'}
              fontWeight={'900'}
            >
              Connected Accounts
            </Text>
            <Skeleton isLoaded={!!user}>
              <Wrap
                flexDir={'row'}
                w={'fit-content'}
              >
                {!user?.discord.verified && !user?.roblox.verified && (
                  <Text
                    size={'md'}
                    color={'gray.500'}
                  >
                    This user has not linked any accounts.
                  </Text>
                )}
                {user?.discord.verified && (
                  <WrapItem>
                    <Button
                      as={Link}
                      href={`https://discord.com/users/${user?.discord.id}`}
                      target="_blank"
                      size={'sm'}
                      variant={'ghost'}
                      style={{ textDecoration: 'none' }}
                    >
                      <Icon
                        as={BsDiscord}
                        size={'xl'}
                        mr={2}
                      />
                      <Text
                        size={'md'}
                        fontWeight={'900'}
                      >
                        @{user?.discord.username}
                        {user?.discord.discriminator && `#${user?.discord.discriminator}`}
                      </Text>
                    </Button>
                  </WrapItem>
                )}
                {user?.roblox.verified && (
                  <WrapItem>
                    <Button
                      as={Link}
                      href={`https://roblox.com/users/${user?.roblox.id}/user`}
                      target="_blank"
                      size={'sm'}
                      variant={'ghost'}
                      style={{ textDecoration: 'none' }}
                    >
                      <Icon
                        as={SiRoblox}
                        size={'xl'}
                        mr={2}
                      />
                      <Text
                        size={'md'}
                        fontWeight={'900'}
                      >
                        {user?.roblox.username}
                      </Text>
                    </Button>
                  </WrapItem>
                )}
              </Wrap>
            </Skeleton>
          </Box>
        </Box> */}
        <Flex py={4}>
          {/* Organizations */}
          <Box
            py={2}
            w={{ base: 'full', md: '320px' }}
            mr={{ base: 0, md: 16 }}
          >
            <Text
              as={'h1'}
              fontSize={'2xl'}
              fontWeight={'900'}
            >
              Organizations
            </Text>
            <Flex
              w={'full'}
              h={'fit-content'}
              flexDir={'column'}
              align={'flex-start'}
              justify={'flex-start'}
              flexGrow={1}
            >
              <Skeleton isLoaded={!!user}>
                {user?.organizations?.length ? (
                  <Wrap spacing={2} py={2}>
                    {user?.organizations?.map((org: Organization) => (
                      <Tooltip key={org.id} label={org.name}>
                        <WrapItem>
                          <OrganizationItem
                            organization={org}
                          />
                        </WrapItem>
                      </Tooltip>
                    ))}
                  </Wrap>
                ) : (
                  <Text
                    size={'md'}
                    color={'gray.500'}
                  >
                    This user is not in any organizations.
                  </Text>
                )}
              </Skeleton>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </>
  );
}
