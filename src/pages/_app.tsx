// Next
// Chakra UI
import { ChakraProvider } from '@chakra-ui/react';

import '@/styles/globals.css';
import theme from '@/theme';
import { Archivo, Commissioner, Familjen_Grotesk, Karla, Lexend, Overpass, Public_Sans, Sen } from 'next/font/google';

import { AuthProvider } from '@/contexts/AuthContext';

// Theme
import PageProgress from '@/components/PageProgress';
import { DialogProvider } from '@/contexts/DialogContext';

const font = Familjen_Grotesk({ subsets: ['latin'] });

export default function App({ Component, pageProps }: any) {
  const getLayout = Component.getLayout || ((page: any) => page);

  return (
    <>
      <style
        jsx
        global
      >
        {`
          :root {
            --font-main: ${font.style.fontFamily};
          }
        `}
      </style>
      <ChakraProvider
        theme={theme}
        cssVarsRoot="body"
      >
        <AuthProvider>
          <DialogProvider>
            <PageProgress />
            {getLayout(<Component {...pageProps} />)}
          </DialogProvider>
        </AuthProvider>
      </ChakraProvider>
    </>
  );
}
