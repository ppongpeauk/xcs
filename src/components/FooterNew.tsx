/* eslint-disable react-hooks/rules-of-hooks */
import { Anchor, Divider, Flex, Text } from '@mantine/core';

import NextLink from 'next/link';
import { BiGitBranch } from 'react-icons/bi';

export default function Footer({ type = 'platform' }: { type?: 'public' | 'platform' }) {
  return (
    <>
      <Flex
        component="footer"
        pos={'sticky'}
        top={0}
        direction={'column'}
        w={'100%'}
        h={'8rem'}
        p={4}
        align={'center'}
        justify={'center'}
        style={{
          backgroundColor: 'var(--mantine-color-default)',
          // border: '1px solid var(--mantine-color-default-border)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <Text>
          <Text
            component="strong"
            fw={'bold'}
          >
            © RESTRAFES & CO LLC.
          </Text>{' '}
          All rights reserved.
        </Text>
        <Flex
          align={'center'}
          justify={'center'}
          style={{
            textUnderlineOffset: '0.25rem'
          }}
        >
          <Anchor
            component={NextLink}
            href={'/legal/terms'}
            c="dark.2"
            size={'sm'}
          >
            Terms of Use
          </Anchor>
          <Divider
            orientation={'vertical'}
            mx={8}
            size={'xs'}
          />
          <Anchor
            component={NextLink}
            href={'/legal/privacy'}
            c="dark.2"
            size={'sm'}
          >
            Privacy Policy
          </Anchor>
        </Flex>
        <Flex
          color={'gray.500'}
          align={'center'}
          gap={4}
        >
          <BiGitBranch size={12} />{' '}
          <Text
            component={'span'}
            size={'sm'}
          >
            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'dev-mode'} (
            {process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || 'dev'})
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
