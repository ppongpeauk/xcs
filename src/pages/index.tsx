import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Nav from "@/components/Nav";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>EVE XCS | Home</title>
        <meta name="description" content="EVE XCS" />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph Protocol */}
        <meta property="og:title" content="EVE XCS" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://xcs.restrafes.co/" />
        <meta property="og:image" content="/images/hero3.jpg" />
        <meta property="og:description" content="Control your access points with ease." />
      </Head>
      <Nav />
      <Home />
      <Footer />
    </>
  );
}
