/* eslint-disable react-hooks/rules-of-hooks */
// React
import { Suspense, forwardRef, useMemo, useState } from 'react';
import { Link } from '@chakra-ui/next-js';
import dynamic from 'next/dynamic';

import { Flex, Image, Button, rem, useMantineColorScheme, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Components
import { IconArrowUpRight, IconMoonFilled, IconSunFilled } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import Footer from '../FooterNew';

export default function Nav({ main }: { main: React.ReactNode }) {
  const { push } = useRouter();
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <AppShell
        header={{ height: 64 }}
        padding="md"
        zIndex={5}
      >
        <AppShell.Header px={'md'}>
          <Flex
            direction={'row'}
            align={'center'}
            h={'100%'}
          >
            {/* Logo */}
            <NextLink
              href={'/'}
              style={{ marginRight: 'auto' }}
            >
              <Flex
                display={{ base: 'flex', md: 'flex' }}
                w={'128px'}
                h={'100%'}
                align={'center'}
                justify={'center'}
              >
                <Image
                  src={colorScheme === 'dark' ? '/images/logo-white.png' : '/images/logo-black.png'}
                  alt={'Restrafes XCS'}
                  maw={'128px'}
                  p={rem(16)}
                  style={{
                    objectFit: 'contain'
                  }}
                />
              </Flex>
            </NextLink>

            {/* navigation */}
            <Flex gap={16}>
              {/* buttons */}
              <Button
                component={NextLink}
                href={'/'}
                variant={'transparent'}
                color={colorScheme === 'dark' ? 'gray' : 'black'}
                px={0}
              >
                Home
              </Button>

              <Button
                component={NextLink}
                href={'/#features'}
                variant={'transparent'}
                color={colorScheme === 'dark' ? 'gray' : 'black'}
                px={0}
              >
                Features
              </Button>

              <Button
                component={NextLink}
                href={'/beta-program'}
                variant={'transparent'}
                color={colorScheme === 'dark' ? 'gray' : 'black'}
                px={0}
              >
                Beta Program
              </Button>

              <Button
                component={NextLink}
                href={'/auth/login'}
                variant="outline"
                color={colorScheme === 'dark' ? 'gray' : 'black'}
                rightSection={<IconArrowUpRight size={16} />}
              >
                Access Platform
              </Button>

              {/* theme toggle */}
              <ThemeToggle />
            </Flex>
          </Flex>
        </AppShell.Header>

        <AppShell.Main
          py={0}
          px={0}
          pt={64}
        >
          {main}
        </AppShell.Main>

        <AppShell.Footer pos={'relative'}>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}

function ThemeToggle() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  return (
    <Button
      variant={'outline'}
      color={colorScheme === 'dark' ? 'gray' : 'black'}
      onClick={() => {
        toggleColorScheme();
        setIsDark(!isDark);
      }}
      px={0}
      style={{
        aspectRatio: 1
      }}
    >
      {isDark ? <IconSunFilled size={16} /> : <IconMoonFilled size={16} />}
    </Button>
  );
}
