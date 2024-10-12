import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Suspense } from "react";
import RouteLoader from "../loading";
import Header from "@/components/Home/Header";


const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: `IT`,
  description: "Internet Banking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className={`h-full w-full ${montserrat.className}`}>
        <div className="shadow-md">
        <Header />
        </div>
        <Suspense fallback={<RouteLoader />}>{children}</Suspense>
      </body>
    </html>
  );
}
