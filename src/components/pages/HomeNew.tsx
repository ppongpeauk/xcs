import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
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

// images
import fragments from '@/assets/front-page/fragments.jpg';

import { useEffect, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';

export default function Home({ allPostsData: posts }: { allPostsData: any }) {
  const { colorScheme } = useMantineColorScheme();
  const [bg, setBG] = useState('var(--mantine-color-dark-6)');

  useEffect(() => {
    console.log(colorScheme);
    setBG(colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-dark-8)');
  }, [colorScheme]);

  return (
    // New Bold Typography Design
    <>
      {/* alert */}
      <Flex
        h={64}
        style={{
          background: bg
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
        <Divider my={64} />
        <Flex
          direction={{
            base: 'column',
            md: 'row'
          }}
          align={'center'}
          justify={'space-between'}
          gap={16}
        >
          <Flex
            direction={'column'}
            gap={4}
          >
            <Title order={1}>Get started today.</Title>
            <Title
              order={4}
              fw={'normal'}
            >
              Restrafes XCS is currently in beta. We are currently accepting applications for the beta program.
            </Title>
          </Flex>
          <Flex direction={'column'}>
            <Button
              variant={'outline'}
              size="lg"
              color={colorScheme === 'dark' ? 'gray' : 'black'}
              rightSection={<IconArrowRight />}
            >
              Apply for beta
            </Button>
          </Flex>
        </Flex>
      </Container>
    </>
  );
}
