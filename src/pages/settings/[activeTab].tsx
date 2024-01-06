// Components
import { useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';

import { Container, Box, Divider, Tabs, Title, rem, useMantineColorScheme, Badge, Text, Stack } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';

// Layouts
import Layout from '@/layouts/LayoutPlatform';

import SettingsAdmin from '@/components/settings/SettingsAdmin';
import SettingsAppearance from '@/components/settings/SettingsAppearance';
import SettingsInvite from '@/components/settings/SettingsInvite';
import SettingsLinkedAccounts from '@/components/settings/SettingsLinkedAccounts';
import SettingsProfile from '@/components/settings/SettingsProfile';
import { useMediaQuery } from '@mantine/hooks';
import {
  Icon3dCubeSphere,
  IconBeta,
  IconCode,
  IconCylinder,
  IconExternalLink,
  IconFlask,
  IconHandClick,
  IconHandFinger,
  IconHandStop,
  IconLink,
  IconMailFilled,
  IconPaint,
  IconPaintFilled,
  IconStar,
  IconTerminal2,
  IconUser,
  IconUserFilled
} from '@tabler/icons-react';
import SettingsPrivacy from '@/components/settings/SettingsPrivacy';
import InfoLink from '@/components/InfoLink';
import { AiFillExperiment, AiOutlineExperiment } from 'react-icons/ai';
import SettingsBeta from '@/components/settings/SettingsBeta';
import SettingsExperiments from '@/components/settings/SettingsExperiments';
import SettingsDeveloper from '@/components/settings/SettingsDeveloper';

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
  const iconStyle = { width: rem(14), height: rem(14) };

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
          color={colorScheme === 'dark' ? 'dark.5' : 'black'}
          orientation={isMobile ? 'horizontal' : 'vertical'}
          defaultValue={'settings'}
          value={query.activeTab as string}
          onChange={(value) => push(`/settings/${value}`)}
          variant="pills"
        >
          <Tabs.List
            style={{ gap: 0 }}
            fw={'bold'}
          >
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
              value="privacy"
              leftSection={<IconHandStop style={iconStyle} />}
            >
              Privacy
            </Tabs.Tab>
            <Tabs.Tab
              value="linked-accounts"
              leftSection={<IconExternalLink style={iconStyle} />}
            >
              Linked Accounts
            </Tabs.Tab>
            {currentUser?.platform?.staff ? (
              <Tabs.Tab
                value="staff"
                leftSection={<IconTerminal2 style={iconStyle} />}
              >
                Staff Dashboard
              </Tabs.Tab>
            ) : null}
            <Tabs.Tab
              value="beta-program"
              leftSection={<IconBeta style={iconStyle} />}
              display={currentUser?.platform?.features?.beta?.enabled ? 'flex' : 'none'}
            >
              Beta Program
            </Tabs.Tab>
            <Tabs.Tab
              value="experimental-features"
              leftSection={<IconFlask style={iconStyle} />}
              display={currentUser?.platform?.features?.beta?.enabled ? 'flex' : 'none'}
            >
              Experimental Features
            </Tabs.Tab>
            <Tabs.Tab
              value="developer"
              leftSection={<IconCode style={iconStyle} />}
            >
              Developer Settings
            </Tabs.Tab>
          </Tabs.List>

          <Box
            px={isMobile ? 0 : 32}
            pt={isMobile ? 16 : 0}
          >
            <Tabs.Panel value="profile">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Profile
              </Title>
              <SettingsProfile />
            </Tabs.Panel>
            <Tabs.Panel value="privacy">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Privacy
              </Title>
              <SettingsPrivacy />
            </Tabs.Panel>
            <Tabs.Panel value="appearance">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
                style={{
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Appearance
              </Title>
              <SettingsAppearance />
            </Tabs.Panel>
            <Tabs.Panel value="linked-accounts">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Linked Accounts
              </Title>
              <SettingsLinkedAccounts />
            </Tabs.Panel>
            <Tabs.Panel value="staff">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Staff Dashboard
              </Title>
              {currentUser?.platform?.staff ? <SettingsAdmin /> : null}
            </Tabs.Panel>
            <Tabs.Panel value="beta-program">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Beta Program
                <InfoLink
                  title="Beta Program"
                  description={
                    <Stack>
                      <Text>Manage your membership in the beta program.</Text>
                      <Text>
                        Beta users have access to experimental features before they are released to the public.
                      </Text>
                    </Stack>
                  }
                />
              </Title>
              <SettingsBeta />
            </Tabs.Panel>
            <Tabs.Panel value="experimental-features">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Experimental Features
                <InfoLink
                  title="Experimental Features"
                  description={
                    <Stack>
                      <Text>
                        Experimental features are only available to users with the &quot;Beta&quot; atrribute.
                      </Text>
                    </Stack>
                  }
                />
              </Title>
              <SettingsExperiments />
            </Tabs.Panel>
            <Tabs.Panel value="developer">
              <Title
                size={rem(24)}
                py={4}
                mb={8}
              >
                Developer Settings
                <InfoLink
                  title="Developer Settings"
                  description={
                    <Stack>
                      <Text>Developer settings are only available to users with the &quot;Beta&quot; atrribute.</Text>
                    </Stack>
                  }
                />
              </Title>
              <SettingsDeveloper />
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
