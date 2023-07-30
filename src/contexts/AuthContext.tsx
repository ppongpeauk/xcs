import { createContext, useContext, useEffect, useState } from 'react';

import { useToast } from '@chakra-ui/react';

import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/firebase';

const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext) as any;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);
  const toast = useToast();
  const { push } = useRouter();

  async function refreshCurrentUser() {
    setIsAuthLoaded(false);
    if (user) {
      user.getIdToken().then((token) => {
        fetch('/api/v1/me', {
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
          .catch((err) => {
            toast({
              title: 'An error occurred while fetching your user data.',
              description: 'Please try again later. If this issue persists, please contact customer support.',
              status: 'error',
              duration: 16000,
              isClosable: true
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
  }

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
  }, [user]);

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
  } as any;

  return <AuthContext.Provider value={values as any}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
