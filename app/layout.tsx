import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { OfuseButton } from "@/components/OfuseButton";
import { cn } from "@/lib/utils";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "限界SEアラサー女子の日常 - 公式ポートフォリオ",
    description: "バグとラテに支配された日常を描く、エンジニア共感必至の漫画サイト。",
    icons: {
        icon: '/icon.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className={cn(notoSansJP.className, "bg-background text-foreground antialiased")}>
                {children}
                <OfuseButton />
            </body>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
        </html>
    );
}
