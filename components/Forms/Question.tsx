"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { QuestionsSchema } from "@/lib/validations";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

type Props = {
	type?: string;
	mongoUserId: string;
	questionDetails?: string;
};

const Question = ({ mongoUserId, type, questionDetails }: Props) => {
	const { theme } = useTheme();
	const editorRef = useRef(null);
	const router = useRouter();
	const path = usePathname();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const parsedquestionDetails =
		questionDetails && JSON.parse(questionDetails || "");

	const groupedTags = parsedquestionDetails?.tags.map((tag: any) => tag.name);

	const form = useForm<z.infer<typeof QuestionsSchema>>({
		resolver: zodResolver(QuestionsSchema),
		defaultValues: {
			title: parsedquestionDetails?.title || "",
			content: parsedquestionDetails?.content || "",
			tags: groupedTags || [],
		},
	});
	const onSubmit = async (data: z.infer<typeof QuestionsSchema>) => {
		setIsSubmitting(true);

		try {
			if (type === "edit") {
				await editQuestion({
					questionId: parsedquestionDetails.id,
					title: data.title,
					content: data.content,
					path: path,
				});
				router.push(`/question/${parsedquestionDetails.id}`);
			} else {
				await createQuestion({
					title: data.title,
					content: data.content,
					tags: data.tags,
					author: JSON.parse(mongoUserId),
					path: path,
				});
			}
			form.reset();
		} catch (err) {
			throw new Error("Failed to submit question");
		} finally {
			setIsSubmitting(false);
			router.push("/");
		}
	};

	function handleTagRemove(tag: string) {
		form.setValue(
			"tags",
			form.getValues("tags").filter((t: string) => t !== tag)
		);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, field: any) {
		if (e.key === "Enter" && field.name === "tags") {
			e.preventDefault();

			const tagInput = e.target as HTMLInputElement;

			const tagValue = tagInput.value.trim();

			if (tagValue !== "") {
				if (tagValue.length > 15) {
					return form.setError("tags", {
						type: "required",
						message: "Tag must be less than 15 characters",
					});
				}

				if (!field.value.includes(tagValue)) {
					form.setValue("tags", [...field.value, tagValue]);
					tagInput.value = "";
					form.clearErrors("tags");
				}
			} else {
				form.trigger();
			}
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem className="flex w-full flex-col">
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Question Title <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Input
									placeholder="your question"
									className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light900 min-h-[56px] border"
									{...field}
								/>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Be specific and imagine you’re asking a question to another
								person.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Detailed content of your problem
								<span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<Editor
									apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
									onInit={(evt, editor) => {
										// @ts-ignore
										editorRef.current = editor;
									}}
									onBlur={field.onBlur}
									onEditorChange={(content) => {
										field.onChange(content);
									}}
									initialValue={parsedquestionDetails?.content || ""}
									init={{
										height: 350,
										menubar: false,
										plugins: [
											"advlist",
											"autolink",
											"lists",
											"link",
											"image",
											"charmap",
											"preview",
											"anchor",
											"searchreplace",
											"visualblocks",
											"codesample",
											"fullscreen",
											"insertdatetime",
											"media",
											"table",
										],
										toolbar:
											"undo redo | " +
											"codesample | bold italic forecolor | alignleft aligncenter |" +
											"alignright alignjustify | bullist numlist",
										content_style: "body { font-family:Inter; font-size:16px }",
										skin: theme === "dark" ? "oxide-dark" : "oxide",
										content_css: theme === "dark" ? "dark" : "light",
									}}
								/>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Introduce the problem and expand the context of the question.
								Minimum 20 characters.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="tags"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="paragraph-semibold text-dark400_light800">
								Tags <span className="text-primary-500">*</span>
							</FormLabel>
							<FormControl className="mt-3.5">
								<>
									<Input
										disabled={type === "Edit"}
										placeholder="tags"
										className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
										onKeyDown={(e) => {
											handleKeyDown(e, field);
										}}
									/>
									{field.value.length > 0 && (
										<div className="flex-start mt-2.5 gap-2/5">
											{field.value.map((tag: any) => (
												<Badge
													key={tag}
													className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md mr-1 brder-none px-4 py-2 capitalize"
													onClick={() => handleTagRemove(tag)}
												>
													{tag}

													{type === "create" && (
														<Image
															src="/assets/icons/close.svg"
															alt={"Close icon"}
															width={12}
															height={12}
															className="cursor-pointer object-contain invert-0 dark:invert"
														/>
													)}
												</Badge>
											))}
										</div>
									)}
								</>
							</FormControl>
							<FormDescription className="body-regular mt-2.5 text-light-500">
								Add up to 3 tags to describe what your question is about. You
								need to press enter to add a tag.
							</FormDescription>
							<FormMessage className="text-red-500" />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					className="primary-gradient !text-light-900"
					disabled={isSubmitting}
					onClick={() => onSubmit(form.getValues())}
				>
					{isSubmitting ? (
						<>{type === "Edit" ? "Editing..." : "Posting..."}</>
					) : (
						<>{type === "Edit" ? "Edit Question" : "Ask a Question"}</>
					)}
				</Button>
			</form>
		</Form>
	);
};

export default Question;
