import { Container, Heading, Text } from '@chakra-ui/react';

import Head from 'next/head';

import Layout from '@/layouts/PlatformLayout';

export default function PlatformEventLogs() {
  return (
    <>
      <Head>
        <title>Restrafes XCS – Event Logs</title>
        <meta
          property="og:title"
          content="Restrafes XCS - Event Logs"
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
        <Text
          fontSize={'4xl'}
          fontWeight={'900'}
        >
          Event Logs
        </Text>
        <Text
          fontSize={'xl'}
          fontWeight={'500'}
        >
          Check back later.
        </Text>
      </Container>
    </>
  );
}

PlatformEventLogs.getLayout = (page: any) => <Layout>{page}</Layout>;
