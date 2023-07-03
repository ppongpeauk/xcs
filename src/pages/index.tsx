import Footer from "@/components/Footer";
import Home from "@/components/Home";
import Nav from "@/components/Nav";
import Head from "next/head";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>EVE XCS | Home</title>
        <meta key={1} name="description" content="EVE XCS" />
        <link key={1} rel="icon" href="/favicon.ico" />

        <meta key={1} property="og:site_name" content="EVE XCS" />
        <meta key={1} property="og:title" content="EVE XCS" />
        <meta key={1} property="og:type" content="website" />
        <meta key={1} property="og:url" content="https://xcs.restrafes.co/" />
        <meta key={1} property="og:image" content="/images/hero3.jpg" />
        <meta
          key={1}
          property="og:description"
          content="Control your access points with ease."
        />
      </Head>
      <Nav />
      <Home />
      <Footer />
    </>
  );
}
