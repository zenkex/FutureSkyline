import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono, Noto_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGroteskHeading = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "FutureSkyline",
    description: "Next Future Skyline",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", spaceGrotesk.variable, geistMono.variable, "font-sans", notoSans.variable, spaceGroteskHeading.variable)}
        >
            <body className="min-h-full flex flex-col">
                {children}
                <Script src="/js/starfield.js" strategy="lazyOnload" />
            </body>
        </html>
    );
}
