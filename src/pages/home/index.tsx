import Layout from '@/layouts/LayoutPlatform';
import { Box, Container, Flex, Text, Title } from '@mantine/core';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Console Home - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Console Home - Restrafes XCS"
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
          content="/images/logo-square.jpg"
        />
      </Head>
      <Container
        size={'100%'}
        pt={24}
      >
        <Title order={1}>Console Home</Title>
        <Flex align={'center'}></Flex>
      </Container>
    </>
  );
}

Home.getLayout = (page: any) => <Layout>{page}</Layout>;
