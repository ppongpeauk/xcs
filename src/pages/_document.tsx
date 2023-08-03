// Next
// Chakra UI
import { ChakraProvider, ColorModeScript, useColorModeValue } from '@chakra-ui/react';

import theme from '@/theme';
import { Head, Html, Main, NextScript } from 'next/document';

// Providers
import AuthProvider from '@/contexts/AuthContext';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/icons/icon-128x128.png" />
        <meta name="theme-color" content={"#000000"} />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
