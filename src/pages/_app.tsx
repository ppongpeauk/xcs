// React
import { useEffect } from 'react';

// Chakra UI
import '@/styles/globals.css';
import theme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';

// Mantine UI
import '@mantine/code-highlight/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';

// Theme
import PageProgress from '@/components/PageProgress';
import { DialogProvider } from '@/contexts/DialogContext';
import { Familjen_Grotesk } from 'next/font/google';

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
        <MantineProvider theme={createTheme({})}>
          <AuthProvider>
            <DialogProvider>
              <PageProgress />
              {getLayout(<Component {...pageProps} />)}
            </DialogProvider>
          </AuthProvider>
        </MantineProvider>
      </ChakraProvider>
    </>
  );
}
