// Components
import { Suspense, forwardRef } from 'react';

import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorModeValue
} from '@chakra-ui/react';

import { Link } from '@chakra-ui/next-js';

import { HamburgerIcon } from '@chakra-ui/icons';

import { AiFillHome } from 'react-icons/ai';
import { BiSolidLogIn } from 'react-icons/bi';

import NextImage from 'next/image';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';
import { BsArrowUpRight } from 'react-icons/bs';
import ThemeButtonPublic from './ThemeButtonPublic';


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
  variant = 'ghost',
  pathname,
  children
}: {
  href: string;
  variant?: string;
  pathname: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      as={NextLink}
      // variant={pathname === href ? 'solid' : variant}
      variant={'unstyled'}
      border={'1px solid'}
      borderColor={useColorModeValue('blackAlpha.900', 'white')}
      borderRadius={'none'}
      py={2}
      px={4}
      href={href}
      transition={'all 0.2s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.900', 'white'),
        color: useColorModeValue('white', 'black')
      }}
      _active={{
        bg: useColorModeValue('blackAlpha.700', 'whiteAlpha.700'),
        color: useColorModeValue('white', 'black')
      }}
      lineHeight={1.25}
    >
      {children}
    </Button>
  );
}

export default function Nav({ type }: { type?: string }) {
  const { currentUser, isAuthLoaded } = useAuthContext();
  const pathname = usePathname();

  return (
    <Suspense>
      <Flex px={{ base: 4, md: 16 }} py={{ base: 8, md: 4 }} w={'full'} minH={'4rem'} bg={useColorModeValue('blackAlpha.900', 'white')} color={useColorModeValue('white', 'black')} align={'center'} justify={'flex-start'}>
        <Heading size={'sm'} fontWeight={'normal'}>
          We&apos;ve begun rolling out early access to those part of the beta program.
          If you&apos;re interested in joining, please contact us at <Link textDecor={'underline'} textUnderlineOffset={4} textDecorationThickness={'1px'} href={'mailto:xcs@restrafes.co'}>xcs@restrafes.co</Link>.
        </Heading>
        {/* <Spacer />
        <CloseButton onClick={() => { setAlertOpen(false) }} /> */}
      </Flex>
      <Flex
        as="nav"
        position={'sticky'}
        top={0}
        // w={"100vw"}
        h={'6rem'}
        align={'center'}
        bg={useColorModeValue('white', 'gray.800')}
        // border={'1px solid'}
        borderColor={useColorModeValue('gray.300', 'gray.700')}
        zIndex={50}
      >
        {/* Title */}
        <Flex
          align={'center'}
          justify={'center'}
          w={'240px'}
          h={'full'}
        // borderRight={"1px solid"}
        // borderColor={useColorModeValue("gray.300", "gray.700")}
        >
          <Flex
            as={NextLink}
            href={'/'}
            align={'center'}
            justify={'center'}
            h={'100%'}
            transition={'filter 0.2s ease'}
            _hover={{
              filter: useColorModeValue('opacity(0.75)', 'brightness(0.75)')
            }}
            _active={{
              filter: useColorModeValue('opacity(0.5)', 'brightness(0.5)')
            }}
          >
            <Flex
              position={'relative'}
              w={'128px'}
              h={'100%'}
            >
              <NextImage
                src={useColorModeValue('/images/logo-black.png', '/images/logo-white.png')}
                priority={true}
                fill={true}
                quality={64}
                alt={'Restrafes XCS'}
                style={{
                  objectFit: 'contain'
                }}
              />
            </Flex>
          </Flex>
        </Flex>
        <Spacer />
        {/* Links */}
        <HStack
          align={'center'}
          h={'100%'}
          px={[4, 12]}
          // borderLeft={"1px solid"}
          // borderColor={useColorModeValue("gray.200", "gray.700")}
          spacing={2}
        >
          {/* {type !== "login" && */}
          <Box display={{ base: 'none', md: 'flex' }} gap={4}>
            <NavLink
              href={'/auth/login'}
              pathname={pathname}
            >
              Access Platform
              <Icon as={BsArrowUpRight} ml={1} h={3} />
            </NavLink>
            <ThemeButtonPublic />
          </Box>
          {/* } */}

          {/* Theme Button */}
          {/* <Box display={{ base: 'none', md: 'flex' }}>
            <ThemeButton />
          </Box> */}

          {/* Mobile Nav */}
          <Box display={{ base: 'flex', md: 'none' }}>
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
                  href="/"
                >
                  Home
                </MenuItem>
                <MenuItem
                  as={MenuLink}
                  icon={<BiSolidLogIn />}
                  href="/auth/login"
                >
                  Access Platform
                </MenuItem>
                {/* <ThemeButton menu={true} /> */}
              </MenuList>
            </Menu>
          </Box>
        </HStack>
      </Flex>
    </Suspense>
  );
}
