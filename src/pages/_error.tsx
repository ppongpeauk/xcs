// Components
import { NextPageContext } from 'next';

import Error from '@/components/Error';
import Footer from '@/components/Footer';
import NavNew from '@/components/nav/NavNew';
import Layout from '@/layouts/PublicLayout';
import { Center, Container, Flex, Overlay, Text, Title } from '@mantine/core';

function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <>
      <Center
        style={{
          justifySelf: 'center',
          alignSelf: 'center'
        }}
        h={'calc(100vh - 128px)'}
      >
        <Title
          order={1}
          style={{
            fontSize: '24rem',
            fontWeight: 900
          }}
          c={'var(--mantine-color-default-border)'}
        >
          {statusCode}
        </Title>
        <Overlay
          mt={64}
          fixed={false}
          zIndex={2}
          bg={'transparent'}
          component={Flex}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Title>{statusCode === 404 ? 'Page not found.' : 'An error occurred'}</Title>
        </Overlay>
      </Center>
    </>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

ErrorPage.getLayout = (page: any) => <Layout>{page}</Layout>;

export default ErrorPage;
