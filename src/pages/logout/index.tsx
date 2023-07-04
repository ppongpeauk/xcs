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
      <p>
        You have been logged out. You will be redirected to the home page in a few seconds.
      </p>
    </>
  );
}
