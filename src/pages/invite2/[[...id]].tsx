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
      return ret.invitation || null;
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
        <title>EVE XCS - Invitation</title>

        <meta name="og:site_name" content={"EVE XCS"} />
        <meta name="og:title" content={"Invitation"} />
        <meta name="og:url" content={`https://xcs.restrafes.co/invite/HULLO`} />
        <meta name="og:type" content="website" />
        <meta
          name="og:image"
          content={"https://cdn.discordapp.com/attachments/998830838999421029/1106249233901834381/slouch3.png"}
        />
        <meta name="og:description" content={"You've been invited by Pete to create an account."} />
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
    </>
  );
}
