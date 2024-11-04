/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import DummyProfile from "@/assets/Profile Photo.png";
import { AtSign, Pencil, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientLogout } from "@/hooks/private.hook";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { request } from "@/api/axios";
import { toast } from "sonner";
import { setUser } from "@/store/slices/user-slice";
import { ImageChecker } from "@/helper/image-checker";
import { ClipLoader } from "react-spinners";
import { useMutation } from "@tanstack/react-query";

const FormSchema = z.object({
	email: z.string().min(1, "email tidak boleh kosong").email({
		message: "Email tidak valid",
	}),
	first_name: z.string().min(1, "nama depan tidak boleh kosong"),
	last_name: z.string().min(1, "nama belakang tidak boleh kosong"),
});

const AccountPage = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const mode = queryParams.get("mode");
	const navigate = useNavigate();
	const user = useSelector((state: RootState) => state.user.user);
	const dispatch = useDispatch<AppDispatch>();
	const logout = useClientLogout();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [errorFile, setErrorFile] = useState("");

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			email: "",
			first_name: "",
			last_name: "",
		},
	});
	const { formState } = form;

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		const payload = {
			email: data.email,
			first_name: data.first_name,
			last_name: data.last_name,
		};
		mutationAccount.mutateAsync(payload);
	};

	const mutationAccount = useMutation({
		mutationKey: [`profile/update`],
		async mutationFn(payload: any) {
			const [apiPath] = this.mutationKey as [string];
			const apiResponse = await await request.put(apiPath, payload);
			return apiResponse.data;
		},
		onError(error: any) {
			const { response } = error;
			toast.error(response.data.message);
		},
		onSuccess(responseData) {
			toast.success(responseData.message);
			dispatch(setUser(responseData.data));
		},
	});

	const assignValue = () => {
		form.setValue("email", user.email);
		form.setValue("first_name", user.first_name);
		form.setValue("last_name", user.last_name);
	};

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const formData = new FormData();
			formData.append("file", file);
			if (file.size > 100 * 1024) {
				setErrorFile("ukuran file tidak boleh melebihi 100 KB");
				toast.error("gagal mengganti foto profile");
				return;
			}
			setErrorFile("");
			request
				.put("profile/image", formData)
				.then((res) => {
					toast.success(res.data.message);
					const { data } = res.data;
					dispatch(setUser(data));
				})
				.catch((error) => {
					toast.error(error.response.data.message);
				});
		}
	};
	useEffect(() => {
		if (user) assignValue();
	}, [user]);

	return (
		<section className="flex flex-col items-center w-full gap-5">
			<div onClick={handleImageClick} className="relative group cursor-pointer">
				<Avatar className="w-[8rem] h-[8rem] aspect-square">
					<AvatarImage
						src={ImageChecker(user.profile_image) ?? DummyProfile}
						alt="profile_image"
					/>
					<AvatarFallback>
						<ClipLoader />
					</AvatarFallback>
				</Avatar>
				<div className="p-2 rounded-full bg-white  border-2 border-gray-300 absolute right-0 bottom-0 z-50">
					<Pencil color="black" size={14} />
				</div>
				<div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 z-40" />
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="hidden"
					aria-label="Update profile picture"
				/>
			</div>
			{errorFile && (
				<div className="-mt-3 text-red-500 text-sm text-center">{errorFile}</div>
			)}
			<h1 className="font-bold capitalize">
				{user.first_name + " " + user.last_name}
			</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-5 w-full lg:w-3/5"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="masukkan email anda"
										iconLeft={<AtSign size={14} />}
										filled={form.watch("email") !== ""}
										error={!!formState.errors.email}
										disabled
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
								<FormLabel>Nama Depan</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="nama depan"
										iconLeft={<User size={14} />}
										filled={form.watch("first_name") !== ""}
										error={!!formState.errors.first_name}
										disabled={mode !== "edit"}
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
								<FormLabel>Nama Belakang</FormLabel>
								<FormControl>
									<Input
										type="text"
										placeholder="nama belakang"
										iconLeft={<User size={14} />}
										filled={form.watch("last_name") !== ""}
										error={!!formState.errors.last_name}
										disabled={mode !== "edit"}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{mode === "edit" && (
						<Button
							// disabled={mutationRegister.isPending}
							type="submit"
						>
							Simpan
						</Button>
					)}
				</form>
			</Form>

			{mode !== "edit" && (
				<div className="w-full lg:w-3/5 space-y-5">
					{" "}
					<Button
						onClick={() => navigate("?mode=edit")}
						className=" w-full"
						type="submit"
					>
						Edit Profile
					</Button>{" "}
					<Button
						onClick={logout}
						variant={"outline"}
						className="w-full text-primary border-primary hover:text-primary"
						type="submit"
					>
						Logout
					</Button>{" "}
				</div>
			)}
			{mode === "edit" && (
				<div className="w-full lg:w-3/5 space-y-5">
					{" "}
					<Button
						onClick={() => navigate("/akun")}
						variant={"outline"}
						className="w-full text-primary border-primary hover:text-primary"
						type="submit"
					>
						Batalkan
					</Button>{" "}
				</div>
			)}
		</section>
	);
};

export default AccountPage;
