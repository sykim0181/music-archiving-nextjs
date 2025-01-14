import type { Metadata } from "next";

import "./globals.scss";
import Providers from "@/lib/redux/Providers";
import SupabaseAuthProvider from "@/lib/supabase/SupabaseAuthProvider";
import { freesentation } from "./fonts";
import QueryClientContextProvider from "@/components/QueryClientContextProvider";

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
      <body className={freesentation.className} style={{ margin: 0 }}>
        <QueryClientContextProvider>
          <Providers>
            <SupabaseAuthProvider>
              {children}
            </SupabaseAuthProvider>
          </Providers>
        </QueryClientContextProvider>
      </body>
    </html>
  );
}
