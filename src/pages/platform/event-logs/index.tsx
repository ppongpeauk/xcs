import Layout from "@/layouts/PlatformLayout";
import { Container, Heading } from "@chakra-ui/react";
import Head from "next/head";

export default function PlatformEventLogs() {
  return (
    <>
      <Head>
        <title>EVE XCS - Event Logs</title>
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>
          Event Logs
        </Heading>
      </Container>
    </>
  );
}

PlatformEventLogs.getLayout = (page: any) => <Layout>{page}</Layout>;
