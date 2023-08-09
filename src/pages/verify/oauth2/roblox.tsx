import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export default function RobloxOauth2() {
  const { query, push } = useRouter();
  const { currentUser, refreshCurrentUser, user } = useAuthContext();

  const code = useMemo(() => {
    return query.code;
  }, [query.code]);

  useEffect(() => {
    if (!user || !query) return;

    if (!code) {
      push('/settings/3?robloxLinked=false');
    } else {
      user
        .getIdToken()
        .then((token: string) => {
          fetch('/api/v1/me/roblox', {
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
                push('/settings/3?robloxLinked=true');
              } else {
                push('/settings/3?robloxLinked=false');
              }
            });
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [user, code]);

  return <></>;
}
