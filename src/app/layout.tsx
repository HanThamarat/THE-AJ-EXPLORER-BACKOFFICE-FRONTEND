import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ReduxProvider from "./hook/reduxProvider";
import "./globals.css";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "The AJ Explorer CMS",
  description: "The AJ Explorer CMS",
  icons: {
    icon: "/icon.png",         
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased text-[12px]`}
      >
        <ReduxProvider>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
