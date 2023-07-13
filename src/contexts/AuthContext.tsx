import { auth } from "@/lib/firebase";
import { createContext, useContext, useEffect, useState } from "react";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext) as any;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState<boolean>(false);

  async function refreshCurrentUser() {
    setIsAuthLoaded(false);
    if (user) {
      user.getIdToken().then((token) => {
        fetch("/api/v1/me", {
          headers: { authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            setCurrentUser(data.user);
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
    function checkUser() {
      // Wait for auth to initialize before checking if the user is logged in
      waitForAuthInit().then(async () => {
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
    isAuthLoaded,
  } as any;

  return (
    <AuthContext.Provider value={values as any}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
