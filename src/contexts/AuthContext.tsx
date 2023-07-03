import { auth } from "@/lib/firebase";
import { createContext, useContext, useEffect, useState } from "react";

import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const AuthContext = createContext(null);

export function useAuthContext() {
  return useContext(AuthContext) as any;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {;
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    console.log(user);
  }, [user]);

  function logOut() {
    signOut(auth);
  }
  
  const values = {

    user,
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

