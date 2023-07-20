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
import "@/styles/globals.css";
import theme from "@/theme";
import { NextPage } from "next";
import {
  Exo,
  Familjen_Grotesk,
  Roboto_Flex,
  Signika,
  Sora,
} from "next/font/google";
const font = Familjen_Grotesk({ subsets: ["latin"] });

export default function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);

  return (
    <>
      <style jsx global>
        {`
          :root {
            --font-familjen: ${font.style.fontFamily};
          }
        `}
      </style>
      <ChakraProvider theme={theme} cssVarsRoot="body">
        <AuthProvider>
          <PageProgress />
          {getLayout(<Component {...pageProps} />)}
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
