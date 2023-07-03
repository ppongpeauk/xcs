import Layout from "@/layouts/PlatformLayout";
import { Container, Heading } from "@chakra-ui/react";
import Head from "next/head";

export default function PlatformHome() {
  return (
    <>
      <Head>
        <title>EVE XCS - Home</title>
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>
          Welcome to EVE XCS
        </Heading>
      </Container>
    </>
  );
}

PlatformHome.getLayout = (page: any) => <Layout>{page}</Layout>;
