// special OAuth2 flow for Discord

import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Discord() {
  const { query, push } = useRouter();
  const { currentUser, user, refreshCurrentUser } = useAuthContext();

  useEffect(() => {
    if (!user || !query) return;
    
    let code = query.code;
    if (code) {
      user.getIdToken().then((token: string) => {
        fetch("/api/v1/me/discord", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              refreshCurrentUser();
              push("/platform/settings/3?discordLinked=true");
            }
          });
      }).catch((err: any) => {
        console.log(err);
      }).finally(() => {
        
      });
    } else {
      push("/platform/settings/3?discordLinked=false");
    }
    if (query.error) {
      push("/platform/settings/3?discordLinked=false");
    }
  }, [user, query]);

  return <>
  </>
}
