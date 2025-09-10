import type { Metadata } from "next";

import "./globals.scss";
import ReduxStoreProvider from "@/components/providers/ReduxStoreProvider";
import SupabaseAuthProvider from "@/components/providers/SupabaseAuthProvider";
import { freesentation } from "./fonts";
import QueryClientContextProvider from "@/components/providers/QueryClientContextProvider";
import Head from "next/head";
import MainLayout from "@/components/layouts/MainLayout";

export const metadata: Metadata = {
  title: "Music-Archiving",
  description: "Archive Your Music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://api.spotify.com" />
      </Head>
      <body className={freesentation.className} style={{ margin: 0 }}>
        <QueryClientContextProvider>
          <ReduxStoreProvider>
            <SupabaseAuthProvider>
              <MainLayout>{children}</MainLayout>
            </SupabaseAuthProvider>
          </ReduxStoreProvider>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
