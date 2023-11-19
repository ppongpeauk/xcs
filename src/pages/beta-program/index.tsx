/*
 * Name: index.tsx
 * Author: Pete Pongpeauk <pete@ppkl.dev>
 *
 * Copyright (c) 2023 Pete Pongpeauk and contributors
 * License: MIT License
 */

import Head from 'next/head';
import Layout from '@/layouts/LayoutPublic';
import BetaProgram from '@/components/pages/landing-page/BetaProgram';

export default function BetaProgramPage() {
  return (
    <>
      <Head>
        <title>Beta Program - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Beta Program - Restrafes XCS"
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
          content="/images/logo-square.jpg"
        />
      </Head>
      <BetaProgram />
    </>
  );
}

BetaProgramPage.getLayout = (page: any) => <Layout>{page}</Layout>;
