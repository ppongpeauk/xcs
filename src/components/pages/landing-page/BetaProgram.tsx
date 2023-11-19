import {
  Anchor,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Image,
  List,
  Paper,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme
} from '@mantine/core';

// images
import header from '@/assets/beta-program/header.jpeg';

import { useEffect, useState } from 'react';
import { IconArrowRight, IconExchange, IconExternalLink } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';

export default function BetaProgram() {
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    // New Bold Typography Design
    <>
      <Image
        alt="Hero Image"
        src={header.src}
        w={'full'}
        style={{
          aspectRatio: 6
        }}
      ></Image>
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
            XCS Beta Program
          </Title>
          <Title
            order={3}
            mt={8}
            fw={'normal'}
          >
            Join our beta program to get early access to XCS.
          </Title>
          {/* what-is */}
          <Paper
            mt={16}
            px={32}
            py={24}
            withBorder
          >
            <Title
              order={3}
              mb={4}
            >
              What is the XCS Beta Program?
            </Title>
            <Text>
              The XCS Beta Program is an opportunity for you to try out the latest features of XCS before they are
              released to the public. As a beta tester, you can help us shape the future of access control by providing
              feedback on new features and improvements.
            </Text>
          </Paper>
          {/* how to apply */}
          <Paper
            mt={16}
            px={32}
            py={24}
            withBorder
          >
            <Title
              order={3}
              mb={4}
            >
              How can I apply?
            </Title>
            <Text>
              Please get in touch with us via email at{' '}
              <Anchor
                href={'mailto:xcs@restrafes.co'}
                style={{
                  color: 'inherit',
                  textUnderlineOffset: '0.25rem',
                  textDecoration: 'underline'
                }}
              >
                xcs@restrafes.co
              </Anchor>
              .
            </Text>
            <Text>Include the following information in your email:</Text>
            <List
              mt={4}
              spacing={4}
            >
              <List.Item>
                <Text>Your name</Text>
              </List.Item>
              <List.Item>
                <Text>Your email address</Text>
              </List.Item>
              <List.Item>
                <Text>Your Discord username, if applicable</Text>
              </List.Item>
              <List.Item>
                <Text>How you plan to use XCS</Text>
              </List.Item>
              <List.Item>
                <Text>Information about your company, if applicable:</Text>
                <List>
                  <List.Item>
                    <Text>Company name</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Company website</Text>
                  </List.Item>
                  <List.Item>
                    <Text>Company size</Text>
                  </List.Item>
                </List>
              </List.Item>
            </List>
          </Paper>
        </Flex>
      </Container>
    </>
  );
}
