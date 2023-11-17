import Footer from '@/components/Footer';
import Nav from '@/components/nav/NavNew';
import { Box } from '@chakra-ui/react';
import { useMantineColorScheme } from '@mantine/core';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Box>
      <Nav main={children} />
    </Box>
  );
}
