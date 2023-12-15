import { useAuthContext } from '@/contexts/AuthContext';
import { UserNotification } from '@/types';
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Indicator,
  Text,
  Tooltip,
  useMantineColorScheme
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconAlertCircleFilled, IconCheck, IconCircleCheck } from '@tabler/icons-react';
import moment from 'moment';
import { useCallback, useState } from 'react';

export default function Notification({
  notification,
  refresh
}: {
  notification: UserNotification;
  refresh: () => void;
}) {
  const { user, currentUser } = useAuthContext();
  const { colorScheme } = useMantineColorScheme();
  const [primaryButtonLoading, setPrimaryButtonLoading] = useState(false);
  const [secondaryButtonLoading, setSecondaryButtonLoading] = useState(false);
  const [dismissButtonLoading, setDismissButtonLoading] = useState(false);

  const handlePrimaryButton = useCallback(async () => {
    setPrimaryButtonLoading(true);
    switch (notification?.type) {
      case 'organization-invitation':
        const token = await user.getIdToken();
        await fetch(`/api/v2/me/notifications/${notification.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'accept'
          })
        })
          .then((response) => {
            if (response.ok) {
              notifications.show({
                message: 'Invitation accepted successfully.',
                color: 'green',
                autoClose: 5000
              });
              refresh();
            } else {
              notifications.show({
                message: 'Something went wrong while accepting the invitation.',
                color: 'red',
                autoClose: 5000
              });
            }
          })
          .finally(() => {
            setPrimaryButtonLoading(false);
          });
        break;
      default:
        console.log('Unknown notification type');
    }
  }, [notification, user]);

  const handleSecondaryButton = useCallback(async () => {
    setSecondaryButtonLoading(true);
    switch (notification?.type) {
      case 'organization-invitation':
        const token = await user.getIdToken();
        await fetch(`/api/v2/me/notifications/${notification.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'reject'
          })
        })
          .then((response) => {
            if (response.ok) {
              refresh();
            } else {
              notifications.show({
                message: 'Something went wrong while rejecting the invitation.',
                color: 'red',
                autoClose: 5000
              });
            }
          })
          .finally(() => {
            setSecondaryButtonLoading(false);
          });
        break;
      default:
        console.log('Unknown notification type');
    }
  }, []);

  const handleDismissButton = useCallback(async () => {
    setDismissButtonLoading(true);
    const token = await user.getIdToken();
    await fetch(`/api/v2/me/notifications/${notification.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        action: 'dismiss'
      })
    })
      .then((response) => {
        if (response.ok) {
          refresh();
        } else {
          notifications.show({
            message: 'Something went wrong while dismissing the notification.',
            color: 'red',
            autoClose: 5000
          });
        }
      })
      .finally(() => {
        setDismissButtonLoading(false);
      });
  }, []);

  return (
    <>
      <Flex
        px={8}
        key={notification?.id}
      >
        <Indicator
          position="top-start"
          size={8}
          color="red"
          disabled={notification?.read}
        >
          <Flex gap={16}>
            <Tooltip.Floating
              disabled={!notification?.organization}
              label={notification?.organization?.name}
            >
              <Flex
                pos={'relative'}
                w={84}
              >
                {notification?.icon ? (
                  notification?.type === 'organization-invitation' ? (
                    <Flex
                      pos={'relative'}
                      w={'100%'}
                      h={72}
                    >
                      <Avatar
                        src={notification?.icon}
                        alt={'Notification Icon'}
                        size={'lg'}
                        radius={8}
                        pos={'absolute'}
                      />
                      <Avatar
                        src={notification?.sender?.avatar}
                        size={'sm'}
                        radius={'xl'}
                        pos={'absolute'}
                        style={{
                          border: '2px solid var(--mantine-color-default)',

                          // move to bottom end
                          bottom: '4px',
                          right: '0px'
                        }}
                      />
                    </Flex>
                  ) : (
                    <Flex
                      justify={'center'}
                      w={'100%'}
                    >
                      <Avatar
                        src={notification?.icon}
                        alt={'Notification Icon'}
                        size={'lg'}
                        radius={8}
                      />
                    </Flex>
                  )
                ) : (
                  <Flex
                    justify={'center'}
                    w={'100%'}
                  >
                    <IconAlertCircleFilled size={48} />
                  </Flex>
                )}
              </Flex>
            </Tooltip.Floating>
            <Flex
              direction={'column'}
              h={'max-content'}
              w={'100%'}
              pt={4}
            >
              <Text
                size="sm"
                fw={'bold'}
              >
                {notification?.title}
              </Text>
              <Text
                size="xs"
                c={'var(--mantine-color-placeholder)'}
              >
                {moment(notification?.createdAt).calendar()}
                {notification?.sender &&
                  ` — by ${notification?.sender?.displayName} (@${notification?.sender?.username})`}
              </Text>
              {notification?.description && (
                <Text
                  size="xs"
                  pt={4}
                >
                  {notification?.description}
                </Text>
              )}
              <Flex
                direction={'row'}
                align={'center'}
                gap={8}
                mt={4}
              >
                {notification?.type === 'organization-invitation' && (
                  <>
                    <Button
                      variant={colorScheme === 'light' ? 'filled' : 'light'}
                      color={colorScheme === 'light' ? 'dark' : 'gray'}
                      size={'xs'}
                      radius={8}
                      onClick={handlePrimaryButton}
                      loading={primaryButtonLoading}
                    >
                      Accept
                    </Button>
                    <Button
                      variant={'default'}
                      size={'xs'}
                      radius={8}
                      onClick={handleSecondaryButton}
                      loading={secondaryButtonLoading}
                    >
                      Ignore
                    </Button>
                  </>
                )}
                {notification?.dismissible && (
                  <Button
                    variant={colorScheme === 'light' ? 'filled' : 'light'}
                    color={colorScheme === 'light' ? 'dark' : 'gray'}
                    size={'xs'}
                    radius={8}
                    leftSection={<IconCircleCheck size={16} />}
                    onClick={handleDismissButton}
                    loading={dismissButtonLoading}
                  >
                    Dismiss
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Indicator>
      </Flex>
    </>
  );
}
