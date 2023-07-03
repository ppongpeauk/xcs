// Next
import type { AppProps } from "next/app";

// Chakra UI
import { ChakraProvider, ColorModeScript, useColorModeValue } from "@chakra-ui/react";

// Theme
import PageProgress from "@/components/PageProgress";
import theme from "./theme";

import { Golos_Text } from "next/font/google";
const font = Golos_Text({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <main className={font.className}>
      <ChakraProvider>
        <PageProgress />
        <Component {...pageProps} />
      </ChakraProvider>
      </main>
    </>
  );
}
