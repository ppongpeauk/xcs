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
  Radio
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

function NavButton(props: any) {
  // const { colorScheme } = useMantineColorScheme();
  const href = props.href;
  const pathname = usePathname();
  const isActive = href === pathname;

  return (
    <Button
      variant={isActive ? 'light' : 'transparent'}
      color={props.colorScheme === 'dark' ? 'white' : 'black'}
      justify="flex-start"
      fullWidth
      {...props}
    />
  );
}

export default function PlatformNavNew({
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
  const { colorScheme } = useMantineColorScheme();
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        header={{ height: 64 }}
        navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
        zIndex={5}
      >
        <AppShell.Header px={'md'}>
          <Flex
            direction={'row'}
            align={'center'}
            h={'100%'}
          >
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            {/* Logo */}
            <NextLink
              href={'/home'}
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

            {/* notifications */}
            <NotificationMenu currentUser={currentUser} />

            <Divider
              orientation="vertical"
              mx={16}
              my={8}
            />

            {/* settings */}
            <SettingsMenu currentUser={currentUser} />

            <Divider
              orientation="vertical"
              mx={16}
              my={8}
            />

            {/* avatar menu */}
            <AvatarMenu currentUser={currentUser} />
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar p="sm">
          <NavButton
            colorScheme={colorScheme}
            component={NextLink}
            href={'/home'}
            leftSection={<IconHome2 size={16} />}
          >
            Home
          </NavButton>
          <NavButton
            colorScheme={colorScheme}
            component={NextLink}
            href={'/@' + currentUser?.username}
            leftSection={<IconUser size={16} />}
          >
            Profile
          </NavButton>
          <NavButton
            colorScheme={colorScheme}
            component={NextLink}
            href={'/event-logs'}
            leftSection={<IconActivity size={16} />}
          >
            Event Logs
          </NavButton>
          <NavButton
            colorScheme={colorScheme}
            component={NextLink}
            href={'/organizations'}
            leftSection={<IconUsersGroup size={16} />}
          >
            Organizations
          </NavButton>
          <NavButton
            colorScheme={colorScheme}
            component={NextLink}
            href={'/locations'}
            leftSection={<IconBuildingArch size={16} />}
          >
            Locations
          </NavButton>
        </AppShell.Navbar>

        <AppShell.Main bg={colorScheme === 'dark' ? 'dark.7' : 'unset'}>{main}</AppShell.Main>

        <AppShell.Footer pos={'relative'}>
          <Footer />
        </AppShell.Footer>
      </AppShell>
      {/* <Flex
        component={Paper}
        direction={'row'}
        id="platform-nav-horizontal"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5
        }}
      >
        <Flex
          w={'100vw'}
          h={rem(64)}
          align={'center'}
          justify={'space-between'}
          px={8}
          style={{
            backgroundColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-6)' : 'var(--chakra-colors-white)',
            borderBottom: '1px solid',
            borderColor: colorScheme === 'dark' ? 'var(--mantine-color-dark-4)' : 'var(--chakra-colors-gray-100)',
            zIndex: 6
          }}
        >
          <NextLink href={'/home'}>
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

          <Spacer />

          <NotificationMenu currentUser={currentUser} />

          <Divider
            orientation="vertical"
            mx={16}
            my={8}
          />

          <AvatarMenu currentUser={currentUser} />
        </Flex>
      </Flex> */}
    </>
  );
}

