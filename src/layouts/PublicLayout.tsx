import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {children}
      <Footer type={'public'} />
    </>
  )
}