/* eslint-disable react-hooks/rules-of-hooks */
// React
import { Suspense, forwardRef, useMemo, useState } from 'react';

import { Link } from '@chakra-ui/next-js';

import {
  Flex,
  Image,
  Popover,
  Menu,
  Divider,
  Button,
  Text,
  Avatar,
  Badge,
  UnstyledButton,
  rem,
  CopyButton,
  ActionIcon,
  useMantineColorScheme,
  Indicator,
  Title,
  SegmentedControl,
  Paper,
  AppShell,
  Burger,
  Radio,
  useComputedColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Components
import DeleteDialog from '@/components/DeleteDialog';
import ThemeButton from '@/components/ThemeButton';
import { User } from '@/types';
import {
  IconActivity,
  IconBell,
  IconBuildingArch,
  IconCaretDown,
  IconCaretDownFilled,
  IconCaretUp,
  IconCaretUpFilled,
  IconCheck,
  IconChecklist,
  IconChevronCompactDown,
  IconChevronDown,
  IconCopy,
  IconHelp,
  IconHome,
  IconHome2,
  IconKey,
  IconLifebuoy,
  IconLogout,
  IconMoneybag,
  IconNotification,
  IconReceipt,
  IconSettings,
  IconTerminal2,
  IconUser,
  IconUserFilled,
  IconUsersGroup
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { useColorMode } from '@chakra-ui/react';
import Footer from '../FooterNew';

const styles = {
  horizontalBar: {}
};

function NavButton({ ...props }: any) {
  // const { colorScheme } = useMantineColorScheme();
  const href = props.href;
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Button
      variant={isActive ? 'light' : 'transparent'}
      color="var(--mantine-color-default-color)"
      justify="flex-start"
      fullWidth
      {...props}
    />
  );
}

export default function Nav({
  type,
  title,
  main
}: {
  type?: string;
  title?: string | null | undefined;
  main: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, isAuthLoaded, user } = useAuthContext();
  const { push } = useRouter();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 64 }}
        padding="md"
        zIndex={5}
      >
        <AppShell.Header
          px={'md'}
          style={
            {
              // border: 'none'
            }
          }
        >
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

            {/* buttons */}
            <Button
              component={NextLink}
              href={'/auth/login'}
              variant="default"
            >
              Access Platform
            </Button>
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
