import Layout from "@/layouts/PlatformLayout";
import { Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";

export default function PlatformEventLogs() {
  return (
    <>
      <Head>
        <title>EVE XCS - Event Logs</title>
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading pb={2}>Event Logs</Heading>
        <Text>Check back later.</Text>
      </Container>
    </>
  );
}

PlatformEventLogs.getLayout = (page: any) => <Layout>{page}</Layout>;
