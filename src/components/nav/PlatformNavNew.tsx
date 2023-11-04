/* eslint-disable react-hooks/rules-of-hooks */
// React
import { Suspense, forwardRef, useMemo } from 'react';

import { Link } from '@chakra-ui/next-js';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  SkeletonCircle,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';

import { HamburgerIcon } from '@chakra-ui/icons';

import { AiFillHome, AiFillInfoCircle, AiFillSetting } from 'react-icons/ai';
import { BiSolidExit, BiSolidNotification, BiSolidTime } from 'react-icons/bi';
import { FaBell, FaBuilding, FaIdBadge } from 'react-icons/fa';
import { ImTree } from 'react-icons/im';
import { IoArrowDown, IoChevronDown, IoHomeSharp } from 'react-icons/io5';
import { PiCubeFill } from 'react-icons/pi';
import { RiAdminFill, RiArrowDownSFill, RiArrowUpSFill, RiHome6Fill } from 'react-icons/ri';

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

const noAnim = {
  exit: {},
  enter: {}
};

function AvatarPopover({ currentUser, onLogoutOpen }: { currentUser?: User; onLogoutOpen?: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthLoaded } = useAuthContext();
  const { push } = useRouter();

  return (
    <>
      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      >
        <PopoverTrigger>
          <Button
            variant={'unstyled'}
            h={'full'}
            onClick={() => {}}
            transition={'opacity 0s ease-out'}
            _hover={{ opacity: 0.75 }}
            _active={{ opacity: 0.5 }}
          >
            <Skeleton
              isLoaded={!!currentUser}
              w={'auto'}
              h={'auto'}
              borderRadius={'full'}
              overflow={'hidden'}
            >
              <Flex
                align={'center'}
                gap={2}
                maxW={'md'}
                ml={2}
              >
                <Avatar
                  src={currentUser?.avatar}
                  size={'sm'}
                  rounded={'full'}
                  mr={1}
                />
                <Flex
                  flexDir={'column'}
                  align={'flex-start'}
                  justify={'center'}
                >
                  <Text
                    display={{ base: 'none', md: 'block' }}
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                    fontSize={'sm'}
                  >
                    {currentUser?.displayName}
                  </Text>
                </Flex>
                <Icon as={!isOpen ? RiArrowDownSFill : RiArrowUpSFill} />
              </Flex>
            </Skeleton>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          m={0}
          my={{ base: 4, md: 4 }}
          mx={{ base: 0, md: 2 }}
          zIndex={2}
          minW={{ base: '100vw', md: '320px' }}
          w={{ base: '100vw', md: 'auto' }}
          bg={useColorModeValue('white', 'gray.750')}
          rounded={'none'}
        >
          {/* <PopoverBody p={0}>
            <Stack
              divider={
                <Divider
                  borderColor={useColorModeValue('gray.300', 'gray.600')}
                  p={0}
                />
              }
            >
              <Flex
                px={4}
                pt={4}
                pb={2}
              >
                <Text
                  variant={'subtext'}
                  fontSize={'sm'}
                >
                  Account ID: {currentUser?.username}
                </Text>
              </Flex>
              <Flex
                flexDir={'column'}
                fontFamily={'Roboto'}
                px={4}
                pt={2}
                pb={2}
                gap={2}
              >
                <Link
                  href={'/settings/profile'}
                  w={'fit-content'}
                >
                  Account
                </Link>
                <Link
                  href={'/settings/quota'}
                  w={'fit-content'}
                >
                  Service Quotas
                </Link>
                <Link
                  href={'/settings/api-keys'}
                  w={'fit-content'}
                >
                  Security Credentials
                </Link>
              </Flex>
              <Button
                onClick={onLogoutOpen}
                size={'sm'}
                rounded={'none'}
              >
                Log out
              </Button>
            </Stack>
          </PopoverBody> */}
          <PopoverBody>
            <Stack>
              {(!isAuthLoaded || currentUser) && (
                <>
                  <Flex
                    as={Button}
                    onClick={() => {
                      push(`/@${currentUser?.username}`);
                      onClose();
                    }}
                    variant={'ghost'}
                    w={'100%'}
                    h={'auto'}
                    align={'center'}
                    rounded={'lg'}
                    p={4}
                    m={0}
                  >
                    <Flex
                      flexDir={'column'}
                      align={'flex-start'}
                      w={'min-content'}
                    >
                      <Text
                        fontSize={'xl'}
                        fontWeight={'900'}
                        textOverflow={'ellipsis'}
                      >
                        {currentUser?.displayName}
                      </Text>
                      <Text
                        fontSize={'md'}
                        fontWeight={'400'}
                        color={'gray.500'}
                      >
                        @{currentUser?.username}
                      </Text>
                    </Flex>
                    <Spacer />
                    <SkeletonCircle
                      isLoaded={!!currentUser}
                      w={'auto'}
                      h={'auto'}
                      pl={4}
                    >
                      <Avatar
                        src={currentUser?.avatar}
                        size={'lg'}
                      />
                    </SkeletonCircle>
                  </Flex>

                  <Button
                    as={NextLink}
                    href={'/settings/profile'}
                    variant={'outline'}
                    size={'md'}
                    leftIcon={<AiFillSetting />}
                    onClick={() => {
                      onClose();
                    }}
                  >
                    Settings
                  </Button>
                </>
              )}
              {currentUser?.platform.staff && (
                <Button
                  as={NextLink}
                  href={'/settings/staff-settings'}
                  variant={'outline'}
                  size={'md'}
                  leftIcon={<RiAdminFill />}
                  onClick={() => {
                    onClose();
                  }}
                >
                  Staff Settings
                </Button>
              )}
              {!isAuthLoaded || currentUser ? (
                <>
                  <Button
                    variant={'outline'}
                    size={'md'}
                    leftIcon={<BiSolidExit />}
                    onClick={() => {
                      onLogoutOpen();
                    }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={'outline'}
                    size={'md'}
                    leftIcon={<BiSolidExit />}
                    onClick={() => {
                      push('/auth/login');
                    }}
                  >
                    Log In
                  </Button>
                </>
              )}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
}

// eslint-disable-next-line react/display-name
const MenuLink = forwardRef((props: any, ref: any) => (
  <Link
    _hover={{ textDecor: 'unset' }}
    as={NextLink}
    ref={ref}
    {...props}
  />
));

function NavLink({
  href,
  target,
  onClick,
  variant = 'ghost',
  pathname,
  children,
  leftIcon,
  disabled,
  exact = false
}: {
  href?: string;
  target?: string;
  onClick?: () => void;
  variant?: string;
  pathname: string;
  children: React.ReactNode;
  leftIcon: React.ReactElement;
  disabled?: boolean;
  exact?: boolean;
}) {
  const isCurrent = useMemo(() => {
    if (!href || !pathname) return false;
    if (exact) {
      return pathname === href;
    } else {
      return pathname.startsWith(href as any);
    }
  }, [pathname, href, exact]) as any;

  return (
    <Button
      isDisabled={disabled}
      as={!onClick ? NextLink : undefined}
      href={!onClick ? href : undefined}
      target={target ? target : undefined}
      variant={pathname === href ? 'solid' : variant}
      onClick={onClick}
      leftIcon={
        leftIcon ? (
          <Box
            mr={1}
            fontSize={'xl'}
          >
            {leftIcon}
          </Box>
        ) : (
          <></>
        )
      }
      w={'full'}
      justifyContent={'flex-start'}
      px={2}
      py={2}
      rounded={'lg'}
      fontWeight={'900'}
      color={isCurrent ? useColorModeValue('gray.100', 'gray.900') : useColorModeValue('gray.900', 'gray.100')}
      bg={isCurrent ? useColorModeValue('gray.900', 'gray.200') : 'none'}
      _hover={
        isCurrent
          ? {}
          : {
              color: useColorModeValue('gray.900', 'gray.100'),
              bg: useColorModeValue('gray.100', 'gray.700')
            }
      }
      _active={
        isCurrent
          ? {
              color: useColorModeValue('gray.100', 'gray.900'),
              bg: useColorModeValue('gray.700', 'gray.400')
            }
          : {
              color: useColorModeValue('gray.900', 'gray.100'),
              bg: useColorModeValue('gray.200', 'gray.600')
            }
      }
    >
      {children}
    </Button>
  );
}

export default function PlatformNavNew({ type, title }: { type?: string; title?: string | null | undefined }) {
  const pathname = usePathname();
  const { currentUser, isAuthLoaded, user } = useAuthContext();
  const { isOpen: isLogoutOpen, onOpen: onLogoutOpen, onClose: onLogoutClose } = useDisclosure();
  const { push } = useRouter();

  return (
    <>
      <DeleteDialog
        isOpen={isLogoutOpen}
        onClose={onLogoutClose}
        onDelete={() => {
          onLogoutClose();
          push('/auth/logout');
        }}
        title={'Log Out'}
        body={'Are you sure you want to log out?'}
        buttonText={'Log Out'}
      />
      <Flex
        id="platform-nav"
        as="nav"
        display={{ base: 'none', md: 'flex' }}
        position={'fixed'}
        top={0}
        h={'100dvh'}
        w={'240px'}
        flexDir={'column'}
        align={'flex-start'}
        background={useColorModeValue('white', 'gray.750')}
        borderRight={'1px solid'}
        borderColor={useColorModeValue('gray.300', 'gray.600')}
        zIndex={500}
      >
        {/* Title */}
        <Flex
          h={'4rem'}
          width={'full'}
          borderBottom={'1px solid'}
          borderColor={useColorModeValue('gray.300', 'gray.600')}
          background={useColorModeValue('white', 'gray.750')}
        >
          <Flex
            as={NextLink}
            width={'full'}
            h={'full'}
            href={!isAuthLoaded || currentUser ? '/home' : '/'}
            align={'center'}
            justify={'center'}
            transition={'filter 0s ease'}
            _hover={{
              filter: useColorModeValue('opacity(0.75)', 'brightness(0.75)')
            }}
            _active={{
              filter: useColorModeValue('opacity(0.5)', 'brightness(0.5)')
            }}
          >
            <Flex
              position={'relative'}
              h={'100%'}
              zIndex={5000}
            >
              <Image
                w={'96px'}
                src={useColorModeValue('/images/logo-black.png', '/images/logo-white.png')}
                alt={'Restrafes XCS'}
                style={{
                  objectFit: 'contain'
                }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Box w={'full'}>
          {/* Links */}
          <VStack
            flexDir={'column'}
            align={'flex-start'}
            justify={'flex-start'}
            w={'100%'}
            px={4}
            py={6}
            spacing={1}
          >
            {!isAuthLoaded || currentUser ? (
              <>
                <NavLink
                  href={'/home'}
                  pathname={pathname}
                  leftIcon={<RiHome6Fill />}
                >
                  Home
                </NavLink>
                <NavLink
                  href={'/event-logs'}
                  pathname={pathname}
                  leftIcon={<PiCubeFill />}
                >
                  Event Logs
                </NavLink>
                <NavLink
                  href={`/@${currentUser?.username}`}
                  pathname={pathname}
                  leftIcon={<FaIdBadge />}
                >
                  Profile
                </NavLink>
                <NavLink
                  href={'/organizations'}
                  pathname={pathname}
                  leftIcon={<FaBuilding />}
                >
                  Organizations
                </NavLink>
                <NavLink
                  href={'/locations'}
                  pathname={pathname}
                  leftIcon={<ImTree />}
                >
                  Locations
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  href={'/auth/login'}
                  pathname={pathname}
                  leftIcon={<BiSolidExit />}
                >
                  Log In
                </NavLink>
              </>
            )}
          </VStack>
        </Box>
        <VStack
          flexDir={'column'}
          align={'flex-start'}
          justify={'flex-start'}
          w={'100%'}
          px={4}
          py={8}
          spacing={1}
          mt={'auto'}
        >
          {(!isAuthLoaded || currentUser) && (
            <>
              <NavLink
                href={'/settings'}
                pathname={pathname}
                leftIcon={<AiFillSetting />}
              >
                Settings
              </NavLink>
              <NavLink
                href={'https://xcs-docs.restrafes.co/'}
                target={'_blank'}
                pathname={pathname}
                leftIcon={<AiFillInfoCircle />}
              >
                Help & Information
              </NavLink>
            </>
          )}
          {!isAuthLoaded || currentUser ? (
            <NavLink
              // href={"/auth/logout"}
              onClick={onLogoutOpen}
              pathname={pathname}
              leftIcon={<BiSolidExit />}
            >
              Log Out
            </NavLink>
          ) : (
            <></>
          )}
        </VStack>
      </Flex>

      <Flex
        flexDir={'row'}
        id="platform-nav-horizontal"
        position={'sticky'}
        top={0}
        zIndex={499}
      >
        {/* Horizontal Bar */}
        <Flex
          as={'header'}
          w={'100vw'}
          h={'4rem'}
          align={'center'}
          justify={'space-between'}
          px={8}
          bg={useColorModeValue('white', 'gray.750')}
          borderBottom={'1px solid'}
          borderColor={useColorModeValue('gray.300', 'gray.600')}
        >
          <Flex
            as={NextLink}
            href={'/home'}
            display={{ base: 'flex', md: 'none' }}
            position={'relative'}
            w={'96px'}
            h={'100%'}
          >
            <NextImage
              src={useColorModeValue('/images/logo-black.png', '/images/logo-white.png')}
              priority={true}
              fill={true}
              quality={50}
              alt={'Restrafes XCS'}
              style={{
                objectFit: 'contain'
              }}
            />
          </Flex>
          <Spacer />

          <Divider
            orientation={'vertical'}
            h={'50%'}
            w={'0.5px'}
            background={useColorModeValue('gray.300', 'gray.500')}
            border={'none'}
            mx={4}
          />

          <HStack
            align={'center'}
            justify={'flex-end'}
            spacing={4}
          >
            {/* Notifications */}
            {/* <Popover>
              <PopoverTrigger>
                <Button
                  variant={'unstyled'}
                  rounded={'full'}
                  onClick={() => {}}
                  aria-label="Notifications"
                >
                  {<BiSolidNotification size={24} />}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                m={0}
                my={{ base: 5, md: 7 }}
                mx={{ base: 0, md: 2 }}
                zIndex={2}
                minW={{ base: '100vw', md: '320px' }}
                bg={useColorModeValue('white', 'none')}
                backdropFilter={'blur(2em)'}
                rounded={'lg'}
              >
                <PopoverCloseButton />
                <PopoverHeader>
                  <Text fontWeight={'900'}>Notifications</Text>
                </PopoverHeader>
                <PopoverBody>
                  <Text fontSize={'md'}>The service is unavailable.</Text>
                </PopoverBody>
              </PopoverContent>
            </Popover> */}

            {/* Avatar */}
            <AvatarPopover
              currentUser={currentUser}
              onLogoutOpen={onLogoutOpen}
            />

            {/* Theme Button */}
            {/* <Box display={{ base: "none", md: "flex" }}>
              <ThemeButton />
            </Box> */}

            {/* Mobile Nav */}
            <Box
              display={{ base: 'flex', md: 'none' }}
              zIndex={512}
            >
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<HamburgerIcon />}
                  variant={'solid'}
                  aria-label="Options"
                />
                <MenuList>
                  <MenuItem
                    as={MenuLink}
                    icon={<AiFillHome />}
                    href={!isAuthLoaded || currentUser ? '/home' : '/'}
                  >
                    Home
                  </MenuItem>
                  {(!isAuthLoaded || currentUser) && (
                    <>
                      <MenuItem
                        as={MenuLink}
                        icon={<BiSolidTime />}
                        href="/event-logs"
                      >
                        Event Logs
                      </MenuItem>
                      <MenuItem
                        as={MenuLink}
                        icon={<FaIdBadge />}
                        href={`/@${currentUser?.username}`}
                      >
                        Profile
                      </MenuItem>
                      <MenuItem
                        as={MenuLink}
                        icon={<FaBuilding />}
                        href="/organizations"
                      >
                        Organizations
                      </MenuItem>
                      <MenuItem
                        as={MenuLink}
                        icon={<ImTree />}
                        href="/locations"
                      >
                        Locations
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        as={MenuLink}
                        icon={<AiFillSetting />}
                        href="/settings"
                      >
                        Settings
                      </MenuItem>
                    </>
                  )}
                  {currentUser?.platform.staff && (
                    <MenuItem
                      as={MenuLink}
                      icon={<RiAdminFill />}
                      href="/settings/staff-settings"
                    >
                      Staff Settings
                    </MenuItem>
                  )}
                  {(!isAuthLoaded || currentUser) && (
                    <>
                      <MenuItem
                        as={MenuLink}
                        icon={<AiFillInfoCircle />}
                        href="https://xcs-docs.restrafes.co/"
                      >
                        Help & Information
                      </MenuItem>
                    </>
                  )}
                  <ThemeButton menu={true} />
                  <MenuDivider />
                  {!isAuthLoaded || currentUser ? (
                    <MenuItem
                      as={MenuLink}
                      icon={<BiSolidExit />}
                      href="/auth/logout"
                    >
                      Log Out
                    </MenuItem>
                  ) : (
                    <MenuItem
                      as={MenuLink}
                      icon={<BiSolidExit />}
                      href="/auth/login"
                    >
                      Log In
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>
          </HStack>
        </Flex>
      </Flex>
    </>
  );
}
