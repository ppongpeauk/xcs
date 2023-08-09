// Components
import { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast
} from '@chakra-ui/react';

import { HamburgerIcon } from '@chakra-ui/icons';

import { BiSolidUserBadge, BiSolidUserDetail } from 'react-icons/bi';
import { FaIdBadge, FaLink, FaPaintBrush } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { RiAdminFill, RiMailAddFill } from 'react-icons/ri';

import Head from 'next/head';
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Layouts
import Layout from '@/layouts/PlatformLayout';

import SettingsAdmin from '@/components/SettingsAdmin';
import SettingsAppearance from '@/components/SettingsAppearance';
import SettingsInvite from '@/components/SettingsInvite';
import SettingsLinkedAccounts from '@/components/SettingsLinkedAccounts';
import SettingsProfile from '@/components/SettingsProfile';

function StyledTab({ children, index, icon }: { children: React.ReactNode; index: number; icon?: any }) {
  const { push } = useRouter();

  return (
    <Tab
      w={'200px'}
      fontSize={['sm', 'md']}
      color={'unset'}
      justifyContent={'left'}
      border={'none'}
      rounded={'lg'}
      fontWeight={'bold'}
      _hover={{
        bg: useColorModeValue('gray.100', 'whiteAlpha.100')
      }}
      _active={{
        bg: useColorModeValue('gray.200', 'whiteAlpha.300'),
        color: useColorModeValue('gray.900', 'white')
      }}
      _selected={{
        bg: useColorModeValue('gray.100', 'white'),
        color: useColorModeValue('black', 'gray.900')
      }}
      onClick={() => {
        push(`/platform/settings/${index + 1}`);
      }}
    >
      {icon ? (
        <Icon
          as={icon}
          mr={2}
        />
      ) : null}
      {children}
    </Tab>
  );
}

export default function Settings() {
  const { query, push } = useRouter();
  const toast = useToast();
  const { currentUser, user } = useAuthContext();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    query.section && setIndex(parseInt(query.section as string) - 1);
  }, [query]);

  useEffect(() => {
    console.log(query);
    // discord linked
    if (query.discordLinked !== undefined) {
      if (query.discordLinked === 'true') {
        toast({
          title: 'Successfully linked your Discord account.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        toast({
          title: 'There was an error linking your Discord account.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
    // roblox linked
    if (query.robloxLinked !== undefined) {
      if (query.robloxLinked === 'true') {
        toast({
          title: 'Successfully linked your Roblox account.',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        toast({
          title: 'There was an error linking your Roblox account.',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      }
    }
  }, [query]);

  return (
    <>
      <Head>
        <title>Restrafes XCS – Settings</title>
        <meta
          property="og:site_name"
          content="Restrafes XCS"
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:title"
          content="Settings"
        />
      </Head>
      <Container
        maxW={'full'}
        p={8}
      >
        <Heading>Settings</Heading>
        <Box
          display={{ base: 'block', md: 'none' }}
          pt={4}
        >
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon />}
              aria-label={'Menu'}
              w={'full'}
            />
            <MenuList>
              <MenuItem
                onClick={() => {
                  setIndex(0);
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIndex(1);
                }}
              >
                Appearance
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setIndex(2);
                }}
              >
                Linked Accounts
              </MenuItem>
              {currentUser?.platform.staff && (
                <MenuItem
                  onClick={() => {
                    setIndex(3);
                  }}
                >
                  Staff Settings
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  setIndex(4);
                }}
              >
                Referrals
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Tabs
          py={4}
          orientation={'vertical'}
          variant={'line'}
          isLazy={true}
          maxW={'full'}
          h={'100%'}
          index={index}
          onChange={setIndex}
          isManual={true}
        >
          <TabList
            display={{ base: 'none', md: 'block' }}
            h={'100%'}
            border={'none'}
          >
            <StyledTab
              index={0}
              icon={BiSolidUserDetail}
            >
              <Text>Profile</Text>
            </StyledTab>
            <StyledTab
              index={1}
              icon={FaPaintBrush}
            >
              <Text>Appearance</Text>
            </StyledTab>
            <StyledTab
              index={2}
              icon={FiExternalLink}
            >
              <Text>Linked Accounts</Text>
            </StyledTab>
            {currentUser?.platform.staff && (
              <StyledTab
                index={3}
                icon={RiAdminFill}
              >
                <Text>Staff Settings</Text>
              </StyledTab>
            )}
            <StyledTab
              index={4}
              icon={RiMailAddFill}
            >
              <Text>Referrals</Text>
            </StyledTab>
          </TabList>

          <TabPanels px={{ base: 0, md: 8 }}>
            <TabPanel p={0}>
              <Heading>Profile</Heading>
              <Text
                fontSize={'md'}
                color={'gray.500'}
              >
                This is how you appear to other users.
              </Text>
              <Divider
                mt={4}
                mb={8}
              />
              <SettingsProfile />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Appearance</Heading>
              <Text
                fontSize={'md'}
                color={'gray.500'}
              >
                Customize the appearance of the website.
              </Text>
              <Divider
                mt={4}
                mb={8}
              />
              <SettingsAppearance />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Linked Accounts</Heading>
              <Text
                fontSize={'md'}
                color={'gray.500'}
              >
                Link your accounts to verify your identity.
              </Text>
              <Divider
                mt={4}
                mb={8}
              />
              <SettingsLinkedAccounts />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Staff Settings</Heading>
              <Text
                fontSize={'md'}
                color={'gray.500'}
              >
                Super secret settings.
              </Text>
              <Divider
                mt={4}
                mb={8}
              />
              <SettingsAdmin />
            </TabPanel>
            <TabPanel p={0}>
              <Heading>Invite</Heading>
              <Text
                fontSize={'md'}
                color={'gray.500'}
              >
                Invite users to the platform.
              </Text>
              <Divider
                mt={4}
                mb={8}
              />
              <SettingsInvite />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
}

Settings.getLayout = (page: any) => <Layout>{page}</Layout>;
