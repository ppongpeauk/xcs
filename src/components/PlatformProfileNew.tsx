/* eslint-disable react-hooks/rules-of-hooks */

import { Link } from '@chakra-ui/next-js';
import { useToast } from '@chakra-ui/react';
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
  Group
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
  IconCheck,
  IconLink,
  IconMoodSmile,
  IconSettings,
  IconSettings2,
  IconTrophy,
  IconUsersGroup
} from '@tabler/icons-react';

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

export default function Profile({ username, user }: { username: string | null; user: User }) {
  const router = useRouter();
  const { currentUser, user: authUser } = useAuthContext();
  // const [user, setUser] = useState<any | undefined>(undefined);
  const toast = useToast();
  const { colorScheme } = useMantineColorScheme();

  const styles = {
    badgeContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '300px',
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
      minWidth: '128px',
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
          <title>{`${user?.displayName || user?.name?.first}'s Profile`} - Restrafes XCS</title>
        ) : (
          <title>{`Profile - Restrafes XCS`}</title>
        )}
      </Head>
      <Container
        display={'flex'}
        size={'full'}
        px={8}
        pt={8}
        style={{
          flexDirection: 'column',
          justifyContent: 'center'
        }}
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
            gap={4}
          >
            <Text
              size={rem(24)}
              fw={'bold'}
              mt={4}
            >
              {user?.displayName}
            </Text>
            <Text size={'lg'}>@{user?.username}</Text>
          </Flex>
        </Flex>

        {currentUser?.id === user?.id && (
          <Button
            mt={16}
            component={NextLink}
            color={'dark.5'}
            href={'/settings/profile'}
            w={{ base: '300px', md: '300px' }}
            mb={4}
            fullWidth
          >
            Edit profile
          </Button>
        )}

        {/* user about-me */}
        <Flex
          direction={'column'}
          mt={currentUser?.id === user?.id ? 16 : 32}
        >
          <Group
            align="center"
            gap={8}
          >
            <IconMoodSmile size={16} />
            <Title order={4}>About Me</Title>
          </Group>
          <Text
            size={'md'}
            c={!user?.bio ? 'gray.6' : 'unset'}
          >
            {user?.bio || 'This user has not set a bio yet.'}
          </Text>
        </Flex>

        {/* achievements */}
        {Object.keys(user?.achievements || {}).length && (
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
        )}

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
      </Container>
    </>
  );
}
