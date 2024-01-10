"use client";

import { EditUserSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";

interface Props {
	clerkId: string;
	user: string;
}

const Profile = ({ clerkId, user }: Props) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const path = usePathname();
	const parsedUser = JSON.parse(user);

	const form = useForm<z.infer<typeof EditUserSchema>>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			username: parsedUser.username || "",
			name: parsedUser.name || "",
			bio: parsedUser.bio || "",
			portfolioWebsite: parsedUser.portfolioWebsite || "",
			location: parsedUser.location || "",
		},
	});

	async function onSubmit(values: z.infer<typeof EditUserSchema>) {
		const { name, username, bio, portfolioWebsite, location } = values;
		setIsSubmitting(true);

		try {
			await updateUser({
				clerkId: clerkId,
				updateData: {
					name,
					username,
					bio,
					portfolioWebsite,
					location,
				},
				path: path,
			});
			router.back();
		} catch (error) {
		} finally {
			setIsSubmitting(false);
		}
	}
	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="mt-9 flex flex-col w-full gap-9"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="space-y-3.5">
								<FormLabel className="text-dark300_light700">
									Name <span className="text-primary-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="full name"
										className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem className="space-y-3.5">
								<FormLabel className="text-dark300_light700">
									User name <span className="text-primary-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Username"
										className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="portfolioWebsite"
						render={({ field }) => (
							<FormItem className="space-y-3.5">
								<FormLabel className="text-dark300_light700">
									Portfolio Website <span className="text-primary-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										type="url"
										placeholder="portfolio url"
										className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem className="space-y-3.5">
								<FormLabel className="text-dark300_light700">
									Location <span className="text-primary-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="location"
										className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem className="space-y-3.5">
								<FormLabel className="text-dark300_light700">
									Bio <span className="text-primary-500">*</span>
								</FormLabel>
								<FormControl>
									<Input
										placeholder="bio"
										className="no-focus paragraph-regular light-border-2 background-light700_dark300 text-dark300_light700 min-h-[56px] border"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex w-full justify-end">
						<Button
							type="submit"
							className="primary-gradient !text-light-900 w-[175px] h-[46px]"
							onClick={() => onSubmit(form.getValues())}
							disabled={isSubmitting}
							size="lg"
						>
							{isSubmitting ? "saving..." : "save"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
};

export default Profile;
