// Next
import { Head, Html, Main, NextScript } from "next/document";

// Providers
import AuthProvider from "@/contexts/AuthContext";

// Chakra UI
import {
  ChakraProvider,
  ColorModeScript,
  useColorModeValue,
} from "@chakra-ui/react";

import theme from "@/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <body>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Head>
    </Html>
  );
}
