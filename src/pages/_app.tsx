// React
import { useEffect } from 'react';

// Mantine UI
import {
  Button,
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
import '@mantine/charts/styles.css';

// Contexts
import { AuthProvider } from '@/contexts/AuthContext';

// Theme
import PageProgress from '@/components/PageProgress';
import { Familjen_Grotesk, Inter, Roboto_Flex } from 'next/font/google';

import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import NavAsideProvider from '@/contexts/NavAsideContext';

const font = Roboto_Flex({ subsets: ['latin'] });

const theme = createTheme({
  fontFamily: font.style.fontFamily,
  colors: {
    dark: ['#C1C2C5', '#A6A7AB', '#909296', '#5c5f66', '#373A40', '#2C2E33', '#25262b', '#1A1B1E', '#141517', '#101113']
  },
  components: {
    Divider: {
      defaultProps: {
        color: 'var(--mantine-color-default-border)'
      }
    },
    Modal: {
      defaultProps: {
        // transitionProps: { duration: 0 }
      }
    },
    Popover: {
      defaultProps: {
        // transitionProps: { duration: 0 }
      }
    }
  }
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
