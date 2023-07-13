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

  useEffect(() => {
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
    }
  }, [user]);

  function logOut() {
    signOut(auth);
  }

  const values = {
    user,
    currentUser,
    auth,
    getAuth,
    logOut,
    signOut,
    signInWithEmailAndPassword,
  } as any;

  return (
    <AuthContext.Provider value={values as any}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
