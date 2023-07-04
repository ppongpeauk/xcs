// Components
import { Container, Heading } from "@chakra-ui/react";

// Layouts
import UserProfile from "@/components/UserProfile";
import Layout from "@/layouts/PlatformLayout";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function UserProfileNS() {
  const { query, push } = useRouter();
  const { currentUser } = useAuthContext();
  let { username: queryUsername } = query;
  const username = queryUsername?.length ? queryUsername[0] : currentUser?.username;

  return <UserProfile username={username}/>;
}

UserProfileNS.getLayout = (page: any) => <Layout>{page}</Layout>;
