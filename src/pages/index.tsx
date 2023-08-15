import Head from 'next/head';

import Home from '@/components/Home';
import Layout from '@/layouts/PublicLayout';

export default function Homepage() {
  return (
    <>
      <Head>
        <title>Restrafes XCS – Home</title>
        <meta
          property="og:title"
          content="Restrafes XCS – Home"
        />
        <meta
          property="og:site_name"
          content="Restrafes XCS"
        />
        <meta
          property="og:url"
          content="https://xcs.restrafes.co"
        />
        <meta
          property="og:description"
          content="Control your access points with ease."
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:image"
          content="/images/logo-square.jpeg"
        />
      </Head>
      <Home />
    </>
  );
}

Homepage.getLayout = (page: any) => <Layout>{page}</Layout>;
