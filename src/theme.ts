import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { AlertDialog, Modal, defineStyle, defineStyleConfig, extendTheme, useColorMode, type ThemeConfig } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

// styles

const unselected = defineStyle({
  background: 'gray.50',
  _hover: {
    background: 'gray.100'
  },
  _active: {
    background: 'gray.200'
  },
  _dark: {
    background: 'whiteAlpha.50',
    _hover: {
      background: 'whiteAlpha.300'
    },
    _active: {
      background: 'whiteAlpha.400'
    },
  }
});

const subtext = defineStyle({
  color: 'gray.500',
  _dark: {
    color: 'gray.400'
  }
});

const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: 'dark'
};

Modal.defaultProps = {
  motionPreset: 'slideInBottom',
};

export const buttonTheme = defineStyleConfig({
  variants: { unselected },
  baseStyle: {
    textDecor: 'none !important'
  }
});

export const textTheme = defineStyleConfig({
  variants: { subtext }
});

const theme = {
  components: {
    FormHelperText: {
      baseStyle: {
        color: 'gray.500',
        _dark: {
          color: 'gray.400'
        }
      }
    },
    Skeleton: {
      baseStyle: {
        borderRadius: 'lg'
      }
    },
    Text: textTheme,
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
