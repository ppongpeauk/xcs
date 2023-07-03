import Layout from "@/layouts/PlatformLayout";
import { Container, Heading } from "@chakra-ui/react";
import Head from "next/head";

export default function PlatformIndex() {
  return (
    <>
      <Head>
        <title>EVE XCS - Platform Index</title>
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>
          Welcome to EVE XCS
        </Heading>
      </Container>
    </>
  );
}

PlatformIndex.getLayout = (page: any) => <Layout>{page}</Layout>;
