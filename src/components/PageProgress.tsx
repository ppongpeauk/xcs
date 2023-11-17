// Chakra UI
import { useColorModeValue } from '@chakra-ui/react';

// Components
import NextNProgress from 'nextjs-progressbar';

export default function PageProgress() {
  return (
    <NextNProgress
      color={'var(--mantine-color-default-color)'}
      startPosition={0}
      // stopDelayMs={500}
      height={2}
      options={{
        showSpinner: false
      }}
      showOnShallow={false}
    />
  );
}
