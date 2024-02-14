import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";
import { dark } from "@clerk/themes";

import type { Metadata } from "next";
import "./globals.css";
import "../styles/prism.css";
import ThemeProvider from "@/context/ThemeProvider";

export const metadata: Metadata = {
	title: "Dev Overflow",
	description: "A place for developers to share their knowledge",
	icons: {
		icon: "/assets/images/site-logo.svg",
	},
};

const inter = Inter({
	subsets: ["latin", "latin-ext"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin", "latin-ext"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-spaceGrotesk",
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${inter.variable} ${spaceGrotesk.variable}`}>
				<ThemeProvider>
					<ClerkProvider
						appearance={{
							baseTheme: dark,
							elements: {
								formButtonPrimary: "primary-gradient",
								footerActionLink:
									"primary-text-gradient hover:text-primary-500",
							},
						}}
					>
						{children}
					</ClerkProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
