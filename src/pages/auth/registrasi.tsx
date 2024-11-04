/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/api/axios";
import logo from "@/assets/Logo.png";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AtSign, LockKeyhole, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z
	.object({
		email: z.string().min(1, "email tidak boleh kosong").email({
			message: "Email tidak valid",
		}),
		first_name: z.string().min(1, "nama depan tidak boleh kosong"),
		last_name: z.string().min(1, "nama belakang tidak boleh kosong"),
		password: z
			.string()
			.min(1, "password tidak boleh kosong")
			.min(8, "Password minimal terdiri dari 8 karakter"),
		confirm_password: z.string().min(1, "konfirmasi password tidak boleh kosong"),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Password tidak sama",
		path: ["confirm_password"],
	});

const RegisterPage = () => {
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirm_password: "",
			first_name: "",
			last_name: "",
		},
	});
	const { formState } = form;

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		console.log(data);
		const payload = {
			email: data.email,
			first_name: data.first_name,
			last_name: data.last_name,
			password: data.password,
		};
		mutationRegister.mutateAsync(payload);
	};

	const mutationRegister = useMutation({
		mutationKey: [`registration`],
		async mutationFn(payload: any) {
			const [apiPath] = this.mutationKey as [string];
			const getMethod = async () => {
				return await request.post(apiPath, payload);
			};
			const apiResponse = await getMethod();
			return apiResponse.data;
		},
		onError(error: any) {
			const { response } = error;
			toast.error(response.data.message);
		},
		onSuccess(responseData) {
			toast.success(responseData.message);
			form.reset();
			form.setValue("confirm_password", "");
		},
	});

	return (
		<div className="flex flex-col items-center gap-5">
			<div className="flex gap-3">
				<img
					alt="logo"
					src={logo}
					className="object-contain w-5 lg:w-8 aspect-square"
				/>
				<h2 className="font-bold text-lg lg:text-2xl">SIMS PPOB</h2>
			</div>
			<h1 className="font-bold text-xl lg:text-4xl w-full lg:w-3/4 text-wrap text-center">
				Lengkapi data untuk membuat akun
			</h1>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-3 w-full lg:w-4/5"
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
										error={!!formState.errors.email}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="first_name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										type="text"
										placeholder="nama depan"
										iconLeft={<User size={14} />}
										filled={form.watch("first_name") !== ""}
										error={!!formState.errors.first_name}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="last_name"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										type="text"
										placeholder="nama belakang"
										iconLeft={<User size={14} />}
										filled={form.watch("last_name") !== ""}
										error={!!formState.errors.last_name}
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
										placeholder="buat password"
										iconLeft={<LockKeyhole size={14} />}
										filled={form.watch("password") !== ""}
										error={!!formState.errors.password}
										{...field}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="confirm_password"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<InputPassword
										placeholder="konfirmasi password"
										iconLeft={<LockKeyhole size={14} />}
										filled={form.watch("confirm_password") !== ""}
										error={!!formState.errors.confirm_password}
										{...field}
									/>
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						disabled={mutationRegister.isPending}
						className="mt-7"
						type="submit"
					>
						Registrasi
					</Button>
				</form>
			</Form>
			<p className="text-sm text-gray-500 font-semibold">
				sudah punya akun? login{" "}
				<span
					onClick={() => navigate("/login")}
					className="text-primary font-semibold hover:cursor-pointer"
				>
					disini
				</span>
			</p>
		</div>
	);
};

export default RegisterPage;
