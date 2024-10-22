import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import RouteLoader from "./loading";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CustomThemeProvider } from "@/context/ThemeContext";
import { SnackbarProvider } from "@/context/SnackBarContext";


const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: `FeedBoard`,
  description: "FeedBoard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="h-full w-full" cz-shortcut-listen="false">
        <AppRouterCacheProvider>
          <CustomThemeProvider>
            <Suspense fallback={<RouteLoader />}>
            <SnackbarProvider>
            {children}
            </SnackbarProvider>
            </Suspense>
          </CustomThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
