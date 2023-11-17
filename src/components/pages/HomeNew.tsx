import {
  Anchor,
  Box,
  Button,
  Container,
  Flex,
  Image,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';

import moment from 'moment';
import NextImage from 'next/image';
import Link from 'next/link';
import Marquee from 'react-fast-marquee';
import { BsArrowRight } from 'react-icons/bs';
import Section from '../section';

import fragments from '@/assets/fragments.jpg';

export default function Home({ allPostsData: posts }: { allPostsData: any }) {
  const { colorScheme } = useMantineColorScheme();

  return (
    // New Bold Typography Design
    <>
      {/* alert */}
      <Flex
        h={64}
        style={{
          background: colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-dark-8)'
        }}
        align={'center'}
      >
        <Text
          c={'white'}
          mx={'auto'}
          px={16}
        >
          Registrations are now open for the beta program.{' '}
          <Anchor
            href={'/beta'}
            c={'inherit'}
            style={{
              textUnderlineOffset: '0.25rem',
              textDecoration: 'underline'
            }}
          >
            Learn more
          </Anchor>
        </Text>
      </Flex>
      <Container
        size={'xl'}
        py={64}
      >
        <Flex
          direction={'column'}
          w={{
            base: 'full',
            md: '66%',
            lg: '50%'
          }}
          mb={32}
          gap={8}
        >
          <Title
            fw={'normal'}
            style={{ fontSize: '4rem', lineHeight: '4rem' }}
          >
            Powering the future of access control.
          </Title>
          <Title
            order={3}
            mt={8}
            fw={'normal'}
          >
            Restrafes XCS is a new access control solution for buildings. It is designed to be simple, secure, and easy
            to use.
          </Title>
        </Flex>
        <Image
          alt="Hero Image"
          src={fragments.src}
          w={'full'}
          style={{
            aspectRatio: 2
          }}
        ></Image>
      </Container>
    </>
  );
}
