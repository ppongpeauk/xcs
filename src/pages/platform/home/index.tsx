import { Suspense, useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Card, CardBody, CardFooter, CardHeader,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Stat,
  StatArrow,
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

import Head from 'next/head';

import { useAuthContext } from '@/contexts/AuthContext';
import { useDialogContext } from '@/contexts/DialogContext';

import Layout from '@/layouts/PlatformLayout';

function StatBox({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <Box
      borderRadius={'lg'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      p={4}
    >
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
        <StatHelpText>{helper}</StatHelpText>
      </Stat>
    </Box>
  );
}
export default function PlatformHome() {
  const { currentUser, user } = useAuthContext();
  const [stats, setStats] = useState({ total: 0, granted: 0, denied: 0 });
  const randomSubGreetings = [
    'Securing your facility starts here.',
    'Building trust through access.',
    'Managing access with ease.',
    'Security made simple.',
    'Where security meets flexibility.',
    'Take control of your entry points.',
    'Intelligent access management.',
    'Making security seamless.',
  ];

  const [randomSubGreeting, setRandomSubGreeting] = useState('');

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token: string) => {
      fetch('/api/v1/statistics/total-scans', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
        });
    });
  }, [user]);

  useEffect(() => {
    setRandomSubGreeting(randomSubGreetings[Math.floor(Math.random() * randomSubGreetings.length)]);
  }, []);

  return (
    <>
      <Head>
        <title>Restrafes XCS – Home</title>
        <meta
          property="og:title"
          content="Restrafes XCS - Platform Home"
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
      <Container
        maxW={'full'}
        p={8}
      >
        {/* Greeting */}
        <Box id={'greeting'}>
          <Skeleton isLoaded={!!currentUser}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={8}
              align={'center'}
              justify={{
                base: 'center',
                md: 'flex-start'
              }}
            >
              <Avatar
                size={'2xl'}
                src={currentUser?.avatar || ''}
              />
              <Box textAlign={{ base: 'center', md: 'left' }}>
                <Heading fontSize={'4xl'}>
                  Good {new Date().getHours() < 12 ? 'morning' : 'afternoon'},{' '}
                  {currentUser?.displayName || currentUser?.username}.
                </Heading>
                <Text
                  fontSize={'xl'}
                  color={'gray.500'}
                >
                  {randomSubGreeting}
                </Text>
              </Box>
            </Stack>
          </Skeleton>
          <Box py={8}>
            {/* Global Stats */}
            <Skeleton isLoaded={!!stats.total} w={'container.md'}>
              <Heading
                fontSize={'3xl'}
                my={4}
              >
                Global Statistics
              </Heading>
            </Skeleton>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              gap={{ base: '5', md: '6' }}
              maxW={'720px'}
            >
              <Skeleton isLoaded={!!stats.total}>
                {/* <Stat label={"Total"} value={`${stats.total} scans total`} /> */}
                <StatBox
                  label={'Total Scans'}
                  value={`${stats.total} scans`}
                  helper={'Since the beginning of time.'}
                />
              </Skeleton>
              <Skeleton isLoaded={!!stats.granted}>
                <StatBox
                  label={'Successful Scans'}
                  value={`${stats.granted} scan${stats.granted > 1 ? 's' : ''} (${Math.round(
                    (stats.granted / stats.total) * 100
                  )}%)`}
                  helper={'Scans that were successful.'}
                />
              </Skeleton>
              <Skeleton isLoaded={!!stats.denied}>
                <StatBox
                  label={'Failed Scans'}
                  value={`${stats.denied} scan${stats.denied > 1 ? 's' : ''} (${Math.round(
                    (stats.denied / stats.total) * 100
                  )}%)`}
                  helper={'Scans that were denied.'}
                />
              </Skeleton>
            </SimpleGrid>

            {/* Platform Announcements */}
            <Skeleton isLoaded w={'container.md'}>
              <Heading
                fontSize={'3xl'}
                my={4}
              >
                Announcements
              </Heading>
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing={4}
                align={'center'}
                justify={'space-between'}
              >
                <Flex w={"full"} h={"128px"} borderRadius={'lg'} border={'1px solid'} borderColor={useColorModeValue('gray.200', 'gray.700')} p={4}>
                  <Text fontSize={'2xl'} m={'auto'}>Coming soon!</Text>
                </Flex>
              </Stack>
            </Skeleton>
          </Box>
        </Box>
      </Container>
    </>
  );
}

PlatformHome.getLayout = (page: any) => <Layout>{page}</Layout>;
