/* eslint-disable react-hooks/rules-of-hooks */

import {
  Avatar,
  Box,
  Flex,
  Container,
  Text,
  Title,
  Image,
  useMantineColorScheme,
  Button,
  CSSProperties,
  rem,
  Badge,
  Tooltip,
  Indicator,
  UnstyledButton,
  AspectRatio,
  Group,
  Paper,
  Anchor,
  Pill
} from '@mantine/core';
import { modals } from '@mantine/modals';

// Types
import { Achievement, Organization, User } from '@/types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

// Authentication
import { useAuthContext } from '@/contexts/AuthContext';
import { BsFillShieldFill } from 'react-icons/bs';
import { IoHammerSharp } from 'react-icons/io5';
import {
  IconBadges,
  IconBrandDiscordFilled,
  IconBrandTwitter,
  IconBrandTwitterFilled,
  IconCheck,
  IconExternalLink,
  IconHome,
  IconHome2,
  IconLink,
  IconMessage,
  IconMoodSmile,
  IconSettings,
  IconSettings2,
  IconTrophy,
  IconUserEdit,
  IconUsersGroup
} from '@tabler/icons-react';
import moment from 'moment';

export default function Profile({ username, user }: { username: string | null; user: User }) {
  const router = useRouter();
  const { currentUser, user: authUser, isAuthLoaded } = useAuthContext();
  const { colorScheme } = useMantineColorScheme();

  const styles = {
    badgeContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      // width: '240px',
      aspectRatio: '1 / 1.588',
      backgroundColor: 'var(--mantine-color-default)',
      border: '2px solid var(--mantine-color-default-border)',
      borderRadius: '8px'
    },
    badgeHole: {
      marginTop: '25px',
      width: '33%',
      height: '24px',
      backgroundColor: 'var(--mantine-color-body)',
      border: '2px solid var(--mantine-color-default-border)',
      borderRadius: '8px'
    },
    badgeImage: {
      width: '50%',
      minWidth: '96px',
      aspectRatio: '1 / 1',
      borderRadius: '8px',
      border: '2px solid var(--mantine-color-default-border)'
    },
    cellContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      height: 'auto',
      width: '300px',
      paddingTop: '8px'
    }
  } as { [key: string]: CSSProperties };

  return (
    <>
      <Head>
        {user ? (
          <title>{`${user?.displayName || user?.username}'s Profile`} - Restrafes XCS</title>
        ) : (
          <title>{`Profile - Restrafes XCS`}</title>
        )}
      </Head>
      <Box
        display={'flex'}
        px={8}
        pt={8}
        style={{
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        maw={320}
      >
        {/* user badge */}
        <Flex style={styles.badgeContainer}>
          <Flex style={styles.badgeHole} />
          <Image
            style={styles.badgeImage}
            src={user?.avatar}
            alt={user?.displayName}
          />
          <Flex
            direction={'column'}
            align={'center'}
            mb={'20%'}
          >
            <Title
              order={2}
              fw={'bold'}
              mt={4}
            >
              {user?.displayName}
            </Title>
            <Title
              order={4}
              fw={'normal'}
            >
              @{user?.username}
            </Title>
          </Flex>
        </Flex>

        {!isAuthLoaded || currentUser?.id === user?.id ? (
          <Button
            mt={16}
            component={NextLink}
            href={'/settings/profile'}
            mb={4}
            fullWidth
            variant="default"
            loading={!isAuthLoaded}
            leftSection={<IconUserEdit size={16} />}
          >
            Edit profile
          </Button>
        ) : null}

        <Flex
          direction="column"
          mt={currentUser?.id === user?.id ? 16 : 24}
        >
          {/* user about-me */}
          <Flex direction={'column'}>
            <Group
              align="center"
              gap={8}
            >
              <IconMessage size={16} />
              <Title order={4}>About Me</Title>
            </Group>
            <Text
              size={'sm'}
              c={!user?.about?.bio ? 'gray.6' : 'unset'}
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {user?.about?.bio || 'This user has not set a bio yet.'}
            </Text>
            <Text
              size={'sm'}
              c={'gray.6'}
              mt={4}
            >
              Joined {moment(user?.createdAt).format('MMMM Do YYYY')}.
            </Text>
            {/* links */}
            <AboutMeLinks user={user} />
          </Flex>

          {/* achievements */}
          {Object.keys(user?.achievements || {}).length ? (
            <Flex
              direction={'column'}
              mt={16}
            >
              <Group
                align="center"
                gap={8}
              >
                <IconBadges size={16} />
                <Title order={4}>Badges</Title>
              </Group>
              {!Object.keys(user?.achievements || {}).length ? (
                <Text
                  size={'md'}
                  c="gray.6"
                >
                  This user doesn&apos;t have any badges yet.
                </Text>
              ) : (
                <Flex style={styles.cellContainer}>
                  {Object.values(user?.achievements || {}).map((achievement: Achievement) => (
                    <AchievementItem
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </Flex>
              )}
            </Flex>
          ) : null}

          {/* organizations */}
          <Flex
            direction={'column'}
            mt={16}
          >
            <Group
              align="center"
              gap={8}
            >
              <IconUsersGroup size={16} />
              <Title order={4}>Organizations</Title>
            </Group>
            {user?.privacy?.organizations ? (
              !user?.organizations?.length ? (
                <Text
                  size={'md'}
                  c="gray.6"
                >
                  This user isn&apos;t in any organizations yet.
                </Text>
              ) : (
                <Flex style={styles.cellContainer}>
                  {user?.organizations?.map((organization: Organization) => (
                    <OrganizationItem
                      key={organization.id}
                      organization={organization}
                    />
                  ))}
                </Flex>
              )
            ) : (
              <Text
                size={'md'}
                c="gray.6"
              >
                This user&apos;s organizations are private.
              </Text>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

function AboutMeLinks({ user }: { user: User }) {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Flex
      direction={'column'}
      pt={8}
    >
      {/* home page */}
      {user?.about?.website && (
        <Button
          variant={colorScheme === 'dark' ? 'light' : 'subtle'}
          color={colorScheme === 'dark' ? 'gray' : 'dark'}
          w={'fit-content'}
          px={0}
          style={{
            // backgroundColor: 'var(--mantine-color-default)',
            border: '1px solid var(--mantine-color-default-border)',
            borderRadius: '24px'
          }}
        >
          <Flex
            align={'center'}
            gap={8}
            mx={16}
          >
            <IconHome size={14} />
            <Anchor
              size={'sm'}
              fw={'bold'}
              href={user?.about?.website}
              c={'inherit'}
              target={'_blank'}
              maw={240}
              style={{
                overflow: 'hidden',
                // textUnderlineOffset: '0.25rem',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.about?.website}
              {/* <IconExternalLink
                size={12}
                style={{ marginLeft: 4 }}
              /> */}
            </Anchor>
          </Flex>
        </Button>
      )}
    </Flex>
  );
}

function OrganizationItem({ organization }: { organization: Organization | never }) {
  return (
    <Tooltip.Floating label={organization?.name}>
      <Avatar
        component={NextLink}
        href={`/organizations/${organization.id}`}
        alt={organization?.name}
        src={organization?.avatar}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '8px',
          border: '1px solid var(--mantine-color-default-border)'
        }}
      />
    </Tooltip.Floating>
  );
}

function AchievementItem({ achievement }: { achievement: Achievement | never }) {
  return (
    <Tooltip.Floating label={achievement?.name}>
      <UnstyledButton
        onClick={() =>
          modals.open({
            size: 480,
            title: (
              <>
                <Title order={4}>About {achievement?.name}</Title>
              </>
            ),
            children: (
              <Flex
                direction={'row'}
                gap={16}
              >
                <Image
                  src={achievement?.icon}
                  w={96}
                  h={96}
                  alt={achievement?.name}
                  style={{
                    borderRadius: '8px',
                    aspectRatio: '1 / 1',
                    objectFit: 'contain'
                    // border: '1px solid var(--mantine-color-default-border)'
                  }}
                />
                <Flex
                  direction={'column'}
                  gap={8}
                  h={'100%'}
                >
                  <Text maw={300}>{achievement?.description}</Text>
                  <Text fw={'bold'}>Unlocked on {moment(achievement.earnedAt).format('MMMM Do YYYY')}.</Text>
                </Flex>
              </Flex>
            )
          })
        }
      >
        <Image
          src={achievement?.icon}
          alt={achievement?.name}
          w={72}
          h={72}
          style={{
            borderRadius: '8px'
            // border: '1px solid var(--mantine-color-placeholder)'
          }}
        />
      </UnstyledButton>
    </Tooltip.Floating>
  );
}
