/* eslint-disable react-hooks/rules-of-hooks */
// React
import { Suspense, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';

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
  useComputedColorScheme,
  Alert,
  CloseButton,
  Tooltip,
  Anchor,
  Card,
  Group,
  Stack,
  Loader,
  ScrollArea,
  Box
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
import { User, UserNotification } from '@/types';
import {
  Icon3dCubeSphere,
  IconActivity,
  IconAlertCircle,
  IconArrowRight,
  IconBell,
  IconBuildingArch,
  IconCaretDown,
  IconCaretDownFilled,
  IconCaretUp,
  IconCaretUpFilled,
  IconChartBubbleFilled,
  IconCheck,
  IconCheckbox,
  IconChecklist,
  IconChevronCompactDown,
  IconChevronDown,
  IconCopy,
  IconCube,
  IconDashboard,
  IconHelp,
  IconHome,
  IconHome2,
  IconInfoCircleFilled,
  IconKey,
  IconLifebuoy,
  IconLocation,
  IconLocationFilled,
  IconLogin,
  IconLogout,
  IconMoneybag,
  IconNotification,
  IconQuestionMark,
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
import brandLogo from '@/assets/platform/company-brand-logo.jpeg';
import { useAsideContext } from '@/contexts/NavAsideContext';
import moment from 'moment';
import Notification from './Notification';

const styles = {
  horizontalBar: {}
};

function NavButton({ ...props }: any) {
  const { colorScheme } = useMantineColorScheme();
  const href = props.href;
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href);

  return (
    <Button
      variant={isActive ? 'light' : 'subtle'}
      color={colorScheme === 'dark' ? 'gray' : 'dark'}
      justify="flex-start"
      fullWidth
      {...props}
    />
  );
}

export default function PlatformNav({
  type,
  title,
  main
}: {
  type?: string;
  title?: string | null | undefined;
  main: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, isAuthLoaded, user, platform } = useAuthContext();
  const { push } = useRouter();
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const [opened, { toggle }] = useDisclosure();
  const {
    title: asideTitle,
    description: asideDescription,
    asideClose,
    asideOpened,
    asideToggle,
    closeHelp
  } = useAsideContext();

  return (
    <>
      <AppShell
        header={{ height: 64 }}
        navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        aside={{ width: 340, breakpoint: 'md', collapsed: { mobile: true, desktop: !asideOpened } }}
        padding="md"
        zIndex={5}
        transitionDuration={0}
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

            {((isAuthLoaded && user) || currentUser) && (
              <>
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
              </>
            )}

            {/* avatar menu */}
            <AvatarMenu currentUser={currentUser} />
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar
          p="sm"
          display={isAuthLoaded && !user ? 'none' : 'flex'}
        >
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
          {/* <NavButton
            colorScheme={colorScheme}
            component={NextLink}
            href={'/event-logs'}
            leftSection={<IconCube size={16} />}
          >
            Event Logs
          </NavButton> */}
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
            leftSection={<IconLocation size={16} />}
          >
            Locations
          </NavButton>
        </AppShell.Navbar>

        <AppShell.Main>
          <Flex w={'100%'}>
            {platform?.alerts.map((alert: any) => (
              <Alert
                key={alert.id}
                color={'gray'}
                radius={'md'}
                w={'100%'}
                title={
                  <Flex direction={'column'}>
                    <Text fw={'bold'}>{alert.title}</Text>
                    <Text>{alert.description}</Text>
                  </Flex>
                }
              />
            ))}
          </Flex>
          {main}
        </AppShell.Main>

        <AppShell.Aside
          miw={320}
          p={24}
        >
          <Flex align={'center'}>
            <Title
              order={3}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <IconInfoCircleFilled style={{ marginRight: 8 }} /> {asideTitle}
            </Title>
            <CloseButton
              ml={'auto'}
              onClick={() => closeHelp()}
            />
          </Flex>
          <Divider my={16} />
          <Text>{asideDescription}</Text>
        </AppShell.Aside>

        <AppShell.Footer pos={'relative'}>
          <Footer />
        </AppShell.Footer>
      </AppShell>
    </>
  );
}

function SettingsMenu({ currentUser }: { currentUser?: User }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <>
      <Popover
        width={320}
        position="bottom"
        shadow="md"
        radius={'md'}
        withArrow
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
                  color="var(--mantine-color-default-color)"
                >
                  Beta
                </Badge>
              </Text>
              <Radio
                label="Light"
                checked={colorScheme === 'light'}
                onClick={() => {
                  setColorScheme('light');
                }}
              />
              <Radio
                label="Dark"
                checked={colorScheme === 'dark'}
                onClick={() => {
                  setColorScheme('dark');
                }}
              />
              {/* <Anchor
                component={NextLink}
                href={'/settings/profile'}
                pt={8}
                size="sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  textUnderlineOffset: '0.25rem'
                }}
                w={'fit-content'}
              >
                <Text>View all settings</Text>
                <IconArrowRight size={16} />
              </Anchor> */}
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
  const { isAuthLoaded, user } = useAuthContext();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthLoaded) return;
    if (!user) return;

    setLoading(true);
    const token = await user.getIdToken();
    const res = await fetch('/api/v2/me/notifications', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status !== 200) return;

    const data = await res.json();
    setTimeout(() => {
      setNotifications(data || []);
      setLoading(false);
    }, 100);
  }, [user, isAuthLoaded]);

  useEffect(() => {
    if (!currentUser) return;
    if (!isAuthLoaded) return;
    if (!user) return;
    refreshNotifications();
  }, [currentUser, isAuthLoaded, user, refreshNotifications]);

  useEffect(() => {
    if (!opened) return;
    refreshNotifications();
  }, [opened, refreshNotifications]);

  return (
    <>
      <Popover
        width={isMobile ? 320 : 480}
        position="bottom"
        shadow="md"
        radius={'md'}
        withArrow
        opened={opened}
        onChange={setOpened}
        // transitionProps={{ duration: 0 }}
      >
        <Popover.Target>
          <UnstyledButton onClick={() => setOpened((o) => !o)}>
            <Flex
              align={'center'}
              justify={'center'}
            >
              <Indicator
                variant="dot"
                color="red"
                h={20}
                disabled={notifications.length === 0}
                radius={'xl'}
                // label={
                //   <Text
                //     size="0.5rem"
                //     fw={'bold'}
                //   >
                //     {notifications.length}
                //   </Text>
                // }
              >
                <IconBell size={20} />
              </Indicator>
            </Flex>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown
          px={0}
          py={0}
        >
          <Flex
            direction={'column'}
            mx={8}
            my={8}
            py={8}
          >
            <Flex
              direction={'row'}
              align={'center'}
              gap={4}
              px={16}
            >
              <Title size="md">Inbox</Title>
              <Button
                variant="light"
                size="xs"
                radius="xl"
                color={colorScheme === 'dark' ? 'gray' : 'dark'}
                ml={'auto'}
              >
                Clear all
              </Button>
            </Flex>
          </Flex>
          <Divider color="var(--mantine-color-default-border)" />
          <Box
            mah={512}
            style={{
              overflowY: 'auto'
            }}
          >
            {loading ? (
              <Flex
                align={'center'}
                justify={'center'}
                mih={64}
              >
                <Loader
                  size={16}
                  color={'var(--mantine-color-default-color)'}
                />
              </Flex>
            ) : !notifications.length ? (
              <Flex
                align={'center'}
                justify={'center'}
                mih={64}
              >
                <Text
                  px={8}
                  c={'gray.5'}
                >
                  You have no messages.
                </Text>
              </Flex>
            ) : (
              <Stack
                mx={8}
                py={16}
                gap={16}
              >
                {notifications.map((notification: UserNotification) => (
                  <Notification
                    key={notification.id}
                    notification={notification}
                    refresh={refreshNotifications}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Popover.Dropdown>
      </Popover>
    </>
  );
}

function AvatarMenu({ currentUser, onLogoutOpen }: { currentUser?: User; onLogoutOpen?: any }) {
  const [opened, setOpened] = useState(false);
  const { user, isAuthLoaded } = useAuthContext();
  const { push } = useRouter();
  const pathname = usePathname();
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
        radius={'md'}
        withArrow
        // transitionProps={{ duration: 0 }}
      >
        <Menu.Target>
          <UnstyledButton>
            <Flex
              align={'center'}
              justify={'center'}
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
                <Flex
                  direction={'column'}
                  display={{ base: 'none', md: 'block' }}
                >
                  <Text
                    fw={'bold'}
                    size="sm"
                    // lh={1}
                  >
                    {currentUser?.displayName}
                  </Text>
                  {/* <Text
                    size="xs"
                    lh={1.25}
                  >
                    Restrafes & Co.
                  </Text> */}
                  {/* <Flex
                    direction={'row'}
                    align={'center'}
                  >
                    <Avatar
                      size={16}
                      src={brandLogo.src}
                      style={{
                        borderRadius: '4px',
                        border: '1px solid var(--mantine-color-default-border)'
                      }}
                    />
                    <Text
                      size="xs"
                      ml={4}
                    >
                      Restrafes Technologies
                    </Text>
                  </Flex> */}
                </Flex>
              )}
              {opened ? <IconCaretUpFilled size={12} /> : <IconCaretDownFilled size={12} />}
            </Flex>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {isAuthLoaded && !user ? (
            <Menu.Item
              leftSection={<IconLogin style={{ width: rem(14), height: rem(14) }} />}
              onClick={() => {
                push('/auth/login?redirect=' + pathname);
              }}
            >
              Log in
            </Menu.Item>
          ) : (
            <>
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
                  <Tooltip.Floating label="Copy ID">
                    <Flex align={'center'}>
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
                  </Tooltip.Floating>
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
              {currentUser?.platform.staff && (
                <Menu.Item
                  component={NextLink}
                  href={'/settings/staff'}
                  leftSection={<IconTerminal2 style={{ width: rem(14), height: rem(14) }} />}
                  hidden={!currentUser?.platform.staff}
                >
                  Staff Dashboard
                </Menu.Item>
              )}
              <Menu.Item
                component={NextLink}
                href={'/settings/developer'}
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
                    onConfirm: () => push('/auth/logout'),
                    radius: 'md'
                  });
                }}
              >
                Log out
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
