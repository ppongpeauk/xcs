import { forwardRef } from 'react';

import { Text } from '@chakra-ui/react';

import { Noto_Sans_Mono } from 'next/font/google';

const codeFont = Noto_Sans_Mono({ subsets: ['latin'] });

export default function Code({ children, props }: { children: React.ReactNode; props?: any }) {
  return forwardRef(
    (
      { ...props }: any,
      ref // eslint-disable-line react/display-name
    ) => (
      <Text
        ref={ref}
        as={'code'}
        className={codeFont.className}
        {...props}
      >
        {children}
      </Text>
    )
  );
}
