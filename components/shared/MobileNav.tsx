"use client";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavContent from "./NavContent";

const MobileNav = () => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Image
					src="/assets/icons/hamburger.svg"
					alt={"Menu"}
					width={36}
					height={36}
					className="sm:hidden "
				/>
			</SheetTrigger>
			<SheetContent
				side="left"
				className="background-light900_dark200 border-none"
			>
				<Link href="/" className="flex items-center gap-1">
					<Image
						src="/assets/images/site-logo.svg"
						alt="DevFlow logo"
						width={23}
						height={23}
					/>
					<p className="h2-bold text-dark-100 dark:text-light-900 font-spaceGrotesk">
						Dev <span className="text-primary-500">Overflow</span>
					</p>
				</Link>
				<div>
					<SheetClose asChild>
						<NavContent hide={false} />
					</SheetClose>
					<SignedOut>
						<div className="flex flex-col gap-3">
							<SheetClose asChild>
								<Link href="/sign-in">
									<Button className="small-medium light-border-2 btn-secondary min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
										<span className="primary-text-gradient">Log in</span>
									</Button>
								</Link>
							</SheetClose>
							<SheetClose asChild>
								<Link href="/sign-up">
									<Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
										Sign Up
									</Button>
								</Link>
							</SheetClose>
						</div>
					</SignedOut>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNav;
