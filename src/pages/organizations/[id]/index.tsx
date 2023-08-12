import { TooltipAvatar } from '@/components/TooltipAvatar';
import { useAuthContext } from '@/contexts/AuthContext';
import Layout from '@/layouts/PlatformLayout';
import { Organization } from '@/types';
import {
  Link
} from '@chakra-ui/next-js';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Text,
  Tooltip,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';

export default function OrganizationPublic() {
  const { query, push } = useRouter();
  const toast = useToast();
  const { user } = useAuthContext();
  const [organization, setOrganization] = useState<any>();

  let refreshData = useCallback(async () => {
    await user.getIdToken().then((token: string) => {
      fetch(`/api/v1/organizations/${query.id}/public`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          switch (res.status) {
            case 404:
              throw new Error('Organization not found.');
            case 403:
              throw new Error('You do not have permission to view this organization.');
            case 401:
              throw new Error('You do not have permission to view this organization.');
            case 500:
              throw new Error('An internal server error occurred.');
            default:
              throw new Error('An unknown error occurred.');
          }
        })
        .then((data) => {
          setOrganization(data.organization);
        })
        .catch((err) => {
          toast({
            title: 'There was an error fetching the organization.',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        });
    });
  }, [user, query, toast]);

  useEffect(() => {
    if (!query.id) return;
    if (!user) return;
    refreshData();
  }, [query, user, refreshData]);

  return (
    <>
      <Head>
        <title>Restrafes XCS – {organization?.name}</title>
        <meta
          property="og:title"
          content="Restrafes XCS - Manage Organization"
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
      <Container maxW="full" p={8}>
        <Flex flexDir={'row'} align={'center'} gap={8} pb={4}>
          <Skeleton isLoaded={!!organization}>
            <Avatar
              name={organization?.name}
              src={organization?.avatar || '/images/default-avatar.png'}
              boxSize={{ base: '6rem', md: '10rem' }}
              borderRadius={'lg'}
              overflow={'hidden'}
            />
          </Skeleton>
          <Flex flexDir={'column'}>
            <Skeleton isLoaded={!!organization}>
              <Text
                as={'h1'}
                fontSize={{ base: '2xl', md: '4xl' }}
                fontWeight={'900'}
                lineHeight={0.9}
              >
                {organization?.name || 'Organization Name'}
              </Text>
            </Skeleton>
            <Skeleton
              isLoaded={!!organization}
              my={2}
            >
              <Text
                fontSize={'md'}
                fontWeight={'500'}
                color={'gray.500'}
              >
                Owned by{' '}
                <Link
                  textUnderlineOffset={4}
                  href={`/@${organization?.owner?.username}`}
                >
                  {organization?.owner?.displayName || 'Organization Owner'}
                </Link>
              </Text>
            </Skeleton>
            <Skeleton
              isLoaded={!!organization}
            >
              <AvatarGroup
                size={'md'}
                max={4}
              >
                <TooltipAvatar
                  name={organization?.owner?.displayName}
                  as={Link}
                  key={organization?.owner?.id}
                  href={`/@${organization?.owner?.username}`}
                  src={organization?.owner?.avatar}
                />
                {organization?.members
                  .filter((member: any) => member.type !== 'roblox-group')
                  .map(
                    (member: any) =>
                      member.id !== organization?.owner?.id &&
                      (!member.type.startsWith('roblox') ? (
                        <TooltipAvatar
                          name={member?.name}
                          as={Link}
                          key={member?.id}
                          href={`/@${member?.username}`}
                          src={member?.avatar}
                          bg={'gray.300'}
                        />
                      ) : member.type === 'roblox' ? (
                        <TooltipAvatar
                          name={`${member?.displayName} (${member?.username})`}
                          as={Link}
                          key={member?.id}
                          href={`https://www.roblox.com/users/${member?.id}/profile`}
                          src={member?.avatar}
                          bg={'gray.300'}
                          target={'_blank'}
                        />
                      ) : (
                        <>
                          <TooltipAvatar
                            name={member?.displayName}
                            as={Link}
                            key={member?.id}
                            href={`https://www.roblox.com/groups/${member?.id}/group`}
                            src={member?.avatar}
                            bg={'gray.300'}
                            target={'_blank'}
                          />
                        </>
                      ))
                  )}
              </AvatarGroup>
            </Skeleton>
          </Flex>
        </Flex>
        <Flex flexDir={'column'} justify={'center'} py={2} w={'fit-content'}>
          {
            organization?.canEdit &&
            <>
              {/* <Text as={'h2'} fontSize={'md'} fontWeight={'bold'} mb={2}>
                Actions
              </Text> */}
              <Button
                leftIcon={<Icon as={AiFillSetting} />}
                onClick={() => push(`/organizations/${query.id}/settings`)}
              >
                Edit Organization
              </Button>
            </>
          }
        </Flex>
        <Skeleton isLoaded={!!organization} maxW={'container.md'} py={4}>
          <Flex flexDir={'column'} p={8} border={'1px solid'} borderColor={useColorModeValue('gray.200', 'gray.700')} borderRadius={'lg'}>
            <Heading as={'h2'} fontSize={'2xl'} fontWeight={'900'} mb={2}>
              About {organization?.name}
            </Heading>
            <Text variant={'subtext'}>
              {organization?.description ? (
                organization?.description.split('\n').map((line: string, i: number) => (
                  <Text
                    key={i}
                  >
                    {line}
                  </Text>
                ))
              ) : 'No description available.'}
            </Text>
          </Flex>
        </Skeleton>
      </Container>
    </>
  )
}

OrganizationPublic.getLayout = (page: any) => <Layout>{page}</Layout>;