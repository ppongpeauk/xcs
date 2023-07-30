import { Box, Divider, Flex, Image, Link, Spacer, Text, useColorModeValue } from '@chakra-ui/react';

import NextLink from 'next/link';

import ThemeButton from './ThemeButton';

export default function Footer() {
  return (
    <>
      <Flex
        as="footer"
        position={'sticky'}
        top={0}
        flexDir={'column'}
        w={'100%'}
        h={'7rem'}
        border={'1px solid'}
        borderLeft={{ base: '1px solid', md: 'unset' }}
        borderColor={useColorModeValue('gray.300', 'gray.700')}
        p={4}
        zIndex={50}
        align={'center'}
        justify={'center'}
      >
        <Text>
          <Text
            as={'span'}
            fontWeight={'bold'}
            letterSpacing={'tighter'}
          >
            © RESTRAFES & CO LLC.
          </Text>{' '}
          All rights reserved.
        </Text>
        <Flex align={'center'} justify={'center'}>
          <Link
            as={NextLink}
            href={'/legal/terms'}
            fontSize={'sm'}
          >
            Terms of Use
          </Link>
          <Divider
            orientation={'vertical'}
            mx={2}
            h={'1rem'}
            borderColor={useColorModeValue('gray.300', 'gray.700')}
          />
          <Link
            as={NextLink}
            href={'/legal/privacy'}
            fontSize={'sm'}
          >
            Privacy Policy
          </Link>
        </Flex>
        <Text
          color={'gray.400'}
          fontSize={'xs'}
          letterSpacing={'tighter'}
        >
          Commit: {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev'} (
          {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || 'dev'})
        </Text>
      </Flex>
    </>
  );
}
