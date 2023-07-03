// Components
import { Container, Heading } from "@chakra-ui/react";

// Layouts
import UserProfile from "@/components/UserProfile";
import Layout from "@/layouts/PlatformLayout";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import Head from "next/head";

export default function UserProfileNS() {
  const { currentUser } = useAuthContext();

  return (
    <UserProfile/>
  );

}

UserProfileNS.getLayout = (page: any) => <Layout>{page}</Layout>;
