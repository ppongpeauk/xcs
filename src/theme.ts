import { type ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'dark'
};

const theme = {
  components: {
    Skeleton: {
      baseStyle: {
        borderRadius: 'lg'
      }
    }
  },
  fonts: {
    heading: 'var(--font-familjen)',
    body: 'var(--font-familjen)'
  },
  config
};

export default extendTheme(theme);
