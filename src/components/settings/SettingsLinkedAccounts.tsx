import { ButtonGroup, Heading, useDisclosure, useToast } from '@chakra-ui/react';

import { Box, Button, Title, Text, rem, Group, Anchor } from '@mantine/core';
import moment from 'moment';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import DeleteDialog from '@/components/DeleteDialog';
import NextLink from 'next/link';
import { IconLink, IconLinkOff } from '@tabler/icons-react';
import { modals } from '@mantine/modals';

export default function SettingsLinkedAccounts() {
  const { currentUser, refreshCurrentUser, user } = useAuthContext();
  const toast = useToast();
  const { push, query } = useRouter();
  const { isOpen: isUnlinkRobloxOpen, onOpen: onUnlinkRobloxOpen, onClose: onUnlinkRobloxClose } = useDisclosure();
  const { isOpen: isUnlinkDiscordOpen, onOpen: onUnlinkDiscordOpen, onClose: onUnlinkDiscordClose } = useDisclosure();

  const unlinkDiscord = async () => {
    user.getIdToken().then((token: string) => {
      fetch('/api/v1/me/discord', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then((json: any) => {
              throw new Error(json.message);
            });
          }
        })
        .then((data) => {
          toast({
            title: data.message,
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        })
        .catch((err) => {
          toast({
            title: 'There was an error while unlinking your Discord account.',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        })
        .finally(() => {
          refreshCurrentUser();
        });
    });
  };

  const unlinkRoblox = async () => {
    user.getIdToken().then((token: string) => {
      fetch('/api/v2/me/roblox', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return res.json().then((json: any) => {
              throw new Error(json.message);
            });
          }
        })
        .then((data) => {
          toast({
            title: data.message,
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        })
        .catch((err) => {
          toast({
            title: 'There was an error while unlinking your Roblox account.',
            description: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        })
        .finally(() => {
          refreshCurrentUser();
        });
    });
  };

  return (
    <>
      <DeleteDialog
        title={'Unlink Roblox Account'}
        body={'Are you sure you want to unlink your Roblox account?'}
        buttonText={'Unlink Account'}
        isOpen={isUnlinkRobloxOpen}
        onClose={onUnlinkRobloxClose}
        onDelete={() => {
          unlinkRoblox();
          onUnlinkRobloxClose();
        }}
      />
      <DeleteDialog
        title={'Unlink Discord Account'}
        body={'Are you sure you want to unlink your Discord account?'}
        buttonText={'Unlink Account'}
        isOpen={isUnlinkDiscordOpen}
        onClose={onUnlinkDiscordClose}
        onDelete={() => {
          unlinkDiscord();
          onUnlinkDiscordClose();
        }}
      />
      <Box>
        <Box
          id={'roblox'}
          mb={4}
        >
          <Title order={4}>Roblox</Title>
          {currentUser?.roblox?.verified ? (
            <>
              <Text py={1}>
                You&apos;ve linked your XCS account to {currentUser?.roblox.username} on{' '}
                {moment(currentUser?.roblox.verifiedAt).format('MMMM Do YYYY.')}
              </Text>
              <Button
                mt={8}
                color={'red'}
                leftSection={<IconLinkOff size={16} />}
                onClick={() => {
                  // onUnlinkRobloxOpen();
                  modals.openConfirmModal({
                    title: <Title order={4}>Unlink Roblox account?</Title>,
                    children: <Text size="sm">Are you sure you want to unlink your Roblox account?</Text>,
                    labels: { confirm: 'Unlink', cancel: 'Nevermind' },
                    confirmProps: { color: 'red' },
                    onConfirm: () => {
                      unlinkRoblox();
                    },
                    radius: 'md'
                  });
                }}
              >
                Unlink
              </Button>
            </>
          ) : (
            <>
              <Text py={1}>You have not linked your Roblox account yet. Please link one to use Restrafes XCS.</Text>
              <Button
                mt={8}
                color={'dark.5'}
                onClick={() => {
                  push(
                    `https://apis.roblox.com/oauth/v1/authorize?client_id=${process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_ROOT_URL}/platform/verify/oauth2/roblox&scope=openid profile&response_type=code`
                  );
                }}
                leftSection={<IconLink size={16} />}
              >
                Link Roblox Account
              </Button>
            </>
          )}
        </Box>

        <Box
          id={'discord'}
          mt={16}
          mb={4}
        >
          <Title order={4}>Discord</Title>
          <Text py={1}>
            Link your Discord account to Restrafes XCS to receive the <strong>XCS</strong> role on the{' '}
            <Anchor
              component={NextLink}
              href={'https://discord.gg/BWVa3yE9M3'}
              target="_blank"
              c={'inherit'}
              style={{
                textUnderlineOffset: '0.25rem',
                textDecoration: 'underline'
              }}
            >
              R&C Community
            </Anchor>
            .
          </Text>
          {currentUser?.discord.verified ? (
            <>
              <Text>
                You&apos;ve linked your Discord account using{' '}
                <span>
                  {currentUser?.discord.username}
                  {currentUser?.discord.discriminator && `#${currentUser?.discord.discriminator}`}
                </span>{' '}
                on {moment(currentUser?.discord.verifiedAt).format('MMMM Do YYYY.')}
              </Text>
              <Group mt={8}>
                <Button
                  color={'red'}
                  leftSection={<IconLinkOff size={16} />}
                  onClick={() => {
                    // onUnlinkDiscordOpen();
                    modals.openConfirmModal({
                      title: <Title order={4}>Unlink Discord account?</Title>,
                      children: <Text size="sm">Are you sure you want to unlink your Discord account?</Text>,
                      labels: { confirm: 'Unlink', cancel: 'Nevermind' },
                      confirmProps: { color: 'red' },
                      onConfirm: () => {
                        unlinkDiscord();
                      },
                      radius: 'md'
                    });
                  }}
                >
                  Unlink
                </Button>
                <Button
                  color={'dark.5'}
                  onClick={() => {
                    push(
                      `https://discord.com/api/oauth2/authorize?client_id=1127492928995078215&redirect_uri=${process.env.NEXT_PUBLIC_ROOT_URL}/verify/oauth2/discord&response_type=code&scope=identify`
                    );
                  }}
                  leftSection={<IconLink size={16} />}
                >
                  Link Another Account
                </Button>
              </Group>
            </>
          ) : (
            <>
              <Text>You have not linked your Discord account.</Text>
              <Button
                mt={8}
                color={'dark.5'}
                onClick={() => {
                  push(
                    `https://discord.com/api/oauth2/authorize?client_id=1127492928995078215&redirect_uri=${process.env.NEXT_PUBLIC_ROOT_URL}/verify/oauth2/discord&response_type=code&scope=identify`
                  );
                }}
                leftSection={<IconLink size={16} />}
              >
                Link Discord Account
              </Button>
            </>
          )}
        </Box>
      </Box>
    </>
  );
}
