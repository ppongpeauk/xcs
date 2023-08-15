import { TooltipAvatar } from '@/components/TooltipAvatar';
import { useAuthContext } from '@/contexts/AuthContext';
import Layout from '@/layouts/PlatformLayout';
import { Organization, OrganizationMember } from '@/types';
import {
  Link
} from '@chakra-ui/next-js';
import {
  Avatar,
  AvatarGroup,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Skeleton,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { VscVerifiedFilled } from 'react-icons/vsc';

const memberTypeOrder = ['user', 'roblox', 'roblox-group', 'card'];

// export async function getServerSideProps({ params, req, res }: any) {
//   const id = params.id;
//   if (!id) return { notFound: true };

//   // fetch organization data
//   const data = await fetch(`${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/organizations/${id}/public`);
//   if (data.status === 404) return { notFound: true };
//   if (data.status !== 200) {
//     res.statusCode = data.status;
//     return { props: {} };
//   }
//   const organization: Organization = await data.json();
//   return { props: organization };
// }
export default function OrganizationPublic() {
  const { query, push } = useRouter();
  const toast = useToast();
  const { user } = useAuthContext();
  const [organization, setOrganization] = useState<Organization>();

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
          content={`Restrafes XCS - ${organization?.name}`}
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
            >
            </Avatar>
          </Skeleton>
          <Flex flexDir={'column'}>
            <Skeleton as={Flex} isLoaded={!!organization} flexDir={'row'} align={'center'}>
              <Text
                as={Flex}
                fontSize={{ base: '2xl', md: '4xl' }}
                fontWeight={'bold'}
                lineHeight={0.9}
              >
                {organization?.name || 'Organization Name'}
              </Text>
              {
                organization?.verified &&

                <Icon
                  as={VscVerifiedFilled}
                  color={'gold'}
                  boxSize={'1.5em'}
                  ml={2}
                />
              }
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
                  src={organization?.owner?.avatar || '/images/default-avatar.png'}
                />
                {Object.values(organization?.members || {})
                  .filter((member: OrganizationMember) => ['user'].includes(member.type))
                  .sort((a: OrganizationMember, b: OrganizationMember) => ((memberTypeOrder.indexOf(a.type) - a.role) - (memberTypeOrder.indexOf(b.type) - b.role)))
                  .map(
                    (member: OrganizationMember) =>
                      member.id !== organization?.owner?.id &&
                      (!member.type.startsWith('roblox') ? (
                        <TooltipAvatar
                          name={member?.displayName}
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
        {
          organization?.canEdit &&
          <>
            <Flex align={'center'} w={'fit-content'}>
              <Skeleton as={Flex} isLoaded={!!organization} py={1} gap={4} flexDir={{ base: 'column', md: 'row' }}>
                <Button
                  leftIcon={<Icon as={AiFillSetting} />}
                  onClick={() => push(`/organizations/${query.id}/settings`)}
                >
                  Manage Organization
                </Button>
              </Skeleton>
            </Flex>
          </>
        }
        <Skeleton isLoaded={!!organization} maxW={'container.sm'} my={4}>
          <Flex flexDir={'column'} p={8} border={'1px solid'} borderColor={useColorModeValue('gray.200', 'gray.700')} borderRadius={'lg'} gap={1}>
            <Heading as={'h2'} fontSize={'2xl'} fontWeight={'900'}>
              About {organization?.name}
            </Heading>
            <Text color={'gray.500'}>
              Created on {new Date(organization?.createdAt || 0).toLocaleDateString()}
              {' • '}
              {Object.values(organization?.members || {}).filter((member: OrganizationMember) => member.type === 'user').length} member{Object.values(organization?.members || {}).filter((member: OrganizationMember) => member.type === 'user').length !== 1 && 's'}
              {' • '}
              {organization?.statistics?.numLocations} location{organization?.statistics?.numLocations !== 1 && 's'}
            </Text>
            <Text variant={!organization?.description ? 'subtext' : 'unset'}>
              {organization?.description ? (
                organization?.description.split('\n').map((line: string, i: number) => (
                  <Text
                    key={i}
                  >
                    {line}
                  </Text>
                ))
              ) : 'This organization has not set a bio yet.'}
            </Text>
          </Flex>
        </Skeleton>
      </Container >
    </>
  )
}

OrganizationPublic.getLayout = (page: any) => <Layout>{page}</Layout>;