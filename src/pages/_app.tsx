// Next
import type { AppProps } from "next/app";

// Chakra UI
import {
  ChakraProvider,
  ColorModeScript,
  useColorModeValue,
} from "@chakra-ui/react";

import { AuthProvider } from "@/contexts/AuthContext";

// Theme
import PageProgress from "@/components/PageProgress";
import theme from "@/theme";
import { NextPage } from "next";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

export default function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page)

  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <ChakraProvider>
          <PageProgress />
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </AuthProvider>
    </>
  );
}
