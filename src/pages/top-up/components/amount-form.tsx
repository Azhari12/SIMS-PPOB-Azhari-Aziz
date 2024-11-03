import { request } from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	formatCurrencyValue,
	formatToIndonesianCurrency,
} from "@/helper/currency-formatter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Banknote, Check, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import logo from "@/assets/Logo.png";
import { cn } from "@/lib/utils";
import { useBalanceQuery } from "@/hooks/main-page.hook";

const FormSchema = z.object({
	amount: z
		.number()
		.min(1, "nominal tidak boleh kosong")
		.min(10000, "nominal tidak boleh kurang dari 10.000")
		.max(1000000, "nominal tidak boleh melebihi 1.000.000"),
});

const AmountForm = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			amount: undefined,
		},
	});
	const { formState } = form;

	const navigate = useNavigate();
	const balanceQuery = useBalanceQuery({ isEnable: false });

	const [currencyValue, setCurrencyValue] = useState("");
	const [modal, setModal] = useState(false);
	const [modalMode, setModalMode] = useState<
		"confirmation" | "success" | "fail" | ""
	>("");

	const quickAmount = [10000, 20000, 50000, 100000, 250000, 500000];

	const onSubmit = form.handleSubmit((data: z.infer<typeof FormSchema>) => {
		setModal(false);
		console.log(data);
		const payload = {
			top_up_amount: data.amount,
		};
		mutationLogin.mutateAsync(payload);
	});

	const mutationLogin = useMutation({
		mutationKey: [`topup`],
		async mutationFn(payload: { top_up_amount: number }) {
			const [apiPath] = this.mutationKey as [string];
			const getMethod = async () => {
				return await request.post(apiPath, payload);
			};
			const apiResponse = await getMethod();
			return apiResponse.data;
		},
		onError() {
			setModal(true);
			setModalMode("fail");
		},
		onSuccess() {
			form.reset();
			setCurrencyValue("");
			balanceQuery.refetch();
			setModal(true);
			setModalMode("success");
		},
	});

	const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		const formattedValue = formatToIndonesianCurrency(value);
		setCurrencyValue(String(formattedValue));
		form.setValue("amount", Number(formatCurrencyValue(value)));
	};

	const handleQuickAmount = (amount: number) => {
		setCurrencyValue(amount.toLocaleString("id-ID"));
		form.setValue("amount", amount);
	};

	const handleModal = (type: "confirmation" | "success" | "fail" | "") => {
		setModal(true);
		setModalMode(type);
	};

	return (
		<div className="w-full flex gap-8">
			<Form {...form}>
				<div className="flex flex-col gap-3 w-2/3">
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="masukkan nominal Top Up"
										iconLeft={<Banknote size={14} />}
										filled={
											form.watch("amount") !== undefined &&
											!Number.isNaN(form.watch("amount"))
										}
										error={!!formState.errors.amount}
										value={currencyValue}
										onChange={(e) => {
											handleCurrencyChange(e);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						variant={!form.watch("amount") ? "disable" : "default"}
						disabled={!form.watch("amount")}
						className="mt-3"
						onClick={() => handleModal("confirmation")}
					>
						Top Up
					</Button>
				</div>
			</Form>
			<div className="grid grid-cols-3 gap-y-3 gap-x-2">
				{quickAmount.map((item) => {
					return (
						<div
							onClick={() => handleQuickAmount(item)}
							key={item}
							className="border rounded-lg p-3 text-sm font-medium flex justify-center items-center cursor-pointer hover:bg-slate-100"
						>
							Rp{item.toLocaleString("id-ID")}
						</div>
					);
				})}
			</div>

			<Dialog open={modal} onOpenChange={setModal}>
				<DialogHeader>
					<DialogTitle></DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<DialogContent className="w-[20rem] flex flex-col justify-center items-center gap-5">
					{modalMode === "confirmation" ? (
						<img src={logo} alt="logo" className="w-14 h-14 aspect-square" />
					) : (
						<div
							className={cn(
								"p-4 rounded-full",
								modalMode === "success" ? "bg-[#52bd94]" : "bg-primary"
							)}
						>
							{modalMode === "success" ? (
								<Check size={20} color="white" strokeWidth={3} />
							) : (
								<X size={20} color="white" strokeWidth={3} />
							)}
						</div>
					)}

					<div className="space-y-1 text-center">
						<p>
							{modalMode === "confirmation"
								? "Anda yakin Top Up sebesar"
								: "Top Up Sebesar"}
						</p>
						<h4 className="font-semibold">
							Rp{currencyValue} {modalMode === "confirmation" && " ?"}
						</h4>
						{modalMode === "success" ? (
							<p>berhasil!</p>
						) : modalMode === "fail" ? (
							<p>gagal!</p>
						) : null}
					</div>
					<p
						onClick={() => {
							if (modalMode === "confirmation") onSubmit();
							else navigate("/");
						}}
						className="mt-3 text-primary font-semibold hover:bg-primary-foreground p-2 rounded-xl cursor-pointer"
					>
						{modalMode === "confirmation"
							? "Ya, lanjutkan Top Up"
							: "Kembali ke Beranda"}
					</p>
					{modalMode === "confirmation" && (
						<p
							className="font-semibold text-gray-400 cursor-pointer"
							onClick={() => setModal(false)}
						>
							Batalkan
						</p>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AmountForm;
