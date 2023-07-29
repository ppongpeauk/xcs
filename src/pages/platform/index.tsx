import { useAuthContext } from "@/contexts/AuthContext";
import Layout from "@/layouts/PlatformLayout";
import { Container, Heading } from "@chakra-ui/react";
import Head from "next/head";
export default function PlatformIndex() {
  const { currentUser } = useAuthContext();

  return (
    <>
      <Head>
        <title>Restrafes XCS – Platform Index</title>
      </Head>
      <Container maxW={"full"} p={8}>

      </Container>
    </>
  );
}

PlatformIndex.getLayout = (page: any) => <Layout>{page}</Layout>;
