import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import { forwardRef } from 'react';

export default function Terms() {
  return (
    <Container maxW={"container.md"} py={8}>
      <Heading as="h1" size="xl" mb={5}>
        Privacy Policy
      </Heading>

    </Container>
  )
}