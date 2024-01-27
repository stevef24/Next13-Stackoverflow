"use client";
import { AnswersSchema } from "@/lib/validations";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
	authorId: string;
	question: string;
	questionId: string;
}

const Answers = ({ authorId, question, questionId }: Props) => {
	const path = usePathname();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmittingAI, setIsSubmittingAI] = useState(false);
	const { theme } = useTheme();
	const editorRef = useRef(null);
	const form = useForm<z.infer<typeof AnswersSchema>>({
		resolver: zodResolver(AnswersSchema),
		defaultValues: {
			answer: "",
		},
	});
	const handleCreateAnswer = async (values: z.infer<typeof AnswersSchema>) => {
		setIsSubmitting(true);
		try {
			await createAnswer({
				content: values.answer,
				author: JSON.parse(authorId),
				path: path,
				question: JSON.parse(questionId),
			});

			form.reset();

			if (editorRef.current) {
				const editor = editorRef.current as any;
				editor.setContent("");
			}
		} catch (error) {
			throw Error("could not create answer");
		} finally {
			setIsSubmitting(false);
		}
	};

	const generateAIAnswer = async () => {
		if (!authorId) return;
		setIsSubmittingAI(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
				{
					method: "POST",
					body: JSON.stringify({
						question,
					}),
				}
			);

			const aiAnswer = await response.json();

			const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");

			if (editorRef.current) {
				const editor = editorRef.current as any;
				editor.setContent(formattedAnswer);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsSubmittingAI(false);
		}
	};

	return (
		<div>
			<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
				<h4 className="paragraph-semibold text-dark400_light800">
					Write your answer here
				</h4>
				<Button
					onClick={generateAIAnswer}
					className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
				>
					{isSubmittingAI ? (
						<></>
					) : (
						<>
							<Image
								src={"/assets/icons/stars.svg"}
								alt="star"
								width={12}
								height={12}
								className="object-contain "
							/>
						</>
					)}
					Generate AI answer
				</Button>
			</div>
			<Form {...form}>
				<form
					className="mt-6 flex w-full flex-col gap-10"
					onSubmit={form.handleSubmit(handleCreateAnswer)}
				>
					<FormField
						control={form.control}
						name="answer"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="paragraph-semibold text-dark400_light800">
									Your Answer
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
										initialValue=""
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
											content_style:
												"body { font-family:Inter; font-size:16px }",
											skin: theme === "dark" ? "oxide-dark" : "oxide",
											content_css: theme === "dark" ? "dark" : "light",
										}}
									/>
								</FormControl>
								<FormDescription className="body-regular mt-2.5 text-light-500">
									Introduce the solution and provide the necessary steps to
									solve the problem.
								</FormDescription>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>

					<div className="flex justify-end">
						<Button
							type="submit"
							className="primary-gradient w-fit"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Submitting..." : "Submit"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Answers;
