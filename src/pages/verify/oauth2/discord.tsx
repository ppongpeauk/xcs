import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuthContext } from '@/contexts/AuthContext';
import { Center, Loader, Stack, Text, useMantineColorScheme } from '@mantine/core';

export default function Discord() {
  const { query, push } = useRouter();
  const { user, refreshCurrentUser } = useAuthContext();

  const code = useMemo(() => {
    return query.code;
  }, [query.code]);

  useEffect(() => {
    if (!user || (!query?.code && !query?.error)) return;

    if (code) {
      user
        .getIdToken()
        .then((token: string) => {
          fetch('/api/v1/me/discord', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code: code
            })
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                refreshCurrentUser();
                push('/settings/linked-accounts?discordLinked=true');
              } else {
                push('/settings/linked-accounts');
              }
            });
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => {});
    }
    if (query.error) {
      push('/settings/linked-accounts');
    }
  }, [user, code, push, query, refreshCurrentUser]);

  return (
    <Center
      w={'100%'}
      h={'100dvh'}
    >
      <Stack align="center">
        <Loader
          size={32}
          color={'var(--mantine-color-default-color)'}
        />
        <Text fw={'bold'}>Your account is being verified...</Text>
      </Stack>
    </Center>
  );
}
