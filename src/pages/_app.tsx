// React
import { useEffect } from 'react';

// Mantine UI
import {
  ColorSchemeScript,
  MantineProvider,
  MantineThemeProvider,
  createTheme,
  useMantineColorScheme
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';

// Theme
import PageProgress from '@/components/PageProgress';
import { Familjen_Grotesk } from 'next/font/google';

import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NavAsideProvider from '@/contexts/NavAsideContext';
import { ChakraProvider } from '@chakra-ui/react';

const font = Familjen_Grotesk({ subsets: ['latin'] });

const theme = createTheme({
  fontFamily: font.style.fontFamily
});

function App({ Component, pageProps }: AppProps | any) {
  const getLayout = Component.getLayout || ((page: any) => page);

  return (
    <>
      <ColorSchemeScript />
      {/* <ChakraProvider> */}
      <MantineProvider
        theme={theme}
        withCssVariables
        classNamesPrefix="xcs"
      >
        <Notifications />
        <NavAsideProvider>
          <ModalsProvider>
            <AuthProvider>
              <PageProgress />
              {getLayout(<Component {...pageProps} />)}
            </AuthProvider>
          </ModalsProvider>
        </NavAsideProvider>
      </MantineProvider>
      {/* </ChakraProvider> */}
    </>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false
});
