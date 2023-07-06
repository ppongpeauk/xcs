/* eslint-disable react-hooks/rules-of-hooks */
import Invitation from "@/components/Invitation";
import Head from "next/head";
import { useRouter } from "next/router";

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
      return ret.invitation || null;
    });

  return {
    props: {
      invite: invite || null,
    },
  };
}

export default function Invite({ invite }: any) {
  const { query } = useRouter();

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
        <title>EVE XCS - Invitation</title>

        {invite ? (
          <>
            <meta name="og:site_name" content={"EVE XCS"} />
            <meta name="og:title" content={"EVE XCS - Invitation"} />
            <meta
              name="og:url"
              content={`https://xcs.restrafes.co/invite/${query.id}`}
            />
            <meta name="og:type" content="website" />
            <meta name="og:image" content={invite.from.avatar} />
            <meta
              name="og:description"
              content={`You've been invited by ${invite.from.name.first} to ${
                inviteTypeSwitch(invite.type) || "join their organization"
              }.`}
            />
          </>
        ) : null}

        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        {/* {invite ? (
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
        )} */}
      </Head>
      <Invitation invite={invite} />
    </>
  );
}
