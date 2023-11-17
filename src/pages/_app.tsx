// React
import { useEffect } from 'react';

// Chakra UI
import '@/styles/globals.css';
// import theme from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';

// Mantine UI
import { ColorSchemeScript, MantineProvider, createTheme, useMantineColorScheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/notifications/styles.css';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';

// Theme
import PageProgress from '@/components/PageProgress';
import { DialogProvider } from '@/contexts/DialogContext';
import { Familjen_Grotesk } from 'next/font/google';

import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

const font = Familjen_Grotesk({ subsets: ['latin'] });

const theme = createTheme({
  fontFamily: font.style.fontFamily
});

function App({ Component, pageProps }: AppProps | any) {
  const getLayout = Component.getLayout || ((page: any) => page);

  return (
    <>
      {/* <ChakraProvider
        theme={theme}
        cssVarsRoot="body"
      > */}
      <ColorSchemeScript />
      <MantineProvider
        theme={theme}
        withCssVariables
      >
        <Notifications />
        <ModalsProvider>
          <AuthProvider>
            <DialogProvider>
              <PageProgress />
              {getLayout(<Component {...pageProps} />)}
            </DialogProvider>
          </AuthProvider>
        </ModalsProvider>
      </MantineProvider>
      {/* </ChakraProvider> */}
    </>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false
});
