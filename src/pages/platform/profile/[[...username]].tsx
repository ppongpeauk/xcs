// Components
import { Container, Heading } from "@chakra-ui/react";

// Layouts
import UserProfile from "@/components/PlatformProfile";
import Layout from "@/layouts/PlatformLayout";

// Authentication
import { useAuthContext } from "@/contexts/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

// Get profile data
export async function getServerSideProps({ query }: any) {
  if (!query.username) {
    return {
      props: {
        user: null,
      },
    };
  }

  const user = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/users/${query.username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((ret) => {
      return ret?.user;
    });
  return {
    props: {
      user: user ? user : null,
    },
  };
}
export default function UserProfileNS({ user }: any) {
  const { query, push } = useRouter();
  const { currentUser } = useAuthContext();
  let { username: queryUsername } = query;
  const username = queryUsername?.length
    ? queryUsername[0]
    : currentUser?.username;

  return (
    <>
      <Head>
        <meta property="og:site_name" content="Restrafes XCS" />
        {user ? (
          <>
            <meta
              property="og:title"
              content={`${user?.displayName || user.name.first}'s Profile`}
            />
            <meta
              property="og:url"
              content={`https://xcs.restrafes.co/platform/profile/${username}`}
            />
            <meta
              property="og:description"
              content={`Join ${user?.displayName || user.name.first} and a community of architects in managing access points effortlessly on Restrafes XCS.`}
            />
            <meta property="og:image" content={user.avatar} />
          </>
        ) : (
          <>
            <meta property="og:title" content={`Your Profile`} />
            <meta
              property="og:url"
              content={`https://xcs.restrafes.co/platform/profile`}
            />
            <meta
              property="og:description"
              content={`Join a community of architects in managing access points effortlessly on Restrafes XCS.`}
            />
          </>
        )}
        <meta property="og:type" content="website" />
      </Head>
      <UserProfile username={username} user={user} />
    </>
  );
}

UserProfileNS.getLayout = (page: any) => <Layout>{page}</Layout>;
