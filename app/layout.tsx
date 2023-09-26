import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Space_Grotesk } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

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
		<ClerkProvider
			appearance={{
				elements: {
					formButtonPrimary: "primary-gradient",
					footerActionLink: "primary-text-gradient hover:text-primary-500",
				},
			}}
		>
			<html lang="en">
				<body className={`${inter.variable} ${spaceGrotesk.variable}`}>
					<h1 className="h1-bold">This is a peice of code</h1>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
