// Next
import { Head, Html, Main, NextScript } from "next/document";

// Providers
import AuthProvider from "@/contexts/AuthContext";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <AuthProvider>
        <body>
          <Main />
          <NextScript />
        </body>
      </AuthProvider>
    </Html>
  );
}
