// special OAuth2 flow for Discord
import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';
import { Container, Flex, Spinner, Text } from '@chakra-ui/react';

export default function Discord() {
  const { query, push } = useRouter();
  const { currentUser, user, refreshCurrentUser } = useAuthContext();

  useEffect(() => {
    if (!user || !query) return;

    let code = query.code;
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
                push('/settings/3?discordLinked=true');
              } else {
                push('/settings/3?discordLinked=false');
              }
            });
        })
        .catch((err: any) => {
          console.error(err);
        })
        .finally(() => { });
    } else {
      push('/settings/3?discordLinked=false');
    }
    if (query.error) {
      push('/settings/3?discordLinked=false');
    }
  }, [user, query, push, refreshCurrentUser]);

  return (
    <Container as={Flex} centerContent h={'100dvh'} align={'center'} justify={'center'}>
      <Spinner />
      <Text pt={4}>
        Verifying...
      </Text>
    </Container>
  );
}
