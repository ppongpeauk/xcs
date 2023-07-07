import Layout from "@/layouts/PlatformLayout";
import { Container, Heading } from "@chakra-ui/react";
import Head from "next/head";

import Table from "@/components/locations-table/render";

export default function PlatformHome() {
  return (
    <>
      <Head>
        <title>EVE XCS – Home</title>
        <meta property="og:title" content="EVE XCS - Platform Home" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.png" />
      </Head>
      <Container maxW={"full"} p={8}>
        <Heading>Welcome to EVE XCS</Heading>
        <Table />
      </Container>
    </>
  );
}

PlatformHome.getLayout = (page: any) => <Layout>{page}</Layout>;
