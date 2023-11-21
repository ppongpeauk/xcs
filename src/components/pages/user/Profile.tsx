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
  Anchor
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
  IconUsersGroup
} from '@tabler/icons-react';

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
            <Title order={4}>@{user?.username}</Title>
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
              size={'md'}
              c={!user?.about?.bio ? 'gray.6' : 'unset'}
              style={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {user?.about?.bio || 'This user has not set a bio yet.'}
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
                <IconTrophy size={16} />
                <Title order={4}>Achievements</Title>
              </Group>
              {!Object.keys(user?.achievements || {}).length ? (
                <Text
                  size={'md'}
                  c="gray.6"
                >
                  This user doesn&apos;t have any achievements yet.
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
  return (
    <Flex
      direction={'column'}
      pt={8}
    >
      {/* home page */}
      {user?.about?.website && (
        <Flex
          align={'center'}
          gap={8}
        >
          <IconHome size={16} />
          <Anchor
            size={'md'}
            fw={'bold'}
            href={user?.about?.website}
            c={'inherit'}
            target={'_blank'}
            maw={240}
            style={{
              overflow: 'hidden',
              textUnderlineOffset: '0.25rem',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {user?.about?.website}
            <IconExternalLink
              size={12}
              style={{ marginLeft: 4 }}
            />
          </Anchor>
        </Flex>
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
            size: 'md',
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
                <AspectRatio
                  ratio={1}
                  w={'128px'}
                >
                  <Avatar
                    src={achievement?.icon}
                    style={{
                      borderRadius: '8px',
                      border: '1px solid var(--mantine-color-default-border)'
                    }}
                  />
                </AspectRatio>
                <Flex
                  direction={'column'}
                  gap={8}
                >
                  <Text>{achievement?.description}</Text>
                  <Text fw={'bold'}>
                    Unlocked on {new Date(achievement.earnedAt || 0).toLocaleDateString('en-US', {})}.
                  </Text>
                </Flex>
              </Flex>
            )
          })
        }
      >
        <Avatar
          alt={achievement?.name}
          src={achievement?.icon}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            border: '1px solid var(--mantine-color-placeholder)'
          }}
        />
      </UnstyledButton>
    </Tooltip.Floating>
  );
}
