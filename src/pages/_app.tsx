// Next
import type { AppProps } from "next/app";

// Chakra UI
import { ChakraProvider, ColorModeScript, useColorModeValue } from "@chakra-ui/react";

// Theme
import PageProgress from "@/components/PageProgress";
import theme from "./theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider>
        <PageProgress />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
