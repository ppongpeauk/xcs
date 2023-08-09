// special OAuth2 flow for Discord
import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { useAuthContext } from '@/contexts/AuthContext';

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
              }
            });
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => { });
    } else {
      push('/settings/3?discordLinked=false');
    }
    if (query.error) {
      push('/settings/3?discordLinked=false');
    }
  }, [user, query]);

  return <></>;
}
