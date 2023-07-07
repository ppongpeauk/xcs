import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Nav from "@/components/Nav";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>EVE XCS – Home</title>
        <meta property="og:title" content="EVE XCS - Home" />
        <meta property="og:site_name" content="EVE XCS" />
        <meta property="og:url" content="https://xcs.restrafes.co" />
        <meta
          property="og:description"
          content="Control your access points with ease."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-square.png" />
      </Head>
      <Nav />
      <Home />
      <Footer />
    </>
  );
}
