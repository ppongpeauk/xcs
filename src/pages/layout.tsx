import { Golos_Text } from "next/font/google";
const font = Golos_Text({ subsets: ["latin"] });



export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={font.className}>
      {children}
    </main>
  );
}
