/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react';

import { Link } from '@chakra-ui/next-js';

import { useAuthContext } from '@/contexts/AuthContext';
import { Invitation } from '@/types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FiArrowRight } from 'react-icons/fi';
import {
  Avatar,
  Button,
  Card,
  Center,
  Flex,
  Group,
  Image,
  Loader,
  Stack,
  Text,
  Title,
  useMantineColorScheme
} from '@mantine/core';
import Footer from './FooterNew';

export default function Invitation({ invite, errorMessage }: { invite: Invitation; errorMessage: string | null }) {
  const { query, push } = useRouter();
  const [isAcceptLoading, setIsAcceptLoading] = useState<boolean>(false);
  const { user, currentUser } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);

  let { id: queryId } = query;
  const id = queryId?.length ? queryId[0] : null;

  useEffect(() => {
    setLoading(false);
  }, [user]);

  const acceptInvite = async () => {
    setIsAcceptLoading(true);
    if (invite.type === 'organization') {
      push(`/organizations/?invitation=${query.id}`);
    } else if (invite.type === 'xcs') {
      push(`/auth/activate/${query.id}`);
    }
  };

  return (
    <>
      <Head>
        <title>Invitation - Restrafes XCS</title>
      </Head>
      <Flex
        w={'100%'}
        mih={'100dvh'}
        direction={'column'}
        align={'center'}
        justify={'center'}
        gap={16}
        p={16}
      >
        <Card
          w={{ base: '100%', sm: 480 }}
          mih={320}
          h={'fit-content'}
          p={0}
          px={16}
          radius={'lg'}
          withBorder
        >
          <Flex
            align={'center'}
            justify={'center'}
            w={'100%'}
            h={'100%'}
            style={{
              flexGrow: 1
            }}
          >
            {loading ? (
              <Loader
                size={24}
                color="var(--mantine-color-default-color)"
              />
            ) : (
              <>
                {invite.type === 'organization' ? (
                  <InvitationOrganization
                    invite={invite}
                    acceptInvite={acceptInvite}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </Flex>
        </Card>
        {/* upsell card */}
        {/* <Card
          w={{ base: '100%', sm: 480 }}
          mih={200}
          p={0}
          px={16}
          radius={'lg'}
          withBorder
        ></Card> */}
      </Flex>
      <Footer />
    </>
  );
}

function InvitationOrganization({ invite, acceptInvite }: { invite: Invitation; acceptInvite: () => void }) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Flex
        h={'100%'}
        direction={'column'}
        px={16}
        py={32}
      >
        <Center>
          <Image
            src={colorScheme === 'dark' ? '/images/logo-white.png' : '/images/logo-black.png'}
            alt={'R&C Logo'}
            w={128}
            style={{
              objectFit: 'contain'
            }}
            mb={16}
          />
        </Center>
        <Text
          size="lg"
          fw={'normal'}
          style={{
            textAlign: 'center'
          }}
        >
          You&apos;ve been invited to join{' '}
          <Text
            component="span"
            fw={'bold'}
          >
            {invite.organization?.name}
          </Text>{' '}
        </Text>
        {/* main icon */}
        <Center
          w={'100%'}
          py={16}
        >
          <Image
            src={invite.organization?.avatar}
            alt={'Invitation Creator Avatar'}
            w={160}
            h={160}
            radius={'md'}
          />
        </Center>
        {/* user info */}
        <Card
          radius={'md'}
          p={16}
          mb={16}
          withBorder
        >
          <Flex
            gap={16}
            align={'center'}
          >
            <Avatar
              src={invite.creator?.avatar}
              alt={'Invitation Creator Avatar'}
              size={'lg'}
              radius={'100%'}
            />
            <Stack gap={0}>
              <Text
                size="md"
                fw={'bold'}
              >
                Invitation by {invite.creator?.displayName}
                <Text component="span"> @{invite.creator?.username}</Text>
              </Text>
            </Stack>
          </Flex>
        </Card>
        <Button
          onClick={acceptInvite}
          variant={'default'}
          w={'100%'}
        >
          Accept Invitation
        </Button>
      </Flex>
    </>
  );
}
