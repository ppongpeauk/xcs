import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { AlertDialog, Modal, defineStyle, defineStyleConfig, extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

const unselected = defineStyle({
  background: 'whiteAlpha.50',
  _hover: {
    background: 'whiteAlpha.300'
  },
  _active: {
    background: 'whiteAlpha.400'
  },
});


const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'dark'
};

Modal.defaultProps = {
  motionPreset: 'slideInBottom',
};

export const buttonTheme = defineStyleConfig({
  variants: { unselected }
});

const theme = {
  components: {
    Skeleton: {
      baseStyle: {
        borderRadius: 'lg'
      }
    },
    Button: buttonTheme,
    IconButton: buttonTheme,
  },
  fonts: {
    heading: 'var(--font-familjen)',
    body: 'var(--font-familjen)'
  },
  config
};

export default extendTheme(theme);
