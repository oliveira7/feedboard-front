import { Suspense } from "react";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CustomThemeProvider } from "@/context/ThemeContext";
import { SnackbarProvider } from "@/context/SnackBarContext";
import Header from "@/components/Home/Header";
import { GroupProvider } from "@/context/GroupContext";

export default function PrivateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppRouterCacheProvider>
            <CustomThemeProvider>
                <SnackbarProvider>
                    <GroupProvider>

                        <Header />
                        {children}
                    </GroupProvider>

                </SnackbarProvider>
            </CustomThemeProvider>
        </AppRouterCacheProvider>
    );
}
