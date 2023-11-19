/*
 * Name: AuthContext.tsx
 * Author: Pete Pongpeauk <pete@ppkl.dev>
 *
 * Copyright (c) 2023 Pete Pongpeauk and contributors
 * License: MIT License
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// firebase
import { UserCredential, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

// types
import { User } from '@/types';

// notifications
import { notifications } from '@mantine/notifications';

const AuthContext = createContext(null);

interface AuthContextValues {
  user: any;
  currentUser?: User | any;
  refreshCurrentUser: () => void;
  auth: any;
  getAuth: () => any;
  logOut: () => void;
  signOut: () => void;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  isAuthLoaded: boolean;
}

export function useAuthContext() {
  return useContext(AuthContext) as unknown as AuthContextValues;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);
  const { push } = useRouter();

  const refreshCurrentUser = useCallback(async () => {
    setIsAuthLoaded(false);
    if (user) {
      await user.getIdToken().then(async (token) => {
        await fetch('/api/v1/me', {
          headers: { authorization: `Bearer ${token}` }
        })
          .then((res) => {
            if (res.status === 200) {
              return res.json();
            } else {
              return res.json().then((json) => {
                throw new Error(json.message);
              });
            }
          })
          .then((data) => {
            setCurrentUser(data.user);
          })
          .catch(() => {
            notifications.show({
              title: 'A server error occurred.',
              message: 'Please try again later.',
              color: 'red'
            });
            setTimeout(() => {
              push('/auth/logout');
            }, 1000);
          });
      });
      setIsAuthLoaded(true);
    } else {
      setCurrentUser(null);
      setIsAuthLoaded(true);
    }
  }, [user, push]);

  async function waitForAuthInit() {
    let unsubscribe = null;
    await new Promise<void>((resolve) => {
      unsubscribe = auth.onAuthStateChanged((_) => resolve());
    });
    (await unsubscribe!)();
  }

  useEffect(() => {
    setIsAuthLoaded(false);
    async function checkUser() {
      // Wait for auth to initialize before checking if the user is logged in
      await waitForAuthInit().then(async () => {
        setIsAuthLoaded(true);
      });
    }
    checkUser();
  }, [user]);

  useEffect(() => {
    refreshCurrentUser();
  }, [user, refreshCurrentUser]);

  function logOut() {
    signOut(auth);
  }

  const values = {
    user,
    currentUser,
    refreshCurrentUser,
    auth,
    getAuth,
    logOut,
    signOut,
    signInWithEmailAndPassword,
    isAuthLoaded
  } as unknown as AuthContextValues;

  return <AuthContext.Provider value={values as any}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
