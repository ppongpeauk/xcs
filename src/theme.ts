import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { AlertDialog, Modal, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'dark'
};

Modal.defaultProps = {
  motionPreset: 'slideInBottom',
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
