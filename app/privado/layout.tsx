'use client';

import { Suspense } from "react";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CustomThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Home/Header";
import { GroupProvider } from "@/context/GroupContext";
import RouteLoader from "../loading";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppRouterCacheProvider>
            <CustomThemeProvider>
                <Suspense fallback={<RouteLoader />}>
                    <GroupProvider>
                        <div className="bg-primary">
                        <Header />
                        {children}
                        </div>
                    </GroupProvider>
                </Suspense>
            </CustomThemeProvider>
        </AppRouterCacheProvider>
    );
}
