import Layout from "@/layouts/PlatformLayout";
import { Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function PlatformEventLogs() {
  return (
    <>
      <Head>
        <title>EVE XCS – Event Logs</title>
        <meta property="og:title" content="EVE XCS - Event Logs" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.jpeg" />
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading pb={2}>Event Logs</Heading>
        <Text>Check back later.</Text>
      </Container>
    </>
  );
}

PlatformEventLogs.getLayout = (page: any) => <Layout>{page}</Layout>;
