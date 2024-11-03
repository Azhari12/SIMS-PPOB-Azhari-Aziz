/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from "@/assets/Logo.png";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, LockKeyhole, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/api/axios";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Cookies } from "react-cookie";
import { toast } from "sonner";

const FormSchema = z.object({
	email: z.string().min(1, "email tidak boleh kosong").email({
		message: "email tidak valid",
	}),
	password: z
		.string()
		.min(1, "password tidak boleh kosong")
		.min(8, "password minimal terdiri dari 8 karakter"),
});

const LoginPage = () => {
	const navigate = useNavigate();
	const cookies = new Cookies();

	const [error, setError] = useState("");
	const [errorToast, setErrorToast] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const { formState } = form;

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		const payload = {
			email: data.email,
			password: data.password,
		};
		mutationLogin.mutateAsync(payload);
	};

	const mutationLogin = useMutation({
		mutationKey: [`login`],
		async mutationFn(payload: z.infer<typeof FormSchema>) {
			const [apiPath] = this.mutationKey as [string];
			const getMethod = async () => {
				return await request.post(apiPath, payload);
			};
			const apiResponse = await getMethod();
			return apiResponse.data;
		},
		onError(error: any) {
			const { response } = error;
			setError(response.data.message);
			setErrorToast(true);
		},
		onSuccess(responseData) {
			console.log(responseData);
			cookies.set("ppobAccessToken", responseData.data.token, {
				path: "/",
				maxAge: 43200,
			});
			toast.success(responseData.message);
			navigate("/");
		},
	});

	return (
		<>
			<div className="flex flex-col items-center gap-5">
				<div className="flex gap-3">
					<img alt="logo" src={logo} className="object-contain" />
					<h3 className="font-semibold">SIMS PPOB</h3>
				</div>
				<h2 className="font-medium w-3/4 text-wrap text-center">
					Masuk atau buat akun untuk memulai
				</h2>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-3 w-4/5"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="email"
											placeholder="masukkan email anda"
											iconLeft={<AtSign size={14} />}
											filled={form.watch("email") !== ""}
											error={!!formState.errors.email || !!error}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<InputPassword
											placeholder="masukkan password anda"
											iconLeft={<LockKeyhole size={14} />}
											filled={form.watch("password") !== ""}
											error={!!formState.errors.password || !!error}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={mutationLogin.isPending} className="mt-7" type="submit">
							Masuk
						</Button>
					</form>
				</Form>
				<p className="text-sm">
					belum punya akun? registrasi{" "}
					<span
						onClick={() => navigate("/registrasi")}
						className="text-primary font-semibold hover:cursor-pointer"
					>
						disini
					</span>
				</p>
			</div>
			<div
				className={cn(
					"absolute bottom-10 bg-primary-foreground rounded-sm p-1 px-3 transition-all text-sm w-[80%] text-primary font-normal flex justify-between items-center",
					errorToast ? "" : "hidden"
				)}
			>
				{error}
				<X
					className="cursor-pointer"
					onClick={() => setErrorToast(false)}
					size={16}
				/>
			</div>
		</>
	);
};

export default LoginPage;