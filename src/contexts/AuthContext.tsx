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
  const [currentUser, setCurrentUser] = useState<any>({
    name: {
      first: "Pete",
      last: "Pongpeauk",
    },
    username: "restrafes",
    id: "FF0gCiIJYUPfmA4CTfqXTyPcHQb2",
    email: "kurtsiberg@gmail.com",
    avatar: "https://cdn.discordapp.com/attachments/998830838999421029/1106249233901834381/slouch3.png",
    bio: "I'm a cool guy",
    location: "New York, NY",
    website: "https://ppngpkl.dev",
  });

  useEffect(() => {
    console.log(user);
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

