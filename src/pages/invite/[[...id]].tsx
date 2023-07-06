/* eslint-disable react-hooks/rules-of-hooks */
import Invitation from "@/components/Invitation";
import Head from "next/head";

export async function getServerSideProps({ query }: any) {
  if (!query.id) {
    return {
      props: {
        invite: null,
      },
    };
  }

  const invite = await fetch(
    `${process.env.NEXT_PUBLIC_ROOT_URL}/api/v1/invitations/${query.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((ret) => {
      return ret?.invitation || null;
    });
  return {
    props: {
      invite,
    },
  };
}

export default function Invite({ invite }: any) {
  const inviteTypeSwitch = (type: string) => {
    switch (type) {
      case "organization":
        return "join their organization";
      case "xcs":
        return "register for an account";
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>EVE XCS | Invitation</title>
        {invite ? (
          <>
            <meta
              property="og:title"
              content={"Invitation from " + invite.from?.name.first}
            />
            <meta property="og:site_name" content="EVE XCS" />
            <meta
              property="og:url"
              content={`https://xcs.restrafes.co/invite/${invite.inviteCode}`}
            />
            <meta
              property="og:description"
              content={`You've been invited by ${
                invite.from?.name.first
              } to ${inviteTypeSwitch(invite.type)}.`}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:image"
              content={"https://xcs.restrafes.co/images/logo-white.png"}
            />
          </>
        ) : (
          <>
            <meta property="og:title" content={"Invitation"} />
            <meta
              property="og:url"
              content={`https://xcs.restrafes.co/`}
            />
            <meta property="og:type" content="website" />
            <meta
              property="og:image"
              content={"https://xcs.restrafes.co/images/logo-white.png"}
            />
          </>
        )}
      </Head>
      <Invitation invite={invite} />
    </>
  );
}