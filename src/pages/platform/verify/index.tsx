// Components
import { Container, Heading, Text } from "@chakra-ui/react";
import Head from "next/head";

// Layouts
import Layout from "@/layouts/PlatformLayout";

export default function Verify() {
  return (
    <>
      <Head>
        <title>EVE XCS - Verification</title>
      </Head>
      <Container maxW="container.xl" pt={8}>
        <Text as={"h1"} fontSize={"4xl"} fontWeight={"bold"}>
          Verify Roblox Account
        </Text>
        
      </Container>
    </>
  );
}

Verify.getLayout = (page: any) => <Layout>{page}</Layout>;
