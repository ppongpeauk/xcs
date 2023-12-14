import {
  Container,
  Flex,
  Box,
  Title,
  Text,
  Button,
  UnstyledButton,
  Paper,
  Anchor,
  LoadingOverlay
} from '@mantine/core';
import { IconCircleCheckFilled, IconForbid2Filled, IconLogout } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useAuthContext } from '@/contexts/AuthContext';
import { useMediaQuery } from '@mantine/hooks';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function SettingsBeta() {
  const { user, currentUser, refreshCurrentUser, isAuthLoaded } = useAuthContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <>
      <Flex
        pos={'relative'}
        direction={'column'}
        gap={8}
      >
        <LoadingOverlay
          visible={!isAuthLoaded || !currentUser}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ size: 'md', color: 'var(--mantine-color-default-color)' }}
        />
        <Paper
          p={'lg'}
          withBorder
          mih={128}
          w={isMobile ? 'unset' : '100%'}
        >
          {isAuthLoaded &&
            currentUser &&
            (currentUser?.platform?.features?.beta?.enabled ? <EnrolledCard /> : <UnenrolledCard />)}
        </Paper>
      </Flex>
    </>
  );
}

function UnenrolledCard() {
  return (
    <>
      <Flex
        direction={'column'}
        align={'center'}
        gap={16}
        maw={512}
      >
        <IconForbid2Filled size={48} />
        <Flex direction={'column'}>
          <Title order={4}>You do not have permission to access this page</Title>
        </Flex>
      </Flex>
    </>
  );
}

function EnrolledCard() {
  const { user, currentUser, refreshCurrentUser } = useAuthContext();
  const { push } = useRouter();

  return (
    <>
      <Flex
        direction={'row'}
        align={'center'}
        gap={16}
        maw={512}
      >
        <IconCircleCheckFilled size={48} />
        <Flex direction={'column'}>
          <Title order={4}>You are currently enrolled</Title>
          <Text size={'sm'}>Beta program members are eligible for early access to new features.</Text>
          <Text size={'sm'}>
            You were enrolled into the beta program on{' '}
            <strong>{moment(currentUser?.platform?.features?.beta?.createdAt).format('MMMM Do, YYYY')}</strong>.
          </Text>
          <Flex
            mt={4}
            gap={4}
          >
            <Text size={'sm'}>Want to opt out?</Text>
            <UnstyledButton
              variant="filled"
              color="gray.8"
              w={'fit-content'}
              style={{
                textDecoration: 'underline',
                textUnderlineOffset: '0.25rem'
              }}
              onClick={() => {
                modals.openConfirmModal({
                  title: <Title order={4}>Leave Beta Program?</Title>,
                  children: (
                    <Text size="sm">
                      Are you sure you want to leave the beta program? You will lose access to early features.
                    </Text>
                  ),
                  labels: { confirm: 'Leave', cancel: 'Nevermind' },
                  confirmProps: { color: 'red' },
                  onConfirm: async () => {
                    const token = await user.getIdToken();
                    fetch(`/api/v2/me/beta-program`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` }
                    })
                      .then((res) => {
                        if (res.status === 200) return res.json();
                        throw new Error(`Failed to leave beta program. (${res.status})`);
                      })
                      .then(() => {
                        notifications.show({
                          message: 'You have left the beta program.',
                          color: 'green'
                        });
                        push('/settings/profile');
                        refreshCurrentUser();
                      })
                      .catch((error) => {
                        notifications.show({
                          title: 'There was an error leaving the beta program.',
                          message: error.message,
                          color: 'red'
                        });
                      });
                  },
                  radius: 'md'
                });
              }}
            >
              <Text size={'sm'}>Leave</Text>
            </UnstyledButton>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
