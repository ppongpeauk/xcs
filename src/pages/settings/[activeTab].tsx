// Components
import { useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';

import { Container, Box, Divider, Tabs, Title, rem, useMantineColorScheme, Badge } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Layouts
import Layout from '@/layouts/PlatformLayout';

import SettingsAdmin from '@/components/settings/SettingsAdmin';
import SettingsAppearance from '@/components/settings/SettingsAppearance';
import SettingsInvite from '@/components/settings/SettingsInvite';
import SettingsLinkedAccounts from '@/components/settings/SettingsLinkedAccounts';
import SettingsProfile from '@/components/settings/SettingsProfile';
import { useMediaQuery } from '@mantine/hooks';
import {
  Icon3dCubeSphere,
  IconExternalLink,
  IconLink,
  IconMailFilled,
  IconPaint,
  IconPaintFilled,
  IconStar,
  IconTerminal2,
  IconUser,
  IconUserFilled
} from '@tabler/icons-react';

export default function Settings() {
  const { query, push } = useRouter();
  const toast = useToast();
  const { currentUser, user } = useAuthContext();
  const [index, setIndex] = useState(0);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (!query.section) return;
    let section;
    switch (query.section[0]) {
      case 'profile':
        section = 0;
        break;
      case 'appearance':
        section = 1;
        break;
      case 'linked-accounts':
        section = 2;
        break;
      case 'referrals':
        section = 3;
        break;
      case 'staff-settings':
        section = 4;
        break;
      default:
        section = 0;
    }
    setIndex(section);
  }, [query]);

  useEffect(() => {
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
  }, [query, toast]);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <>
      <Head>
        <title>Settings - Restrafes XCS</title>
        <meta
          property="og:title"
          content="Settings - Restrafes XCS"
        />
        <meta
          property="og:site_name"
          content="Restrafes XCS"
        />
        <meta
          property="og:url"
          content="https://xcs.restrafes.co"
        />
        <meta
          property="og:description"
          content="Control your access points with ease."
        />
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:image"
          content="/images/logo-square.jpg"
        />
      </Head>
      <Container
        size={'100%'}
        pt={16}
      >
        <Title>Settings</Title>
        <Divider my={24} />
        {/* Tabs */}
        <Tabs
          color={colorScheme === 'dark' ? 'white' : 'black'}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          defaultValue={'settings'}
          value={query.activeTab as string}
          onChange={(value) => push(`/settings/${value}`)}
        >
          <Tabs.List>
            <Tabs.Tab
              value="profile"
              leftSection={<IconUserFilled style={iconStyle} />}
            >
              Profile
            </Tabs.Tab>
            <Tabs.Tab
              value="appearance"
              leftSection={<IconPaintFilled style={iconStyle} />}
            >
              Appearance
            </Tabs.Tab>
            <Tabs.Tab
              value="linked-accounts"
              leftSection={<IconExternalLink style={iconStyle} />}
            >
              Linked Accounts
            </Tabs.Tab>
            <Tabs.Tab
              value="referrals"
              leftSection={<IconMailFilled style={iconStyle} />}
            >
              Referrals
            </Tabs.Tab>
            {currentUser?.platform?.staff ? (
              <Tabs.Tab
                value="staff"
                leftSection={<IconTerminal2 style={iconStyle} />}
              >
                Staff Dashboard
              </Tabs.Tab>
            ) : null}
          </Tabs.List>

          <Box
            px={isMobile ? 0 : 32}
            pt={isMobile ? 16 : 0}
          >
            <Tabs.Panel value="profile">
              <Title
                size={rem(24)}
                py={4}
                mb={16}
              >
                Profile
              </Title>
              <SettingsProfile />
            </Tabs.Panel>
            <Tabs.Panel value="appearance">
              <Title
                size={rem(24)}
                py={4}
                mb={16}
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Appearance
                <Badge
                  ml={8}
                  variant="light"
                  color="blue"
                >
                  Beta
                </Badge>
              </Title>
              <SettingsAppearance />
            </Tabs.Panel>
            <Tabs.Panel value="linked-accounts">
              <Title
                size={rem(24)}
                py={4}
                mb={16}
              >
                Linked Accounts
              </Title>
              <SettingsLinkedAccounts />
            </Tabs.Panel>
            <Tabs.Panel value="referrals">
              <Title
                size={rem(24)}
                py={4}
                mb={16}
              >
                Referrals
              </Title>
              <SettingsInvite />
            </Tabs.Panel>
            <Tabs.Panel value="staff">
              <Title
                size={rem(24)}
                py={4}
                mb={16}
              >
                Staff Dashboard
              </Title>
              {currentUser?.platform?.staff ? <SettingsAdmin /> : null}
            </Tabs.Panel>
          </Box>
        </Tabs>
        {/* <Tabs
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
              demoAllowed={false}
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
            <StyledTab
              index={3}
              icon={RiMailAddFill}
            >
              <Text>Referrals</Text>
            </StyledTab>
            {currentUser?.platform.staff && (
              <StyledTab
                index={4}
                icon={RiAdminFill}
              >
                <Text>Staff Settings</Text>
              </StyledTab>
            )}
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
              <Heading>Referrals</Heading>
              <Text
                fontSize={'md'}
                color={'gray.500'}
              >
                Invite users to register for the platform.
              </Text>
              <Divider
                mt={4}
                mb={8}
              />
              <SettingsInvite />
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
          </TabPanels>
        </Tabs> */}
      </Container>
    </>
  );
}

Settings.getLayout = (page: any) => <Layout>{page}</Layout>;