function SettingsMenu({ currentUser }: { currentUser?: User }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { setColorMode } = useColorMode();

  return (
    <>
      <Popover
        width={320}
        position="bottom"
        shadow="md"
        // transitionProps={{ duration: 0 }}
      >
        <Popover.Target>
          <UnstyledButton>
            <Flex
              align={'center'}
              justify={'center'}
            >
              <IconSettings size={20} />
            </Flex>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
          <Flex
            direction={'column'}
            py={8}
          >
            <Flex
              direction={'row'}
              align={'center'}
              gap={4}
              px={16}
            >
              <Title size="sm">Settings</Title>
            </Flex>
            {/* visual mode */}
            <Flex
              direction={'column'}
              gap={4}
              px={16}
              py={8}
            >
              <Text
                style={{
                  alignContent: 'center'
                }}
              >
                Visual mode
                <Badge
                  ml={8}
                  variant="outline"
                >
                  Beta
                </Badge>
              </Text>
              <Radio
                name="colorSchemeLight"
                label="Light"
                checked={colorScheme === 'light'}
                onClick={() => {
                  setColorScheme('light');
                  setColorMode('light');
                }}
              />
              <Radio
                name="colorSchemeDark"
                label="Dark"
                checked={colorScheme === 'dark'}
                onClick={() => {
                  setColorScheme('dark');
                  setColorMode('dark');
                }}
              />
            </Flex>
          </Flex>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}

function NotificationMenu({ currentUser }: { currentUser?: User }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Popover
        width={isMobile ? 320 : 480}
        position="bottom"
        shadow="md"
        // transitionProps={{ duration: 0 }}
      >
        <Popover.Target>
          <UnstyledButton>
            <Flex
              align={'center'}
              justify={'center'}
            >
              <Indicator
                variant="dot"
                color="red"
                h={20}
                // disabled
                // disabled={!currentUser?.notifications?.length}
              >
                <IconBell size={20} />
              </Indicator>
            </Flex>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown>
          <Flex
            direction={'column'}
            py={8}
          >
            <Flex
              direction={'row'}
              align={'center'}
              gap={4}
              px={16}
            >
              <Title size="sm">Notifications</Title>
              <Button
                ml={'auto'}
                variant={'subtle'}
                color={'text'}
                size={'xs'}
                leftSection={<IconChecklist size={16} />}
              >
                Mark all as read
              </Button>
            </Flex>
          </Flex>
          <SegmentedControl
            fullWidth
            mt={8}
            data={['All', 'Invitations', 'System']}
          />
          <Flex
            align={'center'}
            justify={'center'}
            mih={128}
          >
            <Text
              px={16}
              c={'gray.5'}
            >
              You have no notifications.
            </Text>
          </Flex>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}

function AvatarMenu({ currentUser, onLogoutOpen }: { currentUser?: User; onLogoutOpen?: any }) {
  const [opened, setOpened] = useState(false);
  const { user, isAuthLoaded } = useAuthContext();
  const { push } = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Menu
        width={320}
        position="bottom"
        shadow="md"
        opened={opened}
        onChange={setOpened}
        // transitionProps={{ duration: 0 }}
      >
        <Menu.Target>
          <UnstyledButton>
            <Flex
              align={'center'}
              gap={12}
            >
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.displayName}
                size={rem(32)}
                style={{
                  backgroundColor: 'var(--chakra-colors-gray-200)'
                }}
              />
              {currentUser && (
                <Text
                  fw={'bold'}
                  size="sm"
                  display={{ base: 'none', md: 'block' }}
                >
                  {currentUser?.displayName}
                </Text>
              )}
              {opened ? <IconCaretUpFilled size={12} /> : <IconCaretDownFilled size={12} />}
            </Flex>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Flex
            direction={'column'}
            py={8}
          >
            <Flex
              direction={'row'}
              align={'center'}
              gap={4}
              px={16}
            >
              <Text
                c={colorScheme === 'dark' ? 'white' : 'black'}
                size="sm"
              >
                Account ID: {currentUser?.username}
              </Text>
              <CopyButton value={currentUser?.username as string}>
                {({ copied, copy }) => (
                  <ActionIcon
                    variant="transparent"
                    size="xs"
                    color={'gray'}
                    onClick={copy}
                  >
                    {copied ? <IconCheck /> : <IconCopy />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Flex>
          </Flex>
          <Menu.Divider />
          <Menu.Item
            component={NextLink}
            href={`/@${currentUser?.username}`}
            leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            component={NextLink}
            href={'/settings/profile'}
            leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          >
            Settings
          </Menu.Item>
          <Menu.Item
            component={NextLink}
            href={'/settings/staff'}
            leftSection={<IconTerminal2 style={{ width: rem(14), height: rem(14) }} />}
            hidden={!currentUser?.platform.staff}
          >
            Staff Dashboard
          </Menu.Item>
          <Menu.Item
            component={NextLink}
            href={'/settings/api-keys'}
            leftSection={<IconKey style={{ width: rem(14), height: rem(14) }} />}
          >
            Security credentials
          </Menu.Item>
          <Menu.Item
            component={NextLink}
            href={'mailto:xcs@restrafes.co'}
            leftSection={<IconLifebuoy style={{ width: rem(14), height: rem(14) }} />}
          >
            Help & Support
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
            onClick={() => {
              modals.openConfirmModal({
                title: <Title order={4}>Log out?</Title>,
                children: <Text size="sm">Are you sure you want to log out?</Text>,
                labels: { confirm: 'Log out', cancel: 'Nevermind' },
                confirmProps: { color: 'red' },
                onCancel: () => null,
                onConfirm: () => push('/auth/logout')
              });
            }}
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
