import { ButtonGroup, Heading, useDisclosure, useToast } from '@chakra-ui/react';

import { Box, Button, Title, Text, rem, Group } from '@mantine/core';
import moment from 'moment';
import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

import DeleteDialog from '@/components/DeleteDialog';
import { Link } from '@chakra-ui/next-js';
import { IconLink, IconLinkOff } from '@tabler/icons-react';

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
      fetch('/api/v1/me/roblox', {
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
          <Title size={rem(24)}>Roblox</Title>
          {!currentUser?.roblox?.verified ? (
            <>
              <Text py={1}>
                You&apos;ve linked your Roblox account to {currentUser?.roblox.username} on{' '}
                {moment(currentUser?.roblox.verifiedAt).format('MMMM Do YYYY.')}
              </Text>
              <Button
                mt={8}
                color={'red'}
                leftSection={<IconLinkOff size={16} />}
                onClick={() => {
                  onUnlinkRobloxOpen();
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
          <Title size={rem(24)}>Discord</Title>
          <Text py={1}>
            Link your Discord account to Restrafes XCS to receive the <strong>XCS</strong> role on the{' '}
            <Link
              href={'https://discord.gg/BWVa3yE9M3'}
              target="_blank"
              textDecor={'underline'}
            >
              R&C Community
            </Link>
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
                    onUnlinkDiscordOpen();
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
