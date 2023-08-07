import Layout from '@/layouts/PlatformLayout';
import {
  Link
} from '@chakra-ui/next-js';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function OrganizationPublic() {
  const { query, push } = useRouter();

  // TODO: public page
  useEffect(() => {
    push(`/platform/organizations/${query.id}/edit`);
  }, []);

  return (
    <>
      <Container maxW="container.lg" py={8}>
        <Heading as="h1" size="xl">Public Page</Heading>
        <Box p={4}>
          <Button as={Link} href={`/platform/organizations/${query.id}/edit`} colorScheme="blue">Edit Organization</Button>
        </Box>
      </Container>
    </>
  )
}

OrganizationPublic.getLayout = (page: any) => <Layout>{page}</Layout>;