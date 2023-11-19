import Footer from '@/components/Footer';
import Layout from '@/layouts/LayoutPublic';
import { Box, Container, Title, Anchor, ListItem, Text, Flex } from '@mantine/core';
import Head from 'next/head';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use - Restrafes XCS</title>
      </Head>
      <Container
        size={'md'}
        my={64}
      >
        <Title
          style={{ fontSize: '4rem', lineHeight: '4rem' }}
          mb={8}
        >
          Terms of Use
        </Title>
        <Flex
          direction={'column'}
          gap={8}
        >
          <Text pb={4}>
            These terms of use govern your use of the Restrafes XCS website, products, and services (collectively
            &quot;Services&quot;) available at <Anchor href="https://xcs.restrafes.co">xcs.restrafes.co</Anchor>. By
            accessing or using the Services, you agree to be bound by these terms. If you do not agree to these terms,
            do not access or use the Services.
          </Text>

          <Text>
            You must be at least 13 years old to use the Services. If you are under 18 years old, you may only use the
            Services with the consent of a parent or legal guardian.
          </Text>

          <Text>
            To access certain features and functions, you may be required to register and create an account. When you
            register, you agree to provide accurate and complete information about yourself. You are solely responsible
            for activity that occurs under your account. You must safeguard your account credentials and notify us
            immediately of any unauthorized use.
          </Text>

          <Text>
            The Services contain copyrighted material, trademarks and other proprietary information including text,
            software, photos, videos, graphics and logos. This intellectual property is owned by Restrafes XCS or its
            licensors and protected by copyright and other laws. All rights are reserved. You may not modify, publish,
            transmit, distribute, publicly perform or display, sell or create derivative works of such content.
          </Text>

          <Text>
            You agree not to use the Services for any unlawful purpose or in a manner inconsistent with these terms. You
            must comply with all applicable laws and regulations. You agree not to upload or transmit any content that
            infringes the rights of others. Any unauthorized or prohibited use may result in termination of your account
            and access to the Services.
          </Text>

          <Text>
            We reserve the right to terminate your account or access to the Services at any time without notice for any
            reason. You may cancel your account at any time by contacting us at{' '}
            <Anchor href="mailto:xcs@restrafes.co">xcs@restrafes.co</Anchor>. Upon any termination, your right to use
            the Services will immediately cease.
          </Text>

          <Text>
            THE SERVICES ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES,
            EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT.
          </Text>

          <Text>
            We reserve the right to modify these terms from time to time. Your continued use of the Services constitutes
            acceptance of any modifications. You should review these terms periodically for updates.
          </Text>

          <Text>
            These terms are governed by the laws of the State of Virginia without regard to conflict of law principles.
            Any dispute arising from these terms shall be resolved exclusively in the state or federal courts located in
            Virginia.
          </Text>

          <Text>
            These terms constitute the entire agreement between you and Restrafes XCS with respect to your use of the
            Services. They supersede any prior agreements.
          </Text>

          <Text>
            If you have any questions about these terms or the Services, please contact us at:{' '}
            <Anchor href="mailto:xcs@restrafes.co">xcs@restrafes.co</Anchor>
          </Text>
        </Flex>
      </Container>
    </>
  );
}

Terms.getLayout = (page: any) => <Layout>{page}</Layout>;
