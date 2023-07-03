// React
import { useContext, useEffect } from "react";

// Next
import { useRouter } from "next/router";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";

export default function Logout() {
  const router = useRouter();
  const { logOut } = useAuthContext();

  useEffect(() => {
    logOut();
    router.push("/");
  }, []);

  return (
    <>
    </>
  );
}
