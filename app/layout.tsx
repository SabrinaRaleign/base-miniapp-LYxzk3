import type { Metadata } from "next";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import "./globals.css";

const queryClient = new QueryClient();

export const metadata: Metadata = {
  title: "Daily Check-in Badge",
  description: "Earn NFT badges by checking in daily on Base",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Base 平台验证（必须）*/}
        <meta name="base:app_id" content="69c22f7b3c2c56b9bbd2f616" />
        
        {/* Talent 平台验证（必须）*/}
        <meta name="talentapp:project_verification" content="e369908d59c890cf2d85d5b2a20b989e970119665fc4db1bfcdfcd9b8373649226a2f11a7194f009986d7c0fe2a06e8ce50465214da1f2edbfe293db6534e64d" />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
